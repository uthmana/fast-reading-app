import React from "react";

import {
  // MdHome,
  MdPerson,
  MdOutlineArticle,
  MdGroups,
  //  MdBusiness,
  MdPayment,
  MdAppRegistration,
  MdImportExport,
} from "react-icons/md";

const routes = [
  // {
  //   name: "Panel",
  //   path: "/admin",
  //   description: "",
  //   icon: <MdHome className="w-6 h-6" />,
  //   roles: ["ADMIN", "TEACHER"],
  // },
  {
    name: "Kurs Yönetimi",
    description: "",
    path: "/admin/classes",
    icon: <MdGroups className="w-6 h-6" />,
    children: [
      { name: "Sınıflar", path: "/admin/classes" },
      { name: "Öğrenciler", path: "/admin/students" },
      { name: "Öğretmenler", path: "/admin/teachers" },
    ],
  },
  {
    name: "Özelleştirme",
    description: "",
    path: "/admin/category",
    icon: <MdOutlineArticle className="w-6 h-6" />,
    children: [
      //{ name: "Dersler", path: "/admin/lessons" },
      { name: "Kategoriler", path: "/admin/category" },
      { name: "Makaleler", path: "/admin/articles" },
      { name: "Kelimeler", path: "/admin/words" },
      { name: "Videolar", path: "/admin/videos" },
    ],
  },
  {
    name: "Kullanıcı Ayarları",
    path: "/admin/users",
    description: "",
    icon: <MdPerson className="w-6 h-6" />,
    children: [{ name: "Kullanıcılar", path: "/admin/users" }],
  },
  {
    name: "Başvurular",
    path: "/admin/registration",
    description: "",
    icon: <MdAppRegistration className="w-6 h-6" />,
  },
  {
    name: "Cari Hareketler",
    path: "/admin/billing",
    description: "",
    icon: <MdPayment className="w-6 h-6" />,
  },
  {
    name: "Veri Aktarımları",
    path: "/admin/datatransfers",
    description: "Verileri Excel olarak dışa aktarın veya içe aktarın",
    icon: <MdImportExport className="w-6 h-6" />,
  },
  // {
  //   name: "Firma Bilgileri",
  //   path: "/admin/company",
  //   description: "",
  //   icon: <MdBusiness className="w-6 h-6" />,
  //   roles: ["ADMIN"],
  // },
];
export default routes;
