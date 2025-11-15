import React from "react";

import {
  MdHome,
  MdPerson,
  MdOutlineArticle,
  MdGroups,
  MdCategory,
  MdBookmark,
} from "react-icons/md";

const routes = [
  {
    name: "Panel",
    path: "/admin",
    icon: <MdHome className="w-6 h-6" />,
  },
  {
    name: "Okuma Metinler",
    path: "/admin/articles",
    icon: <MdOutlineArticle className="w-6 h-6" />,
  },
  {
    name: "Kategori",
    path: "/admin/category",
    icon: <MdCategory className="w-6 h-6" />,
  },
  {
    name: "Dersler",
    path: "/admin/lessons",
    icon: <MdBookmark className="w-6 h-6" />,
  },
  {
    name: "Öğrenciler",
    path: "/admin/students",
    icon: <MdGroups className="w-6 h-6" />,
  },
  {
    name: "Kullanıcılar",
    path: "/admin/users",
    icon: <MdPerson className="w-6 h-6" />,
  },
];
export default routes;
