import React from "react";

import {
  MdHome,
  MdPerson,
  MdOutlineArticle,
  MdGroups,
  MdBusiness,
  MdPayment,
} from "react-icons/md";

const routes = [
  // {
  //   name: "Panel",
  //   path: "/admin",
  //   icon: <MdHome className="w-6 h-6" />,
  //   roles: ["ADMIN", "TEACHER"],
  // },
  {
    name: "Ders Yönetimi",
    path: "",
    icon: <MdGroups className="w-6 h-6" />,
    roles: ["ADMIN", "TEACHER"],
    children: [
      { name: "Sınıflar", path: "/admin/classes" },
      { name: "Öğrenciler", path: "/admin/students" },
      { name: "Öğretmenler", path: "/admin/teachers" },
    ],
  },
  {
    name: "Özelleştirme",
    path: "/admin/category",
    icon: <MdOutlineArticle className="w-6 h-6" />,
    roles: ["ADMIN", "TEACHER"],
    children: [
      { name: "Dersler", path: "/admin/lessons" },
      { name: "Kategoriler", path: "/admin/category" },
      { name: "Makaleler", path: "/admin/articles" },
      { name: "Kelimeler", path: "/admin/words" },
    ],
  },
  {
    name: "Kullanıcı Ayarları",
    path: "/admin/users",
    icon: <MdPerson className="w-6 h-6" />,
    roles: ["ADMIN"],
    children: [{ name: "Kullanıcılar", path: "/admin/users" }],
  },
  {
    name: "Cari Hareketler",
    path: "/admin/billing",
    icon: <MdPayment className="w-6 h-6" />,
    roles: ["ADMIN"],
  },
  // {
  //   name: "Firma Bilgileri",
  //   path: "/admin/company",
  //   icon: <MdBusiness className="w-6 h-6" />,
  //   roles: ["ADMIN"],
  // },
];
export default routes;
