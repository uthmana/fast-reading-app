import { readFileSync } from "node:fs";
import * as XLSX from "xlsx";
import { mockArticles } from "../mockArticles";
import type { ArticleSource } from "./types";

/** Accepts a plain array, or { data: [...] } as most APIs return. */
const unwrap = (data: unknown): unknown[] => {
  if (Array.isArray(data)) return data;
  if (data && typeof data === "object" && Array.isArray((data as { data?: unknown }).data)) {
    return (data as { data: unknown[] }).data;
  }
  throw new Error("Expected an array of articles (or { data: [...] })");
};

/** Articles already in memory: an array literal or an imported module. */
export const objectSource = (name: string, items: unknown[]): ArticleSource => ({
  name,
  load: async () => items,
});

/** A JSON file containing an array of articles. */
export const jsonFileSource = (path: string): ArticleSource => ({
  name: `json:${path}`,
  load: async () => unwrap(JSON.parse(readFileSync(path, "utf8"))),
});

/**
 * An Excel/CSV file. The first row is the header, so columns are:
 * title, description, category, studyGroup, subscriberId, hasQuestion, active, tests
 */
export const excelFileSource = (path: string, sheetName?: string): ArticleSource => ({
  name: `excel:${path}`,
  load: async () => {
    const workbook = XLSX.readFile(path);
    const sheet = workbook.Sheets[sheetName ?? workbook.SheetNames[0]];
    if (!sheet) throw new Error(`Sheet not found: ${sheetName ?? "(first sheet)"}`);
    return XLSX.utils.sheet_to_json(sheet, { defval: "" });
  },
});

/** An HTTP endpoint returning articles as JSON. */
export const apiSource = (url: string, token?: string): ArticleSource => ({
  name: `api:${url}`,
  load: async () => {
    const res = await fetch(url, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    if (!res.ok) throw new Error(`API responded ${res.status} ${res.statusText}`);
    return unwrap(await res.json());
  },
});

/** The mock articles that ship with the repo. */
export const mockArticlesSource = objectSource("mock", mockArticles);
