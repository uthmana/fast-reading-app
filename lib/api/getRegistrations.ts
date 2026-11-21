import prisma from "@/lib/prisma";

export const getRegistrations = async () => {
  try {
    const registrations = await prisma.registration.findMany({
      orderBy: { updatedAt: "desc" },
    });
    return registrations;
  } catch (error) {
    console.error("Error fetching test registrations:", error);
    return [];
  }
};
