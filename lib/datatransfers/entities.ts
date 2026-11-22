import { Prisma, RegistrationType, StudyGroup } from "@prisma/client";
import prisma from "@/lib/prisma";
import { DataType } from "./meta";

// Server-only handlers. Each data type exports flat rows (Excel-friendly) and,
// when importable, validates and upserts one row at a time.
//
// Import rules shared by all types:
// - "id" present and found  -> update that record.
// - otherwise, if a unique key matches (title / word) -> update that record.
// - otherwise -> create a new record.
// - A blank cell on an update leaves the stored value unchanged.

export type Row = Record<string, unknown>;
export type ImportOutcome = "created" | "updated";

export interface EntityHandler {
  exportRows: () => Promise<Row[]>;
  importRow?: (row: Row) => Promise<ImportOutcome>;
}

const STUDY_GROUPS: string[] = Object.values(StudyGroup);
const TRUE_VALUES = ["true", "1", "evet", "aktif", "yes", "x"];
const FALSE_VALUES = ["false", "0", "hayır", "hayir", "pasif", "no"];

// ---- value parsing -------------------------------------------------------

const isBlank = (v: unknown) =>
  v === undefined || v === null || (typeof v === "string" && v.trim() === "");

const text = (v: unknown) => (isBlank(v) ? undefined : String(v).trim());

const requireText = (v: unknown, field: string) => {
  const s = text(v);
  if (!s) throw new Error(`"${field}" zorunlu`);
  return s;
};

const int = (v: unknown, field: string) => {
  if (isBlank(v)) return undefined;
  const n = Number(v);
  if (!Number.isInteger(n)) throw new Error(`"${field}" tam sayı olmalı (değer: ${v})`);
  return n;
};

const bool = (v: unknown, field: string) => {
  if (isBlank(v)) return undefined;
  if (typeof v === "boolean") return v;
  if (typeof v === "number") return v !== 0;
  const s = String(v).trim().toLowerCase();
  if (TRUE_VALUES.includes(s)) return true;
  if (FALSE_VALUES.includes(s)) return false;
  throw new Error(`"${field}" evet/hayır (true/false) olmalı (değer: ${v})`);
};

const json = (v: unknown, field: string): Prisma.InputJsonValue | undefined => {
  if (isBlank(v)) return undefined;
  if (typeof v !== "string") return v as Prisma.InputJsonValue;
  try {
    return JSON.parse(v) as Prisma.InputJsonValue;
  } catch {
    throw new Error(`"${field}" geçerli bir JSON olmalı`);
  }
};

const float = (v: unknown, field: string) => {
  if (isBlank(v)) return undefined;
  const n = Number(String(v).replace(",", "."));
  if (!Number.isFinite(n)) throw new Error(`"${field}" sayı olmalı (değer: ${v})`);
  return n;
};

const enumValue = (v: unknown, allowed: string[], field: string) => {
  if (isBlank(v)) return undefined;
  const s = String(v).trim().toUpperCase();
  if (!allowed.includes(s)) throw new Error(`"${field}" geçersiz (değer: ${v})`);
  return s;
};

const studyGroupList = (v: unknown): StudyGroup[] | undefined => {
  if (isBlank(v)) return undefined;
  const items = String(v)
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const invalid = items.filter((i) => !STUDY_GROUPS.includes(i));
  if (invalid.length) throw new Error(`Geçersiz çalışma grubu: ${invalid.join(", ")}`);
  return items as StudyGroup[];
};

// ---- formatting for export -----------------------------------------------

const dateOnly = (d: Date | null | undefined) =>
  d ? d.toISOString().slice(0, 10) : "";

const dateTime = (d: Date) => d.toISOString().replace("T", " ").slice(0, 16);

const jsonText = (v: unknown) =>
  v === null || v === undefined ? "" : JSON.stringify(v);

// ---- handlers ------------------------------------------------------------

