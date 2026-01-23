import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useMemo } from "react";

export const authOptions: any = {
  ADMIN: {
    classes: ["view", "create", "edit", "delete"],
    students: ["view", "create", "edit", "delete"],
    teachers: ["view", "create", "edit", "delete"],
    lessons: ["view", "create", "edit", "delete"],
    category: ["view", "create", "edit", "delete"],
    articles: ["view", "create", "edit", "delete"],
    words: ["view", "create", "edit", "delete"],
    users: ["view", "create", "edit", "delete"],
    billing: ["view", "create", "edit", "delete"],
    registration: ["view", "create", "edit", "delete"],
  },
  SUBSCRIBER: {
    classes: ["view", "create", "edit", "delete"],
    students: ["view", "create", "edit", "delete"],
    teachers: ["view", "create", "edit", "delete"],
    lessons: ["view", "create", "edit", "delete"],
    category: ["view", "create", "edit", "delete"],
    articles: ["view", "create", "edit", "delete"],
    words: ["view", "create", "edit", "delete"],
    users: ["view"],
    billing: ["view"],
    registration: [],
  },
  TEACHER: {
    classes: ["view", "create", "edit", "delete"],
    students: ["view", "create", "edit", "delete"],
    teachers: ["view"],
    lessons: ["view", "create", "edit", "delete"],
    category: ["view", "create", "edit", "delete"],
    articles: ["view", "create", "edit", "delete"],
    words: ["view", "create", "edit", "delete"],
    users: ["view"],
    billing: ["view"],
    registration: [],
  },
};

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
    const permissions = authOptions[role]?.[pageName] || [];

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
        const pPerms = authOptions[role]?.[pName];
        return pPerms?.includes("view") ?? false;
      },
    };
  }, [session, status, pathname]);

  return auth;
};
