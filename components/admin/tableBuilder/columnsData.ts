export const columnsData = {
  usersColumn: [
    { id: "id", name: "#", type: "string" },
    { id: "name", name: "Adı Soyadı", type: "string" },
    { id: "username", name: "Kullanıcı Adı", type: "string" },
    { id: "tcId", name: "TC Kimlik No", type: "string" },
    { id: "email", name: "E-posta", type: "string" },
    { id: "active", name: "Durum", type: "boolean" },
    { id: "role", name: "Rolü", type: "string" },
  ],
  studentColumn: [
    { id: "id", name: "#", type: "string" },
    { id: "name", name: "Öğrenci Adı", type: "html" },
    { id: "email", name: "E-posta", type: "string" },
    { id: "studyGroup", name: "Eğitim Grubu", type: "string" },
    { id: "class", name: "Sınıf", type: "string" },
    { id: "endDate", name: "Bitiş Tarihi", type: "date" },
    { id: "progress", name: "Ödev", type: "progress" },
    { id: "active", name: "Durum", type: "boolean" },
  ],
  articlesColumn: [
    { id: "id", name: "#", type: "string" },
    { id: "category", name: "kategori", type: "category" },
    { id: "title", name: "Başlık", type: "string" },
    { id: "description", name: "Metin", type: "string" },
    { id: "tests", name: "Test", type: "json" },
    { id: "updatedAt", name: "Düzenleme", type: "date" },
  ],
  categoryColumn: [
    { id: "id", name: "#", type: "string" },
    { id: "title", name: "Başlık", type: "string" },
    { id: "description", name: "Açıklama", type: "string" },
    { id: "updatedAt", name: "Düzenleme", type: "date" },
  ],
  lessonColumn: [
    { id: "id", name: "#", type: "string" },
    { id: "title", name: "Başlık", type: "string" },
    { id: "lessons", name: "Dersler", type: "exercisesJson" },
    { id: "updatedAt", name: "Düzenleme", type: "date" },
  ],
  classColumn: [
    { id: "id", name: "#", type: "string" },
    { id: "name", name: "Sınıf Adı", type: "string" },
    { id: "studyGroup", name: "Eğitim Grubu", type: "string" },
    {
      id: "students",
      name: "Öğrenci",
      type: "length",
      lengthName: "Öğrenciler",
      link: "/admin/students?classId=",
    },
    { id: "active", name: "Durum", type: "boolean" },
  ],
  teacherColumn: [
    { id: "id", name: "#", type: "string" },
    { id: "name", name: "Öğretmen Ad Soyad", type: "string" },
    { id: "active", name: "Durum", type: "boolean" },
  ],
} as const;

export type ColumnsKey = keyof typeof columnsData;
export type Column = (typeof columnsData)[ColumnsKey][number];
