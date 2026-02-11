"use client";
import React, { useMemo, useState } from "react";
import {
  MdModeEdit,
  MdOutlineDelete,
  MdAdd,
  MdFileDownload,
  MdChecklist,
  MdSettings,
  MdMenu,
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
import TableEmpty from "./tableEmpty";
import {
  exportToExcel,
  formatDateTime,
  formatNumberLocale,
} from "@/utils/helpers";
import { columnsData, ColumnsKey } from "./columnsData";
import { TableCellSkeleton } from "../../skeleton/skeleton";
import Link from "next/link";
import Dropdown from "../dropdown/dropdown";
import Icon from "@/components/icon/icon";
import { studyGroupOptions } from "@/utils/constants";

function TableBuilder({
  tableData,
  onAction,
  showAddButton = true,
  showEditColumn = true,
  showPagination = true,
  showSearchbar = true,
  showHeader = true,
  showEditRow = true,
  showDeleteRow = true,
  title = "",
  columnKey,
  isLoading = false,
  className = "",
  additionalActions = [],
}: any) {
  const columnData = columnsData[columnKey as ColumnsKey];
  if (!columnData || !columnData.length) return null;
  let defaultData = tableData;
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = React.useState("");

  const columnHelper = createColumnHelper<any>();

  const renderValue = (
    item: { type: string; lengthName: string; link: string; objectMap?: any },
    info: any,
  ) => {
    const { type, lengthName, link, objectMap } = item;
    const value = info.getValue();
    const id = info.row.original.id;
    if (type === "date") {
      return formatDateTime(value);
    }
    if (type === "fullDate") {
      return formatDateTime(value, true);
    }
    if (type === "boolean") {
      return (
        <span
          className={`px-2 py-1 whitespace-nowrap rounded-full text-xs font-semibold ${
            value
              ? "bg-green-100 text-green-700"
              : "bg-yellow-100 text-yellow-700"
          }`}
        >
          {objectMap ? objectMap[value] : value ? "Aktif" : "Pasif"}
        </span>
      );
    }
    if (type === "subscriber") {
      return value?.credit;
    }
    if (type === "currency") {
      return formatNumberLocale(value);
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
    if (type === "list") {
      return value
        ?.map(
          (list: any) =>
            studyGroupOptions.find((item) => item.value === list.group)?.name,
        )
        ?.join(", ");
    }
    if (type === "studyGroup") {
      return studyGroupOptions.find((item) => item.value === value)?.name;
    }
    if (objectMap) {
      return objectMap[value] || value;
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
            {item.totalCount ? ` ${"("}${tableData?.length}${")"}` : null}
          </p>
        ),
        cell: (info) => (
          <p
            className="line-clamp-4 px-1 flex items-center min-h-8"
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

                  {showEditRow ? (
                    <li className="py-1 border-b w-full">
                      <button
                        className="flex h-full gap-2 hover:text-blue-500"
                        onClick={() => onAction("edit", info)}
                      >
                        <MdModeEdit className="w-5 h-5 " /> Düzenle
                      </button>
                    </li>
                  ) : null}
                  {showDeleteRow ? (
                    <li className="py-1 w-full">
                      <button
                        className="flex w-full gap-2 hover:text-red-500"
                        onClick={() => onAction("delete", info)}
                      >
                        <MdOutlineDelete className="w-5 h-5 " />
                        Sil
                      </button>
                    </li>
                  ) : null}
                </ul>
              </div>
            </Dropdown>
          ),
        }),
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

      <div className="lg:w-full h-full px-5 w-full sm:overflow-auto pt-5 border bg-white rounded-lg">
        <div className="flex justify-between mb-2">
          {title ? <h2 className="text-lg font-semibold">{title}</h2> : null}
          <Dropdown
            button={
              <MdMenu className="w-5 h-5 cursor-pointer text-gray-400 hover:text-gray-600" />
            }
            classNames={"absolute py-2 z-[1] top-7 w-max border bg-white"}
          >
            <div className="flex border min-w-20 shadow rounded-md gap-2 absolute top-0 left-[0px] bg-white">
              <ul className="w-full">
                <li className="py-1 border-b w-full">
                  <Button
                    text="Excel"
                    className={`hover:!bg-blue-400  hover:!text-white text-sm !bg-black/0 border-b h-full !text-black -w-full ${
                      title ? "ml-auto" : ""
                    }`}
                    onClick={() => exportToExcel(data, `liste.xlsx`)}
                    icon={<MdFileDownload className="w-4 h-4" />}
                  />
                </li>
              </ul>
            </div>
          </Dropdown>
        </div>

        <div className="w-full overflow-x-auto min-h-[220px]">
          <table className="w-full mb-10 h-full">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr
                  key={headerGroup.id}
                  className="border-b border-gray-400 text-sm"
                >
                  {headerGroup.headers.map((header, idx) => {
                    return (
                      <th
                        key={header.id + idx}
                        colSpan={header.colSpan}
                        onClick={header.column.getToggleSortingHandler()}
                        className="cursor-pointer  px-1 text-start text-xs uppercase. whitespace-nowrap py-2"
                      >
                        <div className="items-center justify-between">
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
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
              {isLoading ? (
                <TableCellSkeleton columnLength={columnData.length} />
              ) : null}
              {!isLoading &&
                table
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
                                cell.getContext(),
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
            </tbody>
          </table>
          {!isLoading && data.length === 0 ? <TableEmpty /> : null}
          {showPagination ? <TablePagination table={table} /> : null}
        </div>
      </div>
    </div>
  );
}

export default TableBuilder;
