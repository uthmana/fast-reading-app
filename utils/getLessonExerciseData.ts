import prisma from "@/lib/prisma";
import { speedMap } from "./constants";

type Props = {
  studyGroup: string;
  lessonExerciseId: string;
};

export const getLessonExerciseData = async ({
  lessonExerciseId,
  studyGroup,
}: Props) => {
  let lessonConfigData = null;
  let exerciseControls = null;

  const id = Number(lessonExerciseId);

  if (!Number.isInteger(id) || id <= 0) {
    return { lessonConfigData, exerciseControls };
  }

  try {
    if (lessonExerciseId) {
      const lessonData = await prisma.lessonExercise.findUnique({
        where: {
          id: parseInt(lessonExerciseId),
        },
      });
      const { config, ...rest } = lessonData as any;

      if (config) {
        const currentControl = config.find(
          (item: { group: string }) => item.group === studyGroup,
        );
        const speedKey = Object.keys(speedMap).find(
          (key) => speedMap[Number(key)] === currentControl?.level,
        );
        exerciseControls = {
          ...currentControl,
          level: speedKey,
          ...(currentControl?.distance
            ? { distance: currentControl * 12 }
            : {}),
        };
      }

      if (rest) {
        lessonConfigData = rest;
      }
    }

    return {
      lessonConfigData,
      exerciseControls,
    };
  } catch (error) {
    console.log(error);
    return { lessonConfigData, exerciseControls };
  }
};
