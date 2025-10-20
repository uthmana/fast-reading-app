"use client";
import React, { useMemo, useState } from "react";
import {
  MdModeEdit,
  MdOutlineDelete,
  MdAdd,
  MdFileDownload,
  MdChecklist,
} from "react-icons/md";

import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";

import Search from "../search/search";
import Button from "../../button/button";
import TablePagination from "./tablePagination";
import { useDrage } from "@/utils/hooks";
import TableEmpty from "./tableEmpty";
import { exportToExcel, formatDateTime } from "@/utils/helpers";
import { columnsData, ColumnsKey } from "./columnsData";
import { TableSkeleton } from "../../skeleton/skeleton";

function TableBuilder({
  tableData,
  onAction,
  showAddButton = true,
  showEditColumn = true,
  showPagination = true,
  columnKey,
  isLoading = false,
}: any) {
  if (isLoading) {
    return <TableSkeleton />;
  }

  const columnData = columnsData[columnKey as ColumnsKey];
  if (!columnData || !columnData.length) return null;
  let defaultData = tableData;
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = React.useState("");
  const { handleMouseDown, handleMouseLeave, handleMouseUp, handleMouseMove } =
    useDrage();

  const columnHelper = createColumnHelper<any>();

  const renderValue = (type: string, info: any) => {
    const value = info.getValue();
    if (type === "date") {
      return formatDateTime(value);
    }
    if (type === "boolean") {
      return value ? "Active" : "Passive";
    }
    if (type === "json") {
      return (
        <Button
          className="!p-1 !bg-black/0 !text-black border hover:!bg-blue-500 hover:!text-white"
          text=""
          onClick={() => onAction("quiz", info)}
          icon={<MdChecklist className="w-6 h-6" />}
        />
      );
    }

    return value;
  };

  const columns = useMemo(() => {
    const col: any = [];
    if (showEditColumn) {
      col.push(
        columnHelper.display({
          header: () => <p className="font-bold text-black">#</p>,
          id: "edit",
          cell: (info) => (
            <div className="flex gap-2 ">
              <button onClick={() => onAction("edit", info)}>
                <MdModeEdit className="w-5 h-5 hover:text-red-500" />
              </button>
              <button onClick={() => onAction("delete", info)}>
                <MdOutlineDelete className="w-5 h-5 hover:text-red-500" />
              </button>
            </div>
          ),
        })
      );
    }

    columnData.map((item: any) => {
      let temp: any = columnHelper.accessor(item.id, {
        header: () => <p className="font-bold text-black">{item.name}</p>,
        cell: (info) => (
          <p className="line-clamp-1">{renderValue(item.type, info)}</p>
        ),
      });
      col.push(temp);
    });

    return col;
  }, []);

  const [data, setData] = useState(() => [...defaultData]);
  const table = useReactTable({
    data,
    columns,
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
    state: {
      sorting,
      globalFilter,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    debugTable: true,
  });

  return (
    <>
      <header className="relative mb-7 flex items-center justify-between gap-4 border-b">
        <div className="text-md w-[60%] font-medium">
          <Search
            className="w-full"
            onSubmit={(val) => setGlobalFilter(val)}
            onChange={(val) => setGlobalFilter(val)}
          />
        </div>

        <div className="flex gap-2">
          {showAddButton ? (
            <Button
              text="EKLE"
              className="!w-[140px] h-[38px] font-bold mb-3"
              onClick={() => onAction("add")}
              icon={<MdAdd className="ml-1 h-6 w-6" />}
            />
          ) : null}
        </div>
      </header>

      <div className="w-full h-full sm:overflow-auto px-10  pt-10 border bg-white rounded-lg">
        <Button
          text="Excel"
          className="hover:!bg-blue-400  hover:!text-white text-sm -mt-5 !bg-black/0 border !py-1 !text-black !max-w-fit mb-3"
          onClick={() => exportToExcel(data, `ogrenciler.xlsx`)}
          icon={<MdFileDownload className="w-4 h-4" />}
        />

        <div
          className="custom-scrollbar--hidden overflow-x-auto"
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeave}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
        >
          <table className="w-full mb-10">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr
                  key={headerGroup.id}
                  className="border-b border-gray-400 text-sm text-gray-200"
                >
                  {headerGroup.headers.map((header, idx) => {
                    return (
                      <th
                        key={header.id + idx}
                        colSpan={header.colSpan}
                        onClick={header.column.getToggleSortingHandler()}
                        className="cursor-pointer  px-1 text-start"
                      >
                        <div className="items-center justify-between">
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          {{
                            asc: "",
                            desc: "",
                          }[header.column.getIsSorted() as string] ?? null}
                        </div>
                      </th>
                    );
                  })}
                </tr>
              ))}
            </thead>
            <tbody>
              {table
                .getRowModel()
                .rows.slice()
                .map((row) => {
                  return (
                    <tr
                      key={row.id}
                      className="border-b text-sm hover:bg-gray-200"
                    >
                      {row.getVisibleCells().map((cell, indx) => {
                        return (
                          <td key={cell.id + indx} className="py-2 pr-2">
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
            </tbody>
          </table>
          {data.length === 0 && columnData.length > 0 ? <TableEmpty /> : null}
          {showPagination ? <TablePagination table={table} /> : null}
        </div>
      </div>
    </>
  );
}

export default TableBuilder;
