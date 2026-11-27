"use client";

import React, { useState, useCallback, useRef } from "react";
import {
  MdFileDownload,
  MdFileUpload,
  MdCategory,
  MdOutlineArticle,
  MdFitnessCenter,
  MdTranslate,
  MdClass,
  MdSchool,
  MdPeople,
  MdMenuBook,
  MdAssignment,
  MdMenu,
  MdList,
  MdPersonAdd,
  MdBusiness,
  MdAssessment,
  MdCheckCircle,
  MdError,
  MdInfo,
  MdClose,
  MdCloudUpload,
  MdLibraryBooks,
} from "react-icons/md";
import * as XLSX from "xlsx";
import saveAs from "file-saver";

import {
  DATA_TYPES,
  DATA_TYPE_META,
  DataType,
  ImportSummary,
} from "@/app/(admin)/admin/(utils)/lib/datatransfers/meta";
import { exportToExcel } from "../(utils)/helpers";
import { fetchData } from "../(utils)/lib/fetchData/fetchData";

type OperationStatus = "idle" | "loading" | "success" | "error";
type Results = Partial<Record<DataType, ImportSummary>>;

interface SheetData {
  type: DataType;
  rows: any[];
}

const TAB_ICONS: Record<DataType, React.ReactNode> = {
  categories: <MdCategory className="w-5 h-5" />,
  articles: <MdOutlineArticle className="w-5 h-5" />,
  exercises: <MdFitnessCenter className="w-5 h-5" />,
  words: <MdTranslate className="w-5 h-5" />,
  classes: <MdClass className="w-5 h-5" />,
  teachers: <MdSchool className="w-5 h-5" />,
  students: <MdPeople className="w-5 h-5" />,
  lessons: <MdMenuBook className="w-5 h-5" />,
  lessonExercises: <MdAssignment className="w-5 h-5" />,
  menuItems: <MdMenu className="w-5 h-5" />,
  menuSubItems: <MdList className="w-5 h-5" />,
  registrations: <MdPersonAdd className="w-5 h-5" />,
  subscribers: <MdBusiness className="w-5 h-5" />,
  attempts: <MdAssessment className="w-5 h-5" />,
};

// Maps a sheet name (Turkish label or type key) to a data type.
const matchSheetToType = (name: string): DataType | null => {
  const n = name.trim().toLocaleLowerCase("tr");
  return (
    DATA_TYPES.find(
      (t) =>
        DATA_TYPE_META[t].label.toLocaleLowerCase("tr") === n ||
        t.toLowerCase() === n,
    ) ?? null
  );
};

const readWorkbook = async (file: File) => {
  const buffer = await file.arrayBuffer();
  // cellDates: Excel date cells arrive as Date objects (sent as ISO text)
  return XLSX.read(new Uint8Array(buffer), { type: "array", cellDates: true });
};

