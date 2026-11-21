import { getServerSession } from "next-auth";
import { authOptions as nextAuthOptions } from "@/lib/authOptions";

export const permissions: Record<string, Record<string, string[]>> = {
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
    videos: ["view", "create", "edit", "delete"],
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

export async function getAuthHandlerServer(pathname?: string, action?: string) {
  const session = await getServerSession(nextAuthOptions);

  const role = session?.user?.role ?? "";
  const pageName = pathname ?? "";

  const userPermissions = permissions[role]?.[pageName] ?? [];

  return {
    userData: session?.user,

    canView: userPermissions.includes("view"),
    canCreate: userPermissions.includes("create"),
    canEdit: userPermissions.includes("edit"),
    canDelete: userPermissions.includes("delete"),

    canViewMenu: permissions[role]?.[pageName]?.includes("view") ?? false,
    hasPermission: action
      ? permissions[role]?.[pageName]?.includes(action)
      : false,
  };
}
