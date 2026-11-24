// Client-safe metadata for the Excel data transfer feature.
// Keep this file free of server-only imports (prisma, next-auth).

export const DATA_TYPES = [
  "categories",
  "articles",
  "exercises",
  "words",
  "classes",
  "teachers",
  "students",
  "lessons",
  "lessonExercises",
  "menuItems",
  "menuSubItems",
  "registrations",
  "subscribers",
  "attempts",
] as const;

export type DataType = (typeof DATA_TYPES)[number];

// Order used when importing a whole workbook: a type is always imported
// after the types it refers to (e.g. articles after categories).
export const IMPORT_ORDER: DataType[] = [
  "subscribers",
  "categories",
  "articles",
  "exercises",
  "words",
  "teachers",
  "classes",
  "registrations",
  "menuItems",
  "menuSubItems",
  "lessons",
  "lessonExercises",
];

export interface DataTypeMeta {
  label: string;
  fileName: string;
  /** false = export only (read-only data such as results). */
  importable: boolean;
  required: string[];
  optional: string[];
  note?: string;
}

export interface ImportSummary {
  created: number;
  updated: number;
  errors: string[];
}

export const DATA_TYPE_META: Record<DataType, DataTypeMeta> = {
  categories: {
    label: "Kategoriler",
    fileName: "kategoriler.xlsx",
    importable: true,
    required: ["title"],
    optional: ["id", "description", "studyGroups", "subscriberId"],
  },
  articles: {
    label: "Makaleler",
    fileName: "makaleler.xlsx",
    importable: true,
    required: ["title", "description", "categoryTitle veya categoryId"],
    optional: ["id", "studyGroups", "active", "tests", "subscriberId"],
    note: "tests alanı JSON metni olmalıdır.",
  },
  exercises: {
    label: "Egzersizler",
    fileName: "egzersizler.xlsx",
    importable: true,
    required: ["pathName"],
    optional: ["id", "title", "minDuration", "config", "isDone"],
    note: "config alanı JSON metni olmalıdır.",
  },
  words: {
    label: "Kelimeler",
    fileName: "kelimeler.xlsx",
    importable: true,
    required: ["word", "studyGroups"],
    optional: ["id", "similarWord", "subscriberId"],
  },
  classes: {
    label: "Sınıflar",
    fileName: "siniflar.xlsx",
    importable: true,
    required: ["name", "studyGroup"],
    optional: ["id", "teacherId", "active", "subscriberId"],
  },
  teachers: {
    label: "Öğretmenler",
    fileName: "ogretmenler.xlsx",
    importable: true,
    required: ["username", "name"],
    optional: ["id", "email", "tcId", "active", "subscriberId", "password"],
    note: "Yeni öğretmen için password ve subscriberId zorunludur. Mevcut öğretmende password boş bırakılırsa değişmez. password dışa aktarılmaz.",
  },
  students: {
    label: "Öğrenciler",
    fileName: "ogrenciler.xlsx",
    importable: false,
    required: [],
    optional: [
      "id",
      "username",
      "name",
      "email",
      "tcId",
      "className",
      "studyGroup",
      "gender",
      "startDate",
      "endDate",
      "fee",
      "currency",
      "active",
    ],
    note: "Şifreler güvenlik nedeniyle dışa aktarılmaz. Öğrenci içe aktarma, otomatik ders atamaları nedeniyle henüz kapalıdır.",
  },
  lessons: {
    label: "Dersler",
    fileName: "dersler.xlsx",
    importable: true,
    required: ["title"],
    optional: ["id", "description", "order", "isLocked", "studentUsername"],
    note: "studentUsername, dersin atandığı öğrencinin kullanıcı adıdır.",
  },
  lessonExercises: {
    label: "Ders Egzersizleri",
    fileName: "ders-egzersizleri.xlsx",
    importable: true,
    required: ["pathName"],
    optional: ["id", "lessonId", "title", "minDuration", "isDone", "config"],
    note: "lessonId, Dersler sayfasındaki id değeridir.",
  },
  menuItems: {
    label: "Menü",
    fileName: "menu.xlsx",
    importable: true,
    required: ["name", "link"],
    optional: ["id", "icon", "description", "youtubeId", "order", "isActive"],
  },
  menuSubItems: {
    label: "Alt Menü",
    fileName: "alt-menu.xlsx",
    importable: true,
    required: ["name", "link", "menuItemLink"],
    optional: ["id", "type", "order", "isActive"],
    note: "menuItemLink, bağlı olduğu Menü kaydının link değeridir.",
  },
  registrations: {
    label: "Başvurular",
    fileName: "basvurular.xlsx",
    importable: true,
    required: ["name", "email"],
    optional: [
      "id",
      "phone",
      "type",
      "studyGroup",
      "companyInfo",
      "message",
      "isProcessed",
    ],
    note: "type: FRANCHISE, TRIAL_CLASS veya GENERAL_INFO. E-posta adresi benzersizdir.",
  },
  subscribers: {
    label: "Bayiler",
    fileName: "bayiler.xlsx",
    importable: true,
    required: [],
    optional: ["id", "credit", "price"],
  },
  attempts: {
    label: "Sonuçlar",
    fileName: "sonuclar.xlsx",
    importable: false,
    required: [],
    optional: [
      "id",
      "createdAt",
      "username",
      "variant",
      "wpm",
      "wpf",
      "correct",
      "totalQuiz",
      "durationSec",
    ],
    note: "Öğrenci okuma denemelerinin sonuçları. Yalnızca dışa aktarılabilir (en son 10.000 kayıt).",
  },
};

export const isDataType = (value: unknown): value is DataType =>
  typeof value === "string" && (DATA_TYPES as readonly string[]).includes(value);
