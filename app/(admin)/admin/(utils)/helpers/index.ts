import saveAs from "file-saver";
import * as XLSX from "xlsx";

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

export const formatNumberLocale = (num: number, locale = "tr") => {
  if (!num) return num;
  const nFormat = new Intl.NumberFormat(locale, {
    minimumFractionDigits: 0,
  });
  return nFormat.format(num);
};
