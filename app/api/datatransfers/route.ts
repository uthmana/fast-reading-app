import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { extractPrismaErrorMessage } from "@/lib/extractPrismaErrorMessage/extractPrismaErrorMessage";
import {
  DATA_TYPES,
  DATA_TYPE_META,
  DataType,
  IMPORT_ORDER,
  ImportSummary,
  isDataType,
} from "@/lib/datatransfers/meta";
import { HANDLERS } from "@/lib/datatransfers/entities";

const MAX_IMPORT_ROWS = 5000;

const isAdmin = async () => {
  const session: any = await getServerSession(authOptions as any);
  return session?.user?.role === "ADMIN";
};

const forbidden = () =>
  NextResponse.json({ error: "Yetkisiz erişim" }, { status: 403 });

// GET /api/datatransfers?type=categories      -> flat rows for one type
// GET /api/datatransfers?type=all             -> { categories: rows, ... } for every type
export async function GET(req: NextRequest) {
  if (!(await isAdmin())) return forbidden();

  const type = new URL(req.url).searchParams.get("type");
  const isAll = type === "all";
  if (!isAll && !isDataType(type)) {
    return NextResponse.json({ error: "Geçersiz veri türü" }, { status: 400 });
  }

  try {
    if (isAll) {
      const out: Partial<Record<DataType, unknown[]>> = {};
      for (const t of DATA_TYPES) {
        out[t] = await HANDLERS[t].exportRows();
      }
      return NextResponse.json(out, { status: 200 });
    }
    const rows = await HANDLERS[type as DataType].exportRows();
    return NextResponse.json(rows, { status: 200 });
  } catch (err) {
    console.error("Data export error:", err);
    const { userMessage, technicalMessage } = extractPrismaErrorMessage(err);
    return NextResponse.json(
      { error: userMessage, details: technicalMessage },
      { status: 500 },
    );
  }
}

async function importSheet(type: DataType, data: unknown): Promise<ImportSummary> {
  const summary: ImportSummary = { created: 0, updated: 0, errors: [] };
  const meta = DATA_TYPE_META[type];
  const handler = HANDLERS[type];

  if (!meta.importable || !handler.importRow) {
    summary.errors.push(`${meta.label} içe aktarılamaz (yalnızca dışa aktarılabilir).`);
    return summary;
  }
  if (!Array.isArray(data)) {
    summary.errors.push("Geçersiz veri biçimi.");
    return summary;
  }
  if (data.length > MAX_IMPORT_ROWS) {
    summary.errors.push(`Tek seferde en fazla ${MAX_IMPORT_ROWS} satır içe aktarılabilir.`);
    return summary;
  }

  // Rows are processed one by one so a bad row is reported without
  // stopping the rest. Row numbers match Excel (header is row 1).
  for (let i = 0; i < data.length; i++) {
    const excelRow = i + 2;
    const row = data[i];

    if (!row || typeof row !== "object" || Array.isArray(row)) {
      summary.errors.push(`Satır ${excelRow}: Geçersiz satır`);
      continue;
    }

    try {
      const outcome = await handler.importRow!(row as Record<string, unknown>);
      if (outcome === "created") summary.created++;
      else summary.updated++;
    } catch (err: any) {
      const isPrisma = typeof err?.code === "string" && err.code.startsWith("P");
      const message = isPrisma
        ? extractPrismaErrorMessage(err).userMessage
        : err?.message || "Bilinmeyen hata";
      summary.errors.push(`Satır ${excelRow}: ${message}`);
    }
  }
  return summary;
}

// POST /api/datatransfers
//   { type, data: rows[] }        -> import one type
//   { sheets: { [type]: rows[] } } -> import many types in dependency order
// Response: { results: { [type]: { created, updated, errors } } }
export async function POST(req: NextRequest) {
  if (!(await isAdmin())) return forbidden();

  const body = await req.json().catch(() => null);

  let sheets: Record<string, unknown>;
  if (body?.sheets && typeof body.sheets === "object" && !Array.isArray(body.sheets)) {
    sheets = body.sheets;
  } else if (isDataType(body?.type)) {
    sheets = { [body.type]: body.data };
  } else {
    return NextResponse.json({ error: "Geçersiz istek" }, { status: 400 });
  }

  const unknown = Object.keys(sheets).filter((k) => !isDataType(k));
  if (unknown.length) {
    return NextResponse.json(
      { error: `Bilinmeyen veri türü: ${unknown.join(", ")}` },
      { status: 400 },
    );
  }

  const results: Partial<Record<DataType, ImportSummary>> = {};
  for (const type of IMPORT_ORDER) {
    if (type in sheets) {
      results[type] = await importSheet(type, sheets[type]);
    }
  }
  // Export-only types requested in a sheets payload are reported, not ignored.
  for (const key of Object.keys(sheets)) {
    if (isDataType(key) && !(key in results)) {
      results[key] = await importSheet(key, sheets[key]);
    }
  }

  return NextResponse.json({ results }, { status: 200 });
}
