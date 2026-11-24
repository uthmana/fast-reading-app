"use client";

import React from "react";
import {
  MdKeyboardArrowLeft,
  MdKeyboardArrowRight,
  MdKeyboardDoubleArrowLeft,
  MdKeyboardDoubleArrowRight,
} from "react-icons/md";

export default function pagination({ table }: { table: any }) {
  return (
    <div className="sticky left-0 mb-4 mt-5 flex w-full items-center gap-2">
      <button
        className="flex w-7 items-center justify-center rounded border p-1 dark:border-gray-800"
        onClick={() => table.setPageIndex(0)}
        disabled={!table.getCanPreviousPage()}
      >
        <MdKeyboardDoubleArrowLeft className="h-6 w-6" />
      </button>
      <button
        className="flex w-7 items-center justify-center rounded border p-1 dark:border-gray-800"
        onClick={() => table.previousPage()}
        disabled={!table.getCanPreviousPage()}
      >
        <MdKeyboardArrowLeft className="h-6 w-6" />
      </button>
      <button
        className="flex w-7 items-center justify-center rounded border p-1 dark:border-gray-800"
        onClick={() => table.nextPage()}
        disabled={!table.getCanNextPage()}
      >
        <MdKeyboardArrowRight className="h-6 w-6" />
      </button>
      <button
        className="flex w-7 items-center justify-center rounded border p-1 dark:border-gray-800"
        onClick={() => table.setPageIndex(table.getPageCount() - 1)}
        disabled={!table.getCanNextPage()}
      >
        <MdKeyboardDoubleArrowRight className="h-6 w-6" />
      </button>
      <span className="flex  items-center gap-1 text-[12px] dark:border-gray-800">
        <div>Sayfa</div>
        <strong>
          {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
        </strong>
      </span>
      <span className="ml-4 flex items-center gap-1 text-[12px] dark:border-gray-800">
        Sayfaya git:
        <input
          type="number"
          defaultValue={table.getState().pagination.pageIndex + 1}
          onChange={(e) => {
            const page = e.target.value ? Number(e.target.value) - 1 : 0;
            table.setPageIndex(page);
          }}
          className="w-16 rounded border p-1 dark:border-gray-800 dark:bg-blueSecondary"
        />
      </span>
      <select
        className="h-7 rounded text-[12px] dark:bg-blueSecondary"
        value={table.getState().pagination.pageSize}
        onChange={(e) => {
          table.setPageSize(Number(e.target.value));
        }}
      >
        {[10, 20, 30, 40, 50, 100].map((pageSize) => (
          <option key={pageSize} value={pageSize}>
            Göster {pageSize}
          </option>
        ))}
      </select>
    </div>
  );
}
