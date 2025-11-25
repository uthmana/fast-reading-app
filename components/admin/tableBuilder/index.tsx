"use client";
import React, { useMemo, useState } from "react";
import {
  MdModeEdit,
  MdOutlineDelete,
  MdAdd,
  MdFileDownload,
  MdChecklist,
  MdSettings,
  MdSettingsApplications,
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
import Link from "next/link";
import Dropdown from "../dropdown/dropdown";
import Icon from "@/components/icon/icon";

function TableBuilder({
  tableData,
  onAction,
  showAddButton = true,
  showEditColumn = true,
  showPagination = true,
  showSearchbar = true,
  showHeader = true,
  title = "",
  columnKey,
  isLoading = false,
  className = "",
  additionalActions = [],
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

  const renderValue = (
    item: { type: string; lengthName: string; link: string },
    info: any
  ) => {
    const { type, lengthName, link } = item;
    const value = info.getValue();
    const id = info.row.original.id;
    if (type === "date") {
      return formatDateTime(value);
    }
    if (type === "boolean") {
      return value ? "Aktif" : "Pasif";
    }
    if (type === "length") {
      return (
        <Link
          className="text-blue-600 hover:underline"
          href={`${link}${id}`}
        >{`${lengthName} (${value.length})`}</Link>
      );
    }
    if (type === "category") {
      return value.title;
    }
    if (type === "json") {
      return (
        <Button
          className="!p-1 !max-w-fit !bg-black/0 !text-black border hover:!bg-blue-500 hover:!text-white"
          text=""
          onClick={() => onAction("quiz", info)}
          icon={<MdChecklist className="w-6 h-6" />}
        />
      );
    }
    if (type === "exercisesJson") {
      return (
        <Button
          className="!p-1 !max-w-fit !bg-black/0 !text-black border hover:!bg-blue-500 hover:!text-white"
          text=""
          onClick={() => onAction("exercises", info)}
          icon={<MdChecklist className="w-6 h-6" />}
        />
      );
    }
    if (type === "html") {
      return (
        <span
          className="w-full block text-md space-y-1"
          dangerouslySetInnerHTML={{ __html: value }}
        />
      );
    }
    return value;
  };

  const columns = useMemo(() => {
    const col: any = [];
    columnData.map((item: any) => {
      let temp: any = columnHelper.accessor(item.id, {
        header: () => (
          <p className="font-bold px-1 text-black whitespace-nowrap">
            {item.name}
          </p>
        ),
        cell: (info) => (
          <p
            className="line-clamp-4 px-1"
            title={renderValue(item.type, info)?.toString()}
          >
            {renderValue(item, info)}
          </p>
        ),
      });
      col.push(temp);
    });

    if (showEditColumn) {
      col.push(
        columnHelper.display({
          header: () => (
            <p className="font-bold text-black">
              {"("}
              {tableData?.length}
              {")"}
            </p>
          ),
          id: "edit",
          cell: (info) => (
            <Dropdown
              key={info?.row.id}
              button={
                <MdSettings className="w-6 h-6 cursor-pointer text-gray-600" />
              }
              classNames={"absolute py-2 z-[1] top-8 w-max border bg-white"}
            >
              <div className="flex border min-w-14 shadow rounded-lg gap-2 absolute top-0 right-[-20px] px-3  bg-white">
                <ul className="w-full pt-1">
                  {additionalActions?.map((item: any) => {
                    return (
                      <li
                        key={item.actionName}
                        className="py-1 w-full border-b"
                      >
                        <button
                          className="flex whitespace-nowrap w-full gap-2 hover:text-blue-500"
                          onClick={() => onAction(item.action, info)}
                        >
                          <Icon name={item.icon} className="w-5 h-5" />
                          {item.actionName}
                        </button>
                      </li>
                    );
                  })}
                  <li className="py-1 border-b w-full">
                    <button
                      className="flex h-full gap-2 hover:text-blue-500"
                      onClick={() => onAction("edit", info)}
                    >
                      <MdModeEdit className="w-5 h-5 " /> Düzenle
                    </button>
                  </li>
                  <li className="py-1 w-full">
                    <button
                      className="flex w-full gap-2 hover:text-red-500"
                      onClick={() => onAction("delete", info)}
                    >
                      <MdOutlineDelete className="w-5 h-5 " />
                      Sil
                    </button>
                  </li>
                </ul>
              </div>
            </Dropdown>
          ),
        })
      );
    }

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
    <div className={`w-full ${className}`}>
      {showHeader ? (
        <header className="w-full relative mb-7 flex flex-wrap items-center justify-between gap-4">
          {showSearchbar ? (
            <div className="text-md w-full border-b lg:w-[40%] font-medium">
              <Search
                className="w-full"
                onSubmit={(val) => setGlobalFilter(val)}
                onChange={(val) => setGlobalFilter(val)}
              />
            </div>
          ) : null}

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
      ) : null}

      <div className="lg:w-full h-full px-5 w-full sm:overflow-auto pt-10 border bg-white rounded-lg">
        <div className="flex justify-between">
          {title ? <h2 className="text-lg font-semibold">{title}</h2> : null}
          <Button
            text="Excel"
            className={`hover:!bg-blue-400  hover:!text-white text-sm !bg-black/0 border !py-1 !text-black !max-w-fit mb-3 ${
              title ? "ml-auto" : ""
            }`}
            onClick={() => exportToExcel(data, `ogrenciler.xlsx`)}
            icon={<MdFileDownload className="w-4 h-4" />}
          />
        </div>

        <div
          className="w-full overflow-x-auto min-h-[220px]"
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeave}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
        >
          <table className="w-full mb-10 h-full">
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
                          <td key={cell.id + indx} className="py-1 pr-2">
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
    </div>
  );
}

export default TableBuilder;
