import React from "react";

import {
  MdHome,
  MdPerson,
  MdGroupWork,
  MdOutlineArticle,
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
    name: "Öğrenciler",
    path: "/admin/students",
    icon: <MdGroupWork className="w-6 h-6" />,
  },
  {
    name: "Kullanıcılar",
    path: "/admin/users",
    icon: <MdPerson className="w-6 h-6" />,
  },
];
export default routes;
