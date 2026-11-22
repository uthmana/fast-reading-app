import { getServerSession } from "next-auth";
import { authOptions as nextAuthOptions } from "@/lib/authOptions";
import { authPermissions } from "./authPermissions";

export async function getAuthHandlerServer(pathname?: string, action?: string) {
  const session = await getServerSession(nextAuthOptions);

  const role = session?.user?.role ?? "";
  const pageName = pathname ?? "";

  const userPermissions = authPermissions[role]?.[pageName] ?? [];

  return {
    userData: session?.user,

    canView: userPermissions.includes("view"),
    canCreate: userPermissions.includes("create"),
    canEdit: userPermissions.includes("edit"),
    canDelete: userPermissions.includes("delete"),

    canViewMenu: authPermissions[role]?.[pageName]?.includes("view") ?? false,
    hasPermission: action
      ? authPermissions[role]?.[pageName]?.includes(action)
      : false,
  };
}
