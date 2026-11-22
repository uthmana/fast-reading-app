import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { authPermissions } from "./authPermissions";

export const useAuthHandler = () => {
  const { data: session, status } = useSession();
  const pathname = usePathname();

  const auth = useMemo(() => {
    if (status === "loading") {
      return {
        loading: true,
        canView: false,
        canCreate: false,
        canEdit: false,
        canDelete: false,
        userData: undefined,
        canViewMenu: () => false,
      };
    }

    const role = session?.user?.role || "";
    const pageName = pathname?.split("/")?.[2];
    const permissions = authPermissions[role]?.[pageName] || [];

    return {
      loading: false,
      canView: permissions.includes("view"),
      canCreate: permissions.includes("create"),
      canEdit: permissions.includes("edit"),
      canDelete: permissions.includes("delete"),
      userData: session?.user,

      canViewMenu: (page: string) => {
        if (!page) return false;
        const pName = page.split("/")?.[2];
        const pPerms = authPermissions[role]?.[pName];
        return pPerms?.includes("view") ?? false;
      },
    };
  }, [session, status, pathname]);

  return auth;
};
