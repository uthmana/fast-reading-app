export const columnsData = {
  usersColumn: [
    { id: "id", name: "Id", type: "string" },
    { id: "name", name: "Adı Soyadı", type: "string" },
    { id: "username", name: "Kullanıcı Adı", type: "string" },
    { id: "tcId", name: "TC Kimlik No", type: "string" },
    { id: "email", name: "E-posta", type: "string" },
    { id: "active", name: "Durum", type: "boolean" },
    { id: "role", name: "Rolü", type: "string" },
  ],
  studentColumn: [
    { id: "id", name: "Id", type: "string" },
    { id: "name", name: "Adı Soyadı", type: "string" },
    { id: "username", name: "Kullanıcı Adı", type: "string" },
    { id: "tcId", name: "TC Kimlik No", type: "string" },
    { id: "email", name: "E-posta", type: "string" },
    { id: "active", name: "Durum", type: "boolean" },
    { id: "role", name: "Rolü", type: "string" },
    { id: "level", name: "Seviye", type: "string" },
    { id: "startDate", name: "Başlama Tarihi", type: "date" },
    { id: "endDate", name: "Bitiş Tarihi", type: "date" },
  ],
  articlesColumn: [
    { id: "id", name: "Id", type: "string" },
    { id: "level", name: "Seviye", type: "string" },
    { id: "title", name: "Başlık", type: "string" },
    { id: "description", name: "Metin", type: "string" },
    { id: "tests", name: "Test", type: "json" },
    { id: "updatedAt", name: "Tarih", type: "date" },
  ],
} as const;

export type ColumnsKey = keyof typeof columnsData;
export type Column = (typeof columnsData)[ColumnsKey][number];
