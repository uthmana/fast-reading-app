"use server";

import { prisma } from "@/prisma/prisma";
import { revalidatePath } from "next/cache";

type UpdateMenuVideoInput = {
  id: string;
  youtubeId: string;
  description: string;
};

export async function updateMenuVideo({
  id,
  youtubeId,
  description,
}: UpdateMenuVideoInput) {
  try {
    await prisma.menuItem.update({
      where: { id },
      data: {
        youtubeId: youtubeId.trim(),
        description: description.trim(),
      },
    });

    revalidatePath("/admin/videos");

    return {
      success: true,
      message: "Video bilgileri güncellendi.",
    };
  } catch (error) {
    console.error("Failed to update menu video:", error);

    return {
      success: false,
      message: "Video bilgileri güncellenemedi.",
    };
  }
}