const ResultsView = ({ results }: { results: Results }) => {
  const entries = DATA_TYPES.filter((t) => results[t]);
  return (
    <div className="mt-4 border border-gray-200 rounded-xl overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
          <tr>
            <th className="px-3 py-2 text-left">Veri türü</th>
            <th className="px-3 py-2 text-right">Yeni</th>
            <th className="px-3 py-2 text-right">Güncellenen</th>
            <th className="px-3 py-2 text-right">Hata</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((t) => {
            const r = results[t]!;
            return (
              <tr key={t} className="border-t border-gray-100">
                <td className="px-3 py-2 text-gray-700">
                  {DATA_TYPE_META[t].label}
                </td>
                <td className="px-3 py-2 text-right text-green-600">
                  {r.created}
                </td>
                <td className="px-3 py-2 text-right text-blue-600">
                  {r.updated}
                </td>
                <td
                  className={`px-3 py-2 text-right ${r.errors.length ? "text-amber-600" : "text-gray-400"}`}
                >
                  {r.errors.length}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {entries.some((t) => results[t]!.errors.length > 0) && (
        <ul className="px-4 py-3 bg-amber-50 text-amber-700 text-xs space-y-1 max-h-48 overflow-y-auto">
          {entries.flatMap((t) =>
            results[t]!.errors.map((err, i) => (
              <li key={`${t}-${i}`}>
                <strong>{DATA_TYPE_META[t].label}</strong> – {err}
              </li>
            )),
          )}
        </ul>
      )}
    </div>
  );
};

export default function DataTransfersPage() {
  const [activeTab, setActiveTab] = useState<DataType>("categories");

  // --- single type state ---
  const [exportStatus, setExportStatus] = useState<OperationStatus>("idle");
  const [importStatus, setImportStatus] = useState<OperationStatus>("idle");
  const [importResult, setImportResult] = useState<ImportSummary | null>(null);
  const [statusMessage, setStatusMessage] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewData, setPreviewData] = useState<any[] | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- all-types state ---
  const [allExportStatus, setAllExportStatus] =
    useState<OperationStatus>("idle");
  const [allMessage, setAllMessage] = useState("");
  const [allFile, setAllFile] = useState<File | null>(null);
  const [allSheets, setAllSheets] = useState<SheetData[]>([]);
  const [allSkipped, setAllSkipped] = useState<string[]>([]);
  const [allImportStatus, setAllImportStatus] =
    useState<OperationStatus>("idle");
  const [allResults, setAllResults] = useState<Results | null>(null);
  const allInputRef = useRef<HTMLInputElement>(null);

  const meta = DATA_TYPE_META[activeTab];

  // ===== SINGLE TYPE =====

  const handleExport = useCallback(async () => {
    setExportStatus("loading");
    setStatusMessage("");
    try {
      const rows = await fetchData({
        apiPath: `/api/datatransfers?type=${activeTab}`,
      });
      if (!Array.isArray(rows) || rows.length === 0) {
        setExportStatus("error");
        setStatusMessage("Dışa aktarılacak veri bulunamadı.");
        return;
      }
      exportToExcel(rows, DATA_TYPE_META[activeTab].fileName);
      setExportStatus("success");
      setStatusMessage(`${rows.length} kayıt başarıyla dışa aktarıldı.`);
    } catch (err: any) {
      setExportStatus("error");
      setStatusMessage(err.message || "Dışa aktarma sırasında hata oluştu.");
    }
  }, [activeTab]);

  const processFile = useCallback((file: File) => {
    setSelectedFile(file);
    setImportResult(null);
    setImportStatus("idle");

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array", cellDates: true });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        setPreviewData(jsonData.slice(0, 5));
        setStatusMessage(
          `${jsonData.length} satır okundu. İçe aktarmaya hazır.`,
        );
      } catch {
        setStatusMessage(
          "Dosya okunamadı. Lütfen geçerli bir Excel dosyası seçin.",
        );
        setSelectedFile(null);
        setPreviewData(null);
      }
    };
    reader.readAsArrayBuffer(file);
  }, []);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);
      const file = e.dataTransfer.files?.[0];
      if (file && (file.name.endsWith(".xlsx") || file.name.endsWith(".xls"))) {
        processFile(file);
      } else {
        setStatusMessage("Lütfen .xlsx veya .xls dosyası yükleyin.");
      }
    },
    [processFile],
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) processFile(file);
    },
    [processFile],
  );

  const handleImport = useCallback(async () => {
    if (!selectedFile) return;
    setImportStatus("loading");
    setStatusMessage("İçe aktarılıyor...");
    setImportResult(null);

    try {
      const workbook = await readWorkbook(selectedFile);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      const res = await fetch("/api/datatransfers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: activeTab, data: jsonData }),
      });
      const result = await res.json();

      if (!res.ok) {
        setImportStatus("error");
        setStatusMessage(result.error || "İçe aktarma başarısız.");
        return;
      }

      const summary: ImportSummary = result.results[activeTab];
      setImportResult(summary);
      setImportStatus("success");
      setStatusMessage(
        `İçe aktarma tamamlandı: ${summary.created} yeni, ${summary.updated} güncellendi.`,
      );
    } catch (err: any) {
      setImportStatus("error");
      setStatusMessage(err.message || "İçe aktarma sırasında hata oluştu.");
    }
  }, [selectedFile, activeTab]);

  const clearFile = () => {
    setSelectedFile(null);
    setPreviewData(null);
    setImportResult(null);
    setImportStatus("idle");
    setStatusMessage("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const switchTab = (key: DataType) => {
    setActiveTab(key);
    setExportStatus("idle");
    clearFile();
  };

  // ===== ALL TYPES =====

  const handleAllExport = async () => {
    setAllExportStatus("loading");
    setAllMessage("");
    try {
      const all = (await fetchData({
        apiPath: "/api/datatransfers?type=all",
      })) as Partial<Record<DataType, any[]>>;

      const workbook = XLSX.utils.book_new();
      let total = 0;
      let sheetCount = 0;
      for (const t of DATA_TYPES) {
        const rows = all?.[t] ?? [];
        if (rows.length === 0) continue;
        XLSX.utils.book_append_sheet(
          workbook,
          XLSX.utils.json_to_sheet(rows),
          DATA_TYPE_META[t].label,
        );
        total += rows.length;
        sheetCount++;
      }
      if (sheetCount === 0)
        throw new Error("Dışa aktarılacak veri bulunamadı.");

      const out = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
      const today = new Date().toISOString().slice(0, 10);
      saveAs(
        new Blob([out], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        }),
        `tum-veriler-${today}.xlsx`,
      );
      setAllExportStatus("success");
      setAllMessage(`${total} kayıt, ${sheetCount} sayfa olarak indirildi.`);
    } catch (err: any) {
      setAllExportStatus("error");
      setAllMessage(err.message || "Dışa aktarma sırasında hata oluştu.");
    }
  };

  const handleAllFile = async (file: File) => {
    setAllFile(file);
    setAllResults(null);
    setAllImportStatus("idle");
    setAllMessage("");
    try {
      const workbook = await readWorkbook(file);
      const sheets: SheetData[] = [];
      const skipped: string[] = [];
      for (const name of workbook.SheetNames) {
        const type = matchSheetToType(name);
        if (!type) {
          skipped.push(name);
          continue;
        }
        sheets.push({
          type,
          rows: XLSX.utils.sheet_to_json(workbook.Sheets[name]),
        });
      }
      setAllSheets(sheets);
      setAllSkipped(skipped);
      if (sheets.length === 0) {
        setAllMessage(
          "Dosyada tanınan bir sayfa bulunamadı. Sayfa adları veri türü adlarıyla aynı olmalıdır.",
        );
      }
    } catch {
      setAllFile(null);
      setAllSheets([]);
      setAllMessage("Dosya okunamadı. Lütfen geçerli bir Excel dosyası seçin.");
    }
  };

  const handleAllImport = async () => {
    const importable = allSheets.filter(
      (s) => DATA_TYPE_META[s.type].importable,
    );
    if (importable.length === 0) {
      setAllMessage("İçe aktarılacak sayfa yok.");
      return;
    }
    const totalRows = importable.reduce((n, s) => n + s.rows.length, 0);
    const confirmed = window.confirm(
      `${importable.length} sayfada toplam ${totalRows} satır içe aktarılacak. Yeni kayıtlar eklenecek, id veya benzersiz alanı eşleşen kayıtlar güncellenecek. Devam edilsin mi?`,
    );
    if (!confirmed) return;

    setAllImportStatus("loading");
    setAllMessage("İçe aktarılıyor...");
    setAllResults(null);
    try {
      const sheets = Object.fromEntries(
        importable.map((s) => [s.type, s.rows]),
      );
      const res = await fetch("/api/datatransfers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sheets }),
      });
      const json = await res.json();
      if (!res.ok) {
        setAllImportStatus("error");
        setAllMessage(json.error || "İçe aktarma başarısız.");
        return;
      }
      setAllResults(json.results);
      setAllImportStatus("success");
      setAllMessage("İçe aktarma tamamlandı.");
    } catch (err: any) {
      setAllImportStatus("error");
      setAllMessage(err.message || "İçe aktarma sırasında hata oluştu.");
    }
  };

  const clearAll = () => {
    setAllFile(null);
    setAllSheets([]);
    setAllSkipped([]);
    setAllResults(null);
    setAllImportStatus("idle");
    setAllMessage("");
    if (allInputRef.current) allInputRef.current.value = "";
  };

  return (
    <div className="w-full">
      {/* ===== ALL DATA ===== */}
      <section className="mb-10">
        <h2 className="text-lg font-semibold text-gray-700 mb-1">
          Tüm Veriler
        </h2>
        <p className="text-sm text-gray-500 mb-4">
          Bütün veri türleri tek bir Excel dosyasında, her biri ayrı bir sayfada
          olacak şekilde indirilir. Aynı dosya tekrar yüklenerek topluca içe
          aktarılabilir.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Export all */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 px-6 py-4 flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-lg">
                <MdLibraryBooks className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">
                  Tümünü Dışa Aktar
                </h3>
                <p className="text-emerald-100 text-sm">
                  Tek Excel dosyası, çok sayfalı
                </p>
              </div>
            </div>
            <div className="p-6">
              <button
                onClick={handleAllExport}
                disabled={allExportStatus === "loading"}
                className="w-full flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-300 text-white font-medium py-3 px-4 rounded-xl transition-colors duration-200"
              >
                {allExportStatus === "loading" ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <MdFileDownload className="w-5 h-5" />
                )}
                {allExportStatus === "loading"
                  ? "Hazırlanıyor..."
                  : "Tümünü Excel Olarak İndir"}
              </button>
              {allExportStatus === "success" && allMessage && (
                <div className="mt-4 flex items-center gap-2 text-emerald-600 text-sm bg-emerald-50 p-3 rounded-lg">
                  <MdCheckCircle className="w-5 h-5 shrink-0" />
                  {allMessage}
                </div>
              )}
              {allExportStatus === "error" && (
                <div className="mt-4 flex items-center gap-2 text-red-600 text-sm bg-red-50 p-3 rounded-lg">
                  <MdError className="w-5 h-5 shrink-0" />
                  {allMessage}
                </div>
              )}
            </div>
          </div>

          {/* Import all */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4 flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-lg">
                <MdFileUpload className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">
                  Tümünü İçe Aktar
                </h3>
                <p className="text-blue-100 text-sm">
                  Çok sayfalı Excel dosyasını yükleyin
                </p>
              </div>
            </div>
            <div className="p-6">
              <div
                onClick={() => allInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-200 mb-4 ${
                  allFile
                    ? "border-green-300 bg-green-50"
                    : "border-gray-300 hover:border-blue-300 hover:bg-gray-50"
                }`}
              >
                <input
                  ref={allInputRef}
                  type="file"
                  accept=".xlsx,.xls"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) handleAllFile(f);
                  }}
                />
                {allFile ? (
                  <div className="flex items-center justify-center gap-3">
                    <MdCheckCircle className="w-8 h-8 text-green-500" />
                    <p className="font-medium text-gray-700 break-all text-left">
                      {allFile.name}
                    </p>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        clearAll();
                      }}
                      className="ml-2 p-1 hover:bg-gray-200 rounded-full transition-colors"
                      aria-label="Dosyayı kaldır"
                    >
                      <MdClose className="w-5 h-5 text-gray-500" />
                    </button>
                  </div>
                ) : (
                  <>
                    <MdCloudUpload className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600 font-medium">Dosyayı seçin</p>
                    <p className="text-gray-400 text-sm mt-1">
                      .xlsx veya .xls
                    </p>
                  </>
                )}
              </div>

              {allSheets.length > 0 && (
                <div className="mb-4 p-3 bg-gray-50 rounded-xl border border-gray-200 text-sm">
                  <p className="font-medium text-gray-700 mb-2">
                    Bulunan sayfalar:
                  </p>
                  <ul className="space-y-1">
                    {allSheets.map((s) => (
                      <li
                        key={s.type}
                        className="flex justify-between text-gray-600"
                      >
                        <span>{DATA_TYPE_META[s.type].label}</span>
                        <span>
                          {DATA_TYPE_META[s.type].importable
                            ? `${s.rows.length} satır`
                            : "yalnızca dışa aktarılabilir"}
                        </span>
                      </li>
                    ))}
                  </ul>
                  {allSkipped.length > 0 && (
                    <p className="mt-2 text-xs text-gray-500">
                      Tanınmayan sayfalar atlanacak: {allSkipped.join(", ")}
                    </p>
                  )}
                </div>
              )}

              <button
                onClick={handleAllImport}
                disabled={
                  allSheets.length === 0 || allImportStatus === "loading"
                }
                className="w-full flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-xl transition-colors duration-200"
              >
                {allImportStatus === "loading" ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <MdFileUpload className="w-5 h-5" />
                )}
                {allImportStatus === "loading"
                  ? "İçe Aktarılıyor..."
                  : "Tümünü İçe Aktar"}
              </button>

              {allImportStatus === "success" && allResults && (
                <ResultsView results={allResults} />
              )}
              {allImportStatus === "error" && (
                <div className="mt-4 flex items-center gap-2 text-red-600 text-sm bg-red-50 p-3 rounded-lg">
                  <MdError className="w-5 h-5 shrink-0" />
                  {allMessage}
                </div>
              )}
              {allImportStatus === "idle" && allMessage && (
                <p className="mt-4 text-sm text-gray-500">{allMessage}</p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ===== SINGLE TYPE ===== */}
      <section>
        <h2 className="text-lg font-semibold text-gray-700 mb-3">
          Tek Veri Türü
        </h2>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-6 bg-gray-100 p-1 rounded-xl w-fit max-w-full">
          {DATA_TYPES.map((key) => (
            <button
              key={key}
              onClick={() => switchTab(key)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeTab === key
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }`}
            >
              {TAB_ICONS[key]}
              {DATA_TYPE_META[key].label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Export Card */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 p-2 rounded-lg">
                  <MdFileDownload className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    Dışa Aktar
                  </h3>
                  <p className="text-emerald-100 text-sm">
                    Mevcut verileri Excel olarak indirin
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="mb-5 p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                <div className="flex items-start gap-2">
                  <MdInfo className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" />
                  <div className="text-sm text-emerald-700">
                    <strong>{meta.label}</strong> tablosundaki tüm veriler Excel
                    dosyası (.xlsx) olarak indirilecektir.
                  </div>
                </div>
              </div>

              <button
                onClick={handleExport}
                disabled={exportStatus === "loading"}
                className="w-full flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-300 text-white font-medium py-3 px-4 rounded-xl transition-colors duration-200"
              >
                {exportStatus === "loading" ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <MdFileDownload className="w-5 h-5" />
                )}
                {exportStatus === "loading"
                  ? "İndiriliyor..."
                  : "Excel Olarak İndir"}
              </button>

              {exportStatus === "success" && (
                <div className="mt-4 flex items-center gap-2 text-emerald-600 text-sm bg-emerald-50 p-3 rounded-lg">
                  <MdCheckCircle className="w-5 h-5 shrink-0" />
                  {statusMessage}
                </div>
              )}
              {exportStatus === "error" && (
                <div className="mt-4 flex items-center gap-2 text-red-600 text-sm bg-red-50 p-3 rounded-lg">
                  <MdError className="w-5 h-5 shrink-0" />
                  {statusMessage}
                </div>
              )}
            </div>
          </div>

          {/* Import Card */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 p-2 rounded-lg">
                  <MdFileUpload className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    İçe Aktar
                  </h3>
                  <p className="text-blue-100 text-sm">
                    Excel dosyasından veri yükleyin
                  </p>
                </div>
              </div>
            </div>

            {!meta.importable ? (
              <div className="p-6">
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 text-sm text-gray-600 flex gap-2">
                  <MdInfo className="w-5 h-5 text-gray-400 shrink-0 mt-0.5" />
                  <span>
                    {meta.label} yalnızca dışa aktarılabilir. Bu veri türü için
                    içe aktarma yapılamaz.
                  </span>
                </div>
              </div>
            ) : (
              <div className="p-6">
                <div
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-200 mb-4 ${
                    dragActive
                      ? "border-blue-400 bg-blue-50"
                      : selectedFile
                        ? "border-green-300 bg-green-50"
                        : "border-gray-300 hover:border-blue-300 hover:bg-gray-50"
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".xlsx,.xls"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  {selectedFile ? (
                    <div className="flex items-center justify-center gap-3">
                      <MdCheckCircle className="w-8 h-8 text-green-500" />
                      <div className="text-left">
                        <p className="font-medium text-gray-700 break-all">
                          {selectedFile.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {(selectedFile.size / 1024).toFixed(1)} KB
                        </p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          clearFile();
                        }}
                        className="ml-2 p-1 hover:bg-gray-200 rounded-full transition-colors"
                        aria-label="Dosyayı kaldır"
                      >
                        <MdClose className="w-5 h-5 text-gray-500" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <MdCloudUpload className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-600 font-medium">
                        Dosyayı sürükleyip bırakın
                      </p>
                      <p className="text-gray-400 text-sm mt-1">
                        veya tıklayarak seçin (.xlsx, .xls)
                      </p>
                    </>
                  )}
                </div>

                {previewData && previewData.length > 0 && (
                  <div className="mb-4 border border-gray-200 rounded-xl overflow-hidden">
                    <div className="bg-gray-50 px-4 py-2 text-xs font-medium text-gray-500 uppercase tracking-wide">
                      Önizleme (ilk 5 satır)
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-gray-50">
                            {Object.keys(previewData[0]).map((key) => (
                              <th
                                key={key}
                                className="px-3 py-2 text-left text-xs font-medium text-gray-500 whitespace-nowrap"
                              >
                                {key}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {previewData.map((row, i) => (
                            <tr key={i} className="border-t border-gray-100">
                              {Object.values(row).map((val: any, j) => (
                                <td
                                  key={j}
                                  className="px-3 py-2 text-gray-600 whitespace-nowrap max-w-[200px] truncate"
                                >
                                  {val instanceof Date
                                    ? val.toISOString().slice(0, 10)
                                    : String(val ?? "")}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                <button
                  onClick={handleImport}
                  disabled={!selectedFile || importStatus === "loading"}
                  className="w-full flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-xl transition-colors duration-200"
                >
                  {importStatus === "loading" ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <MdFileUpload className="w-5 h-5" />
                  )}
                  {importStatus === "loading"
                    ? "İçe Aktarılıyor..."
                    : "İçe Aktar"}
                </button>

                {importStatus === "success" && importResult && (
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center gap-2 text-green-600 text-sm bg-green-50 p-3 rounded-lg">
                      <MdCheckCircle className="w-5 h-5 shrink-0" />
                      <span>
                        <strong>{importResult.created}</strong> yeni kayıt
                        oluşturuldu, <strong>{importResult.updated}</strong>{" "}
                        kayıt güncellendi.
                      </span>
                    </div>
                    {importResult.errors.length > 0 && (
                      <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                        <p className="text-amber-700 text-sm font-medium mb-1">
                          {importResult.errors.length} hata oluştu:
                        </p>
                        <ul className="text-amber-600 text-xs space-y-1 max-h-32 overflow-y-auto">
                          {importResult.errors.map((err, i) => (
                            <li key={i} className="flex items-start gap-1">
                              <span className="text-amber-400 mt-0.5">•</span>
                              {err}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
                {importStatus === "error" && (
                  <div className="mt-4 flex items-center gap-2 text-red-600 text-sm bg-red-50 p-3 rounded-lg">
                    <MdError className="w-5 h-5 shrink-0" />
                    {statusMessage}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Field Reference */}
        <div className="mt-6 bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <h3 className="text-base font-semibold text-gray-700 mb-4">
            Alan Bilgileri – <span className="text-blue-600">{meta.label}</span>
          </h3>
          <div
            className={`grid grid-cols-1 ${meta.importable ? "md:grid-cols-2" : ""} gap-4`}
          >
            {meta.importable && (
              <div>
                <h4 className="text-sm font-medium text-red-600 mb-2">
                  Zorunlu Alanlar
                </h4>
                <div className="flex flex-wrap gap-2">
                  {meta.required.map((f) => (
                    <span
                      key={f}
                      className="px-3 py-1 bg-red-50 text-red-700 text-sm rounded-lg border border-red-200 font-mono"
                    >
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            )}
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-2">
                {meta.importable
                  ? "Opsiyonel Alanlar"
                  : "Dışa Aktarılan Sütunlar"}
              </h4>
              <div className="flex flex-wrap gap-2">
                {meta.optional.map((f) => (
                  <span
                    key={f}
                    className="px-3 py-1 bg-gray-50 text-gray-600 text-sm rounded-lg border border-gray-200 font-mono"
                  >
                    {f}
                  </span>
                ))}
              </div>
            </div>
          </div>
          {meta.note && (
            <p className="mt-4 text-sm text-gray-500">
              <strong>Not:</strong> {meta.note}
            </p>
          )}
          <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
            <p className="text-sm text-blue-700">
              <strong>İpucu:</strong> Önce mevcut veriyi dışa aktararak Excel
              şablon formatını görün, ardından aynı formatta dosya hazırlayıp
              içe aktarın. <span className="font-mono">id</span> alanı varsa
              mevcut kayıt güncellenir, yoksa yeni kayıt oluşturulur. Boş
              bırakılan hücreler mevcut değeri değiştirmez.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
