import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import React, { useEffect } from "react";
import { authOptions } from "./authOptions";

export default function useuseAuthHandler() {
  return <div>useAuthHandler</div>;
}

export const authHandler: any = () => {
  const { data: session } = useSession();
  const pathName = usePathname();
  const pageName = pathName?.split("/")?.[2];
  const role = session?.user.role || "";

  useEffect(() => {}, [session]);

  return {
    canView: authOptions[role]?.[pageName].includes("view"),
    canCreate: authOptions[role]?.[pageName].includes("create"),
    canEdit: authOptions[role]?.[pageName].includes("edit"),
    canDelete: authOptions[role]?.[pageName].includes("delete"),
    userRole: role,
    userSession: session?.user,
    canViewMenu: (page: string) => {
      const pageName = page?.split("/")?.[2];
      return authOptions[role]?.[pageName].includes("view");
    },
  };
};