const categories: EntityHandler = {
  exportRows: async () => {
    const rows = await prisma.category.findMany({
      include: { studyGroups: true },
      orderBy: { id: "asc" },
    });
    return rows.map((c) => ({
      id: c.id,
      title: c.title,
      description: c.description ?? "",
      studyGroups: c.studyGroups.map((s) => s.studyGroup).join(","),
      subscriberId: c.subscriberId ?? "",
    }));
  },
  importRow: async (row) => {
    const id = int(row.id, "id");
    const title = requireText(row.title, "title");
    const groups = studyGroupList(row.studyGroups);
    const data = {
      title,
      description: text(row.description),
      subscriberId: int(row.subscriberId, "subscriberId"),
    };

    const existing =
      (id !== undefined ? await prisma.category.findUnique({ where: { id } }) : null) ??
      (await prisma.category.findUnique({ where: { title } }));

    if (existing) {
      await prisma.category.update({
        where: { id: existing.id },
        data: {
          ...data,
          ...(groups
            ? { studyGroups: { deleteMany: {}, create: groups.map((studyGroup) => ({ studyGroup })) } }
            : {}),
        },
      });
      return "updated";
    }

    await prisma.category.create({
      data: {
        ...data,
        studyGroups: { create: (groups ?? []).map((studyGroup) => ({ studyGroup })) },
      },
    });
    return "created";
  },
};

const articles: EntityHandler = {
  exportRows: async () => {
    const rows = await prisma.article.findMany({
      include: { category: { select: { id: true, title: true } }, studyGroups: true },
      orderBy: { id: "asc" },
    });
    return rows.map((a) => ({
      id: a.id,
      title: a.title,
      description: a.description,
      categoryId: a.categoryId,
      categoryTitle: a.category.title,
      studyGroups: a.studyGroups.map((s) => s.studyGroup).join(","),
      active: a.active,
      tests: jsonText(a.tests),
      subscriberId: a.subscriberId ?? "",
    }));
  },
  importRow: async (row) => {
    const id = int(row.id, "id");
    const title = requireText(row.title, "title");
    const description = requireText(row.description, "description");

    let categoryId = int(row.categoryId, "categoryId");
    if (categoryId === undefined) {
      const categoryTitle = text(row.categoryTitle);
      if (!categoryTitle) throw new Error('"categoryTitle" veya "categoryId" zorunlu');
      const category = await prisma.category.findUnique({ where: { title: categoryTitle } });
      if (!category) throw new Error(`Kategori bulunamadı: ${categoryTitle}`);
      categoryId = category.id;
    }

    const groups = studyGroupList(row.studyGroups);
    const tests = json(row.tests, "tests");
    const data = {
      title,
      description,
      categoryId,
      active: bool(row.active, "active"),
      subscriberId: int(row.subscriberId, "subscriberId"),
      ...(tests !== undefined
        ? { tests, hasQuestion: Array.isArray(tests) && tests.length > 0 }
        : {}),
    };

    const existing =
      (id !== undefined ? await prisma.article.findUnique({ where: { id } }) : null) ??
      (await prisma.article.findUnique({ where: { title } }));

    if (existing) {
      await prisma.article.update({
        where: { id: existing.id },
        data: {
          ...data,
          ...(groups
            ? { studyGroups: { deleteMany: {}, create: groups.map((studyGroup) => ({ studyGroup })) } }
            : {}),
        },
      });
      return "updated";
    }

    await prisma.article.create({
      data: {
        ...data,
        studyGroups: { create: (groups ?? []).map((studyGroup) => ({ studyGroup })) },
      },
    });
    return "created";
  },
};

const exercises: EntityHandler = {
  exportRows: async () => {
    const rows = await prisma.exercise.findMany({ orderBy: { id: "asc" } });
    return rows.map((e) => ({
      id: e.id,
      title: e.title ?? "",
      pathName: e.pathName,
      minDuration: e.minDuration,
      config: jsonText(e.config),
      isDone: e.isDone,
    }));
  },
  importRow: async (row) => {
    const id = int(row.id, "id");
    const data = {
      pathName: requireText(row.pathName, "pathName"),
      title: text(row.title),
      minDuration: int(row.minDuration, "minDuration"),
      config: json(row.config, "config"),
      isDone: bool(row.isDone, "isDone"),
    };

    const existing = id !== undefined ? await prisma.exercise.findUnique({ where: { id } }) : null;
    if (existing) {
      await prisma.exercise.update({ where: { id: existing.id }, data });
      return "updated";
    }
    await prisma.exercise.create({ data });
    return "created";
  },
};

