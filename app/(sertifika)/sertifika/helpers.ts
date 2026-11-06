import prisma from "@/lib/prisma";
import { companyInfo } from "@/utils/constants";

// export type Certificate = {
//   serial: string;
//   holderName: string;
//   program: string; // e.g. "Anlayarak Hızlı Okuma"
//   completionDate: string; // ISO date
//   heading?: string; // default: BAŞARI SERTİFİKASI
//   description?: string; // overrides the default paragraph
// };
export const brand = {
  name: process.env.NEXT_PUBLIC_BRAND_NAME ?? companyInfo.name,
  tagline: process.env.NEXT_PUBLIC_BRAND_TAGLINE ?? "PROFESYONEL EĞİTİM",
  website: process.env.NEXT_PUBLIC_BRAND_WEBSITE ?? companyInfo.website,
  phone: process.env.NEXT_PUBLIC_BRAND_PHONE ?? companyInfo.phone,
  email: process.env.NEXT_PUBLIC_BRAND_EMAIL ?? companyInfo.email,
  signerLabel: "Yetkili",
  accent: "#e8b730",
};

export const verifyStudent = async (studentId: number, serial: string) => {
  try {
    const studentData = await prisma.student.findUnique({
      where: {
        id: studentId,
      },
      include: {
        user: true,
        lessons: {
          include: {
            LessonExercise: true,
          },
        },
      },
    });
    if (!studentData) {
      return { isVerified: false, cert: null };
    }

    if (!studentData?.lessons || studentData?.lessons?.length === 0) {
      return { isVerified: false, cert: null };
    }

    const isAllLessonsCompleted = studentData.lessons.every(
      (item: any) => item.isLocked === false,
    );

    if (!isAllLessonsCompleted) {
      return { isVerified: false, cert: null };
    }

    const completionDates =
      studentData?.lessons.flatMap((item) =>
        item.LessonExercise.map((le: any) => new Date(le.updatedAt).getTime()),
      ) ?? [];

    const completionDate = completionDates.length
      ? new Date(Math.max(...completionDates))
      : null;

    const isVerified = verifyCertificateSerial(
      serial,
      studentData.id,
      studentData.startDate as any,
    );

    if (!isVerified) {
      return { isVerified: false, cert: null };
    }
    return {
      isVerified,
      cert: {
        serial: serial,
        holderName: studentData?.user?.name,
        program: "Anlayarak Hızlı Okuma",
        completionDate: completionDate,
        heading: "BAŞARI SERTİFİKASI",
        description:
          `Yukarıda adı geçen katılımcı, "Anlayarak Hızlı Okuma" Eğitimini başarıyla tamamlamıştır. ` +
          `Bu sertifika, katılımcının becerilerini program ölçütlerine uygun şekilde geliştirdiğini belgelendirir. ` +
          `Kendisine eğitim ve mesleki yaşamında başarılar dileriz.`,
      },
    };
  } catch (error) {
    return { isVerified: false, cert: null };
  }
};

export const generateCertificateSerial = (
  studentId: number,
  startDate: string,
): string => {
  const date = new Date(startDate);

  if (Number.isNaN(date.getTime())) {
    throw new Error("Invalid student start date");
  }

  const yearMonth = `${date.getUTCFullYear()}${String(
    date.getUTCMonth() + 1,
  ).padStart(2, "0")}`;

  const formattedStudentId = String(studentId).padStart(6, "0");

  return `HB-${yearMonth}-${formattedStudentId}`;
};

export const verifyCertificateSerial = (
  serial: string,
  studentId: number,
  startDate: string,
): boolean => {
  return serial === generateCertificateSerial(studentId, startDate);
};

export const parseCertificateSerial = (serial?: string) => {
  const decodedSerial = serial ? decodeURIComponent(serial) : "";

  const serialMatch = decodedSerial.match(/^HB-(\d{6})-(\d{6})$/);

  return {
    decodedSerial,
    studentId: serialMatch ? Number(serialMatch[2]) : 0,
    isValid: !!serialMatch,
  };
};

export function formatDate(iso: string) {
  const d = new Date(iso);
  const dd = String(d.getUTCDate()).padStart(2, "0");
  const mm = String(d.getUTCMonth() + 1).padStart(2, "0");
  return `${dd}.${mm}.${d.getUTCFullYear()}`;
}

export type Certificate = {
  serial: string;
  holderName: string;
  program: string;
  completionDate: string | null;
  heading?: string;
  description?: string;
} | null;
