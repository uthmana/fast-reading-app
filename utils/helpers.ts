import saveAs from "file-saver";
import { studyGroupOptions } from "./constants";
import { MenuPropsTypes } from "@/types/menu";
import * as XLSX from "xlsx";

type UserWhereInput =
  | { email: string }
  | { username: string }
  | { tcId: string };

export const formatDateTime = (data: any, fullDate: boolean = false) => {
  if (!data) return null;
  if (fullDate) {
    return new Date(data).toLocaleString("tr-TR");
  }

  const date = new Date(data);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${day}.${month}.${year}`;
};

type CorrectAnswer = Record<string, string>;

export const calculateQuizScore = (
  values: Record<string, string>,
  correctAnswers: CorrectAnswer[],
): number => {
  if (correctAnswers.length === 0) return 0;

  const correctCount = correctAnswers.reduce((count, answer) => {
    const [key, correctValue] = Object.entries(answer)[0];

    return count + (values[key] === correctValue ? 1 : 0);
  }, 0);

  return Math.round((correctCount / correctAnswers.length) * 100);
};

export const convertToISO8601 = (dateString: string) => {
  if (!dateString) return null;
  const parsedDate = new Date(dateString);
  const iso8601Date = parsedDate.toISOString();
  return iso8601Date;
};

export const removeMillisecondsAndUTC = (iso8601Date: string) => {
  if (!iso8601Date) return null;
  const trimmedDate = iso8601Date.slice(0, -5); // Remove milliseconds and 'Z'
  return trimmedDate;
};

export const exportToExcel = (tableData: any, fileName = "table-data.xlsx") => {
  const worksheet = XLSX.utils.json_to_sheet(tableData);

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

  // Write workbook and convert to blob
  const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  const data = new Blob([excelBuffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  saveAs(data, fileName);
};

export const countWords = (text: string) => {
  if (!text || typeof text !== "string") return 0;
  return text.trim().split(/\s+/).length;
};

export const calculateReadingSpeed = (wordCount: number, seconds: number) => {
  if (
    typeof wordCount !== "number" ||
    typeof seconds !== "number" ||
    seconds <= 0
  ) {
    throw new Error(
      "Invalid input: wordCount and seconds must be positive numbers",
    );
  }

  const speed = (wordCount * 60) / seconds;
  return Math.round(speed);
};

export const getInputTypeValue = (value: string): UserWhereInput | null => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const usernameRegex = /^[a-zA-Z0-9_]{3,16}$/;
  const tcIdRegex = /^\d{11}$/;

  if (emailRegex.test(value)) return { email: value };
  if (tcIdRegex.test(value)) return { tcId: value };
  if (usernameRegex.test(value)) return { username: value };

  return null;
};

export const mapStudyGroup = (key: string) => {
  return studyGroupOptions?.find((item) => item.value === key)?.name || key;
};

export const formatNumberLocale = (num: number, locale = "tr") => {
  if (!num) return num;
  const nFormat = new Intl.NumberFormat(locale, {
    minimumFractionDigits: 0,
  });
  return nFormat.format(num);
};

export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];

  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled;
}

export function isValidPathname(
  pathname: string,
  menuItems: MenuPropsTypes[],
): boolean {
  const currentMenu = menuItems.filter((m) =>
    m.subMenu?.some((s) => s.link.includes(pathname)),
  );
  return currentMenu.length > 0;
}

export const getFullPathFromSlug = (
  slug: string,
  menuItems: MenuPropsTypes[],
): string | null => {
  const menuItem = menuItems.find((menu) =>
    menu.subMenu?.some((subMenu) => subMenu.link.endsWith(`/${slug}`)),
  );

  return (
    menuItem?.subMenu?.find((subMenu) => subMenu.link.endsWith(`/${slug}`))
      ?.link ?? null
  );
};