const words: EntityHandler = {
  exportRows: async () => {
    const rows = await prisma.words.findMany({
      include: { studyGroups: true },
      orderBy: { id: "asc" },
    });
    return rows.map((w) => ({
      id: w.id,
      word: w.word,
      similarWord: w.similarWord ?? "",
      studyGroups: w.studyGroups.map((s) => s.group).join(","),
      subscriberId: w.subscriberId ?? "",
    }));
  },
  importRow: async (row) => {
    const id = int(row.id, "id");
    const word = requireText(row.word, "word");
    const groups = studyGroupList(row.studyGroups);
    const data = {
      word,
      similarWord: text(row.similarWord),
      subscriberId: int(row.subscriberId, "subscriberId"),
      // Same derived values the existing words API computes.
      wpc: word.split(" ").length,
      lpw: word.length,
    };

    const existing =
      (id !== undefined ? await prisma.words.findUnique({ where: { id } }) : null) ??
      (await prisma.words.findUnique({ where: { word } }));

    if (existing) {
      await prisma.words.update({
        where: { id: existing.id },
        data: {
          ...data,
          ...(groups
            ? { studyGroups: { deleteMany: {}, create: groups.map((group) => ({ group })) } }
            : {}),
        },
      });
      return "updated";
    }

    if (!groups) throw new Error('"studyGroups" zorunlu');
    await prisma.words.create({
      data: { ...data, studyGroups: { create: groups.map((group) => ({ group })) } },
    });
    return "created";
  },
};

const classes: EntityHandler = {
  exportRows: async () => {
    const rows = await prisma.class.findMany({
      include: { teacher: { include: { user: true } } },
      orderBy: { id: "asc" },
    });
    return rows.map((c) => ({
      id: c.id,
      name: c.name,
      studyGroup: c.studyGroup,
      teacherId: c.teacherId ?? "",
      teacherName: c.teacher?.user.name ?? "",
      active: c.active,
      subscriberId: c.subscriberId ?? "",
    }));
  },
  importRow: async (row) => {
    const id = int(row.id, "id");
    const name = requireText(row.name, "name");
    const groups = studyGroupList(row.studyGroup);
    if (groups && groups.length !== 1) throw new Error('"studyGroup" tek bir değer olmalı');

    const teacherId = int(row.teacherId, "teacherId");
    if (teacherId !== undefined) {
      const teacher = await prisma.teacher.findUnique({ where: { id: teacherId } });
      if (!teacher) throw new Error(`Öğretmen bulunamadı (id: ${teacherId})`);
    }

    const data = {
      name,
      studyGroup: groups?.[0],
      teacherId,
      active: bool(row.active, "active"),
      subscriberId: int(row.subscriberId, "subscriberId"),
    };

    const existing = id !== undefined ? await prisma.class.findUnique({ where: { id } }) : null;
    if (existing) {
      await prisma.class.update({ where: { id: existing.id }, data });
      return "updated";
    }

    if (!groups) throw new Error('"studyGroup" zorunlu');
    await prisma.class.create({ data: { ...data, studyGroup: groups[0] } });
    return "created";
  },
};

// Export-only: password is never included.
const students: EntityHandler = {
  exportRows: async () => {
    const rows = await prisma.student.findMany({
      include: { user: true, class: true },
      orderBy: { id: "asc" },
    });
    return rows.map((s) => ({
      id: s.id,
      username: s.user.username,
      name: s.user.name,
      email: s.user.email ?? "",
      tcId: s.user.tcId ?? "",
      className: s.class?.name ?? "",
      studyGroup: s.studyGroup,
      gender: s.gender,
      startDate: dateOnly(s.startDate),
      endDate: dateOnly(s.endDate),
      fee: s.fee,
      currency: s.currency,
      active: s.active,
    }));
  },
};

// Export-only: reading-test results.
const attempts: EntityHandler = {
  exportRows: async () => {
    const rows = await prisma.attempt.findMany({
      include: { student: { include: { user: true } } },
      orderBy: { createdAt: "desc" },
      take: 10000,
    });
    return rows.map((a) => ({
      id: a.id,
      createdAt: dateTime(a.createdAt),
      username: a.student.user.username,
      variant: a.variant,
      wpm: a.wpm ?? "",
      wpf: a.wpf ?? "",
      correct: a.correct ?? "",
      totalQuiz: a.totalQuiz ?? "",
      durationSec: a.durationSec ?? "",
    }));
  },
};

