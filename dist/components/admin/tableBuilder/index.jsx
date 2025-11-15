"use client";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import React, { useMemo, useState } from "react";
import { MdModeEdit, MdOutlineDelete, MdAdd, MdFileDownload, MdChecklist, } from "react-icons/md";
import { createColumnHelper, flexRender, getCoreRowModel, getSortedRowModel, getFilteredRowModel, getPaginationRowModel, useReactTable, } from "@tanstack/react-table";
import Search from "../search/search";
import Button from "../../button/button";
import TablePagination from "./tablePagination";
import { useDrage } from "@/utils/hooks";
import TableEmpty from "./tableEmpty";
import { exportToExcel, formatDateTime } from "@/utils/helpers";
import { columnsData } from "./columnsData";
import { TableSkeleton } from "../../skeleton/skeleton";
function TableBuilder(_a) {
    var tableData = _a.tableData, onAction = _a.onAction, _b = _a.showAddButton, showAddButton = _b === void 0 ? true : _b, _c = _a.showEditColumn, showEditColumn = _c === void 0 ? true : _c, _d = _a.showPagination, showPagination = _d === void 0 ? true : _d, columnKey = _a.columnKey, _e = _a.isLoading, isLoading = _e === void 0 ? false : _e;
    if (isLoading) {
        return <TableSkeleton />;
    }
    var columnData = columnsData[columnKey];
    if (!columnData || !columnData.length)
        return null;
    var defaultData = tableData;
    var _f = React.useState([]), sorting = _f[0], setSorting = _f[1];
    var _g = React.useState(""), globalFilter = _g[0], setGlobalFilter = _g[1];
    var _h = useDrage(), handleMouseDown = _h.handleMouseDown, handleMouseLeave = _h.handleMouseLeave, handleMouseUp = _h.handleMouseUp, handleMouseMove = _h.handleMouseMove;
    var columnHelper = createColumnHelper();
    var renderValue = function (type, info) {
        var value = info.getValue();
        if (type === "date") {
            return formatDateTime(value);
        }
        if (type === "boolean") {
            return value ? "Active" : "Passive";
        }
        if (type === "json") {
            return (<Button className="!p-1 !bg-black/0 !text-black border hover:!bg-blue-500 hover:!text-white" text="" onClick={function () { return onAction("quiz", info); }} icon={<MdChecklist className="w-7 h-7"/>}/>);
        }
        return value;
    };
    var columns = useMemo(function () {
        var col = [];
        if (showEditColumn) {
            col.push(columnHelper.display({
                header: function () { return <p className="font-bold text-black">#</p>; },
                id: "edit",
                cell: function (info) { return (<div className="flex gap-2 ">
              <button onClick={function () { return onAction("edit", info); }}>
                <MdModeEdit className="w-5 h-5 hover:text-red-500"/>
              </button>
              <button onClick={function () { return onAction("delete", info); }}>
                <MdOutlineDelete className="w-5 h-5 hover:text-red-500"/>
              </button>
            </div>); },
            }));
        }
        columnData.map(function (item) {
            var temp = columnHelper.accessor(item.id, {
                header: function () { return <p className="font-bold text-black">{item.name}</p>; },
                cell: function (info) { return (<p className="line-clamp-2">{renderValue(item.type, info)}</p>); },
            });
            col.push(temp);
        });
        return col;
    }, []);
    var _j = useState(function () { return __spreadArray([], defaultData, true); }), data = _j[0], setData = _j[1];
    var table = useReactTable({
        data: data,
        columns: columns,
        initialState: {
            pagination: {
                pageSize: 10,
            },
        },
        state: {
            sorting: sorting,
            globalFilter: globalFilter,
        },
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        onGlobalFilterChange: setGlobalFilter,
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        debugTable: true,
    });
    return (<>
      <header className="relative mb-7 flex items-center justify-between gap-4 border-b">
        <div className="text-md w-[60%] font-medium">
          <Search className="w-full" onSubmit={function (val) { return setGlobalFilter(val); }} onChange={function (val) { return setGlobalFilter(val); }}/>
        </div>

        <div className="flex gap-2">
          {showAddButton ? (<Button text="EKLE" className="!w-[140px] h-[38px] font-bold mb-3" onClick={function () { return onAction("add"); }} icon={<MdAdd className="ml-1 h-6 w-6"/>}/>) : null}
        </div>
      </header>

      <div className="w-full h-full sm:overflow-auto px-10  pt-10 border bg-white rounded-lg">
        <Button text="Excel" className="hover:!bg-blue-400  hover:!text-white text-sm -mt-5 !bg-black/0 border !py-1 !text-black !max-w-fit mb-3" onClick={function () { return exportToExcel(data, "ogrenciler.xlsx"); }} icon={<MdFileDownload className="w-4 h-4"/>}/>

        <div className="custom-scrollbar--hidden overflow-x-auto" onMouseDown={handleMouseDown} onMouseLeave={handleMouseLeave} onMouseUp={handleMouseUp} onMouseMove={handleMouseMove}>
          <table className="w-full mb-10">
            <thead>
              {table.getHeaderGroups().map(function (headerGroup) { return (<tr key={headerGroup.id} className="border-b border-gray-400 text-sm text-gray-200">
                  {headerGroup.headers.map(function (header, idx) {
                var _a;
                return (<th key={header.id + idx} colSpan={header.colSpan} onClick={header.column.getToggleSortingHandler()} className="cursor-pointer  px-1 text-start">
                        <div className="items-center justify-between">
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          {(_a = {
                        asc: "",
                        desc: "",
                    }[header.column.getIsSorted()]) !== null && _a !== void 0 ? _a : null}
                        </div>
                      </th>);
            })}
                </tr>); })}
            </thead>
            <tbody>
              {table
            .getRowModel()
            .rows.slice()
            .map(function (row) {
            return (<tr key={row.id} className="border-b text-sm hover:bg-gray-200">
                      {row.getVisibleCells().map(function (cell, indx) {
                    return (<td key={cell.id + indx} className="py-2 pr-2">
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </td>);
                })}
                    </tr>);
        })}
            </tbody>
          </table>
          {data.length === 0 && columnData.length > 0 ? <TableEmpty /> : null}
          {showPagination ? <TablePagination table={table}/> : null}
        </div>
      </div>
    </>);
}
export default TableBuilder;