const teachers: EntityHandler = {
  exportRows: async () => {
    const rows = await prisma.teacher.findMany({
      include: { user: true },
      orderBy: { id: "asc" },
    });
    return rows.map((t) => ({
      id: t.id,
      username: t.user.username,
      name: t.user.name,
      email: t.user.email ?? "",
      tcId: t.user.tcId ?? "",
      active: t.active,
      subscriberId: t.subscriberId,
    }));
  },
  importRow: async (row) => {
    const username = requireText(row.username, "username");
    const name = text(row.name);
    const email = text(row.email);
    const tcId = text(row.tcId);
    const active = bool(row.active, "active");
    const password = text(row.password);
    const subscriberId = int(row.subscriberId, "subscriberId");

    const user = await prisma.user.findUnique({
      where: { username },
      include: { Teacher: true },
    });

    if (user) {
      if (!user.Teacher) {
        throw new Error(`"${username}" zaten farklı bir rolde kayıtlı`);
      }
      await prisma.user.update({
        where: { id: user.id },
        data: { name, email, tcId, active, ...(password ? { password } : {}) },
      });
      await prisma.teacher.update({
        where: { id: user.Teacher.id },
        data: { active, subscriberId },
      });
      return "updated";
    }

    if (!name) throw new Error('"name" zorunlu');
    if (!password) throw new Error('Yeni öğretmen için "password" zorunlu');
    if (subscriberId === undefined) throw new Error('Yeni öğretmen için "subscriberId" zorunlu');

    await prisma.user.create({
      data: {
        username,
        name,
        email,
        tcId,
        password,
        active: active ?? true,
        role: "TEACHER",
        subscriberId,
        Teacher: { create: { subscriberId, active: active ?? true } },
      },
    });
    return "created";
  },
};

const subscribers: EntityHandler = {
  exportRows: async () => {
    const rows = await prisma.subscriber.findMany({ orderBy: { id: "asc" } });
    return rows.map((s) => ({
      id: s.id,
      credit: s.credit,
      price: s.price ?? "",
    }));
  },
  importRow: async (row) => {
    const id = int(row.id, "id");
    const data = {
      credit: int(row.credit, "credit"),
      price: float(row.price, "price"),
    };
    const existing = id !== undefined ? await prisma.subscriber.findUnique({ where: { id } }) : null;
    if (existing) {
      await prisma.subscriber.update({ where: { id: existing.id }, data });
      return "updated";
    }
    await prisma.subscriber.create({ data });
    return "created";
  },
};

const registrations: EntityHandler = {
  exportRows: async () => {
    const rows = await prisma.registration.findMany({ orderBy: { createdAt: "desc" } });
    return rows.map((r) => ({
      id: r.id,
      name: r.name,
      email: r.email,
      phone: r.phone ?? "",
      type: r.type,
      studyGroup: r.studyGroup ?? "",
      companyInfo: r.companyInfo ?? "",
      message: r.message ?? "",
      isProcessed: r.isProcessed,
      createdAt: dateTime(r.createdAt),
    }));
  },
  importRow: async (row) => {
    const id = int(row.id, "id");
    const name = requireText(row.name, "name");
    const email = requireText(row.email, "email");
    const data = {
      name,
      email,
      phone: text(row.phone),
      type: enumValue(row.type, Object.values(RegistrationType), "type") as RegistrationType | undefined,
      studyGroup: text(row.studyGroup),
      companyInfo: text(row.companyInfo),
      message: text(row.message),
      isProcessed: bool(row.isProcessed, "isProcessed"),
    };
    const existing =
      (id !== undefined ? await prisma.registration.findUnique({ where: { id } }) : null) ??
      (await prisma.registration.findUnique({ where: { email } }));
    if (existing) {
      await prisma.registration.update({ where: { id: existing.id }, data });
      return "updated";
    }
    await prisma.registration.create({ data });
    return "created";
  },
};

const menuItems: EntityHandler = {
  exportRows: async () => {
    const rows = await prisma.menuItem.findMany({ orderBy: { order: "asc" } });
    return rows.map((m) => ({
      id: m.id,
      name: m.name,
      link: m.link,
      icon: m.icon ?? "",
      description: m.description ?? "",
      youtubeId: m.youtubeId ?? "",
      order: m.order,
      isActive: m.isActive,
    }));
  },
  importRow: async (row) => {
    const id = text(row.id);
    const name = requireText(row.name, "name");
    const link = requireText(row.link, "link");
    const data = {
      name,
      link,
      icon: text(row.icon),
      description: text(row.description),
      youtubeId: text(row.youtubeId),
      order: int(row.order, "order"),
      isActive: bool(row.isActive, "isActive"),
    };
    const existing =
      (id ? await prisma.menuItem.findUnique({ where: { id } }) : null) ??
      (await prisma.menuItem.findUnique({ where: { link } }));
    if (existing) {
      await prisma.menuItem.update({ where: { id: existing.id }, data });
      return "updated";
    }
    await prisma.menuItem.create({ data });
    return "created";
  },
};

const menuSubItems: EntityHandler = {
  exportRows: async () => {
    const rows = await prisma.menuSubItem.findMany({
      include: { menuItem: { select: { link: true } } },
      orderBy: [{ menuItemId: "asc" }, { order: "asc" }],
    });
    return rows.map((s) => ({
      id: s.id,
      menuItemLink: s.menuItem.link,
      name: s.name,
      link: s.link,
      type: s.type ?? "",
      order: s.order,
      isActive: s.isActive,
    }));
  },
  importRow: async (row) => {
    const id = text(row.id);
    const name = requireText(row.name, "name");
    const link = requireText(row.link, "link");
    const menuItemLink = requireText(row.menuItemLink, "menuItemLink");
    const parent = await prisma.menuItem.findUnique({ where: { link: menuItemLink } });
    if (!parent) throw new Error(`Menü bulunamadı: ${menuItemLink}`);

    const data = {
      name,
      link,
      type: text(row.type),
      order: int(row.order, "order"),
      isActive: bool(row.isActive, "isActive"),
    };
    const existing =
      (id ? await prisma.menuSubItem.findUnique({ where: { id } }) : null) ??
      (await prisma.menuSubItem.findFirst({ where: { menuItemId: parent.id, link } }));
    if (existing) {
      await prisma.menuSubItem.update({ where: { id: existing.id }, data: { ...data, menuItemId: parent.id } });
      return "updated";
    }
    await prisma.menuSubItem.create({ data: { ...data, menuItemId: parent.id } });
    return "created";
  },
};

const lessons: EntityHandler = {
  exportRows: async () => {
    const rows = await prisma.lesson.findMany({
      include: { student: { include: { user: true } } },
      orderBy: { id: "asc" },
    });
    return rows.map((l) => ({
      id: l.id,
      title: l.title,
      description: l.description ?? "",
      order: l.order,
      isLocked: l.isLocked,
      studentUsername: l.student?.user.username ?? "",
    }));
  },
  importRow: async (row) => {
    const id = int(row.id, "id");
    const title = requireText(row.title, "title");
    let studentId: number | undefined;
    const username = text(row.studentUsername);
    if (username) {
      const user = await prisma.user.findUnique({
        where: { username },
        include: { Student: true },
      });
      if (!user?.Student) throw new Error(`Öğrenci bulunamadı: ${username}`);
      studentId = user.Student.id;
    }
    const data = {
      title,
      description: text(row.description),
      order: int(row.order, "order"),
      isLocked: bool(row.isLocked, "isLocked"),
      studentId,
    };
    const existing = id !== undefined ? await prisma.lesson.findUnique({ where: { id } }) : null;
    if (existing) {
      await prisma.lesson.update({ where: { id: existing.id }, data });
      return "updated";
    }
    await prisma.lesson.create({ data });
    return "created";
  },
};

const lessonExercises: EntityHandler = {
  exportRows: async () => {
    const rows = await prisma.lessonExercise.findMany({ orderBy: { id: "asc" } });
    return rows.map((e) => ({
      id: e.id,
      lessonId: e.lessonId ?? "",
      title: e.title ?? "",
      pathName: e.pathName,
      minDuration: e.minDuration,
      isDone: e.isDone,
      config: jsonText(e.config),
    }));
  },
  importRow: async (row) => {
    const id = int(row.id, "id");
    const pathName = requireText(row.pathName, "pathName");
    const lessonId = int(row.lessonId, "lessonId");
    if (lessonId !== undefined) {
      const lesson = await prisma.lesson.findUnique({ where: { id: lessonId } });
      if (!lesson) throw new Error(`Ders bulunamadı (lessonId: ${lessonId})`);
    }
    const data = {
      pathName,
      title: text(row.title),
      minDuration: int(row.minDuration, "minDuration"),
      isDone: bool(row.isDone, "isDone"),
      config: json(row.config, "config"),
      lessonId,
    };
    const existing = id !== undefined ? await prisma.lessonExercise.findUnique({ where: { id } }) : null;
    if (existing) {
      await prisma.lessonExercise.update({ where: { id: existing.id }, data });
      return "updated";
    }
    await prisma.lessonExercise.create({ data });
    return "created";
  },
};

export const HANDLERS: Record<DataType, EntityHandler> = {
  categories,
  articles,
  exercises,
  words,
  classes,
  teachers,
  students,
  lessons,
  lessonExercises,
  menuItems,
  menuSubItems,
  registrations,
  subscribers,
  attempts,
};
