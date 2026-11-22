"use client";

import React, { useState, useCallback, useRef } from "react";
import {
  MdFileDownload,
  MdFileUpload,
  MdCategory,
  MdOutlineArticle,
  MdFitnessCenter,
  MdCheckCircle,
  MdError,
  MdInfo,
  MdClose,
  MdCloudUpload,
} from "react-icons/md";
import * as XLSX from "xlsx";
import { exportToExcel } from "@/utils/helpers";
import { fetchData } from "@/utils/fetchData";

type DataType = "categories" | "articles" | "exercises";
type OperationStatus = "idle" | "loading" | "success" | "error";

interface ImportResult {
  created: number;
  updated: number;
  errors: string[];
}

const TABS: { key: DataType; label: string; icon: React.ReactNode }[] = [
  {
    key: "categories",
    label: "Kategoriler",
    icon: <MdCategory className="w-5 h-5" />,
  },
  {
    key: "articles",
    label: "Makaleler",
    icon: <MdOutlineArticle className="w-5 h-5" />,
  },
  {
    key: "exercises",
    label: "Egzersizler",
    icon: <MdFitnessCenter className="w-5 h-5" />,
  },
];

const FIELD_INFO: Record<DataType, { required: string[]; optional: string[] }> =
  {
    categories: {
      required: ["title"],
      optional: ["id", "description", "studyGroup", "subscriberId"],
    },
    articles: {
      required: ["title", "description", "categoryId"],
      optional: [
        "id",
        "studyGroup",
        "hasQuestion",
        "active",
        "tests",
        "subscriberId",
      ],
    },
    exercises: {
      required: ["pathName"],
      optional: ["id", "title", "minDuration", "config", "isDone"],
    },
  };

export default function DataTransfersPage() {
  const [activeTab, setActiveTab] = useState<DataType>("categories");
  const [exportStatus, setExportStatus] = useState<OperationStatus>("idle");
  const [importStatus, setImportStatus] = useState<OperationStatus>("idle");
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [statusMessage, setStatusMessage] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewData, setPreviewData] = useState<any[] | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const apiPaths: Record<DataType, string> = {
    categories: "/api/category",
    articles: "/api/articles",
    exercises: "/api/exercises",
  };

  const fileNames: Record<DataType, string> = {
    categories: "kategoriler.xlsx",
    articles: "makaleler.xlsx",
    exercises: "egzersizler.xlsx",
  };

  // --- EXPORT ---
  const handleExport = useCallback(async () => {
    setExportStatus("loading");
    setStatusMessage("");
    try {
      const data = await fetchData({ apiPath: apiPaths[activeTab] });
      if (!data || (Array.isArray(data) && data.length === 0)) {
        setExportStatus("error");
        setStatusMessage("Dışa aktarılacak veri bulunamadı.");
        return;
      }

      const cleanData = Array.isArray(data) ? data : [data];

      // Flatten nested objects for Excel (e.g., category relation in articles)
      const exportData = cleanData.map((item: any) => {
        const flat: any = {};
        for (const [key, value] of Object.entries(item)) {
          if (
            key === "category" &&
            typeof value === "object" &&
            value !== null
          ) {
            flat["categoryTitle"] = (value as any).title;
          } else if (typeof value === "object" && value !== null) {
            flat[key] = JSON.stringify(value);
          } else {
            flat[key] = value;
          }
        }
        return flat;
      });

      exportToExcel(exportData, fileNames[activeTab]);
      setExportStatus("success");
      setStatusMessage(`${cleanData.length} kayıt başarıyla dışa aktarıldı.`);
    } catch (err: any) {
      setExportStatus("error");
      setStatusMessage(err.message || "Dışa aktarma sırasında hata oluştu.");
    }
  }, [activeTab]);

  // --- FILE HANDLING ---
  const processFile = useCallback((file: File) => {
    setSelectedFile(file);
    setImportResult(null);
    setImportStatus("idle");

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        setPreviewData(jsonData.slice(0, 5));
        setStatusMessage(
          `${jsonData.length} satır okundu. İçe aktarmaya hazır.`,
        );
      } catch {
        setStatusMessage(
          "Dosya okunamadı. Lütfen geçerli bir Excel dosyası seçin.",
        );
        setSelectedFile(null);
        setPreviewData(null);
      }
    };
    reader.readAsArrayBuffer(file);
  }, []);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);
      const file = e.dataTransfer.files?.[0];
      if (file && (file.name.endsWith(".xlsx") || file.name.endsWith(".xls"))) {
        processFile(file);
      } else {
        setStatusMessage("Lütfen .xlsx veya .xls dosyası yükleyin.");
      }
    },
    [processFile],
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) processFile(file);
    },
    [processFile],
  );

  // --- IMPORT ---
  const handleImport = useCallback(async () => {
    if (!selectedFile) return;

    setImportStatus("loading");
    setStatusMessage("İçe aktarılıyor...");
    setImportResult(null);

    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: "array" });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet);

          const res = await fetch("/api/datatransfers", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ type: activeTab, data: jsonData }),
          });

          const result = await res.json();

          if (!res.ok) {
            setImportStatus("error");
            setStatusMessage(result.error || "İçe aktarma başarısız.");
            return;
          }

          setImportResult(result);
          setImportStatus("success");
          setStatusMessage(
            `İçe aktarma tamamlandı: ${result.created} yeni, ${result.updated} güncellendi.`,
          );
        } catch (err: any) {
          setImportStatus("error");
          setStatusMessage(err.message || "İçe aktarma sırasında hata oluştu.");
        }
      };
      reader.readAsArrayBuffer(selectedFile);
    } catch (err: any) {
      setImportStatus("error");
      setStatusMessage(err.message || "İçe aktarma sırasında hata oluştu.");
    }
  }, [selectedFile, activeTab]);

  const clearFile = () => {
    setSelectedFile(null);
    setPreviewData(null);
    setImportResult(null);
    setImportStatus("idle");
    setStatusMessage("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const fields = FIELD_INFO[activeTab];

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Veri Aktarımları</h1>
        <p className="text-gray-500 mt-1">
          Verileri Excel olarak dışa aktarın veya içe aktarın
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 bg-gray-100 p-1 rounded-xl w-fit">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => {
              setActiveTab(tab.key);
              clearFile();
            }}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
              activeTab === tab.key
                ? "bg-white text-blue-600 shadow-sm"
                : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Export Card */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-lg">
                <MdFileDownload className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">Dışa Aktar</h2>
                <p className="text-emerald-100 text-sm">
                  Mevcut verileri Excel olarak indirin
                </p>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="mb-5 p-4 bg-emerald-50 rounded-xl border border-emerald-100">
              <div className="flex items-start gap-2">
                <MdInfo className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" />
                <div className="text-sm text-emerald-700">
                  <strong className="capitalize">
                    {TABS.find((t) => t.key === activeTab)?.label}
                  </strong>{" "}
                  tablosundaki tüm veriler Excel dosyası (.xlsx) olarak
                  indirilecektir.
                </div>
              </div>
            </div>

            <button
              onClick={handleExport}
              disabled={exportStatus === "loading"}
              className="w-full flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-300 text-white font-medium py-3 px-4 rounded-xl transition-colors duration-200"
            >
              {exportStatus === "loading" ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <MdFileDownload className="w-5 h-5" />
              )}
              {exportStatus === "loading"
                ? "İndiriliyor..."
                : "Excel Olarak İndir"}
            </button>

            {exportStatus === "success" && (
              <div className="mt-4 flex items-center gap-2 text-emerald-600 text-sm bg-emerald-50 p-3 rounded-lg">
                <MdCheckCircle className="w-5 h-5 shrink-0" />
                {statusMessage}
              </div>
            )}
            {exportStatus === "error" && (
              <div className="mt-4 flex items-center gap-2 text-red-600 text-sm bg-red-50 p-3 rounded-lg">
                <MdError className="w-5 h-5 shrink-0" />
                {statusMessage}
              </div>
            )}
          </div>
        </div>

        {/* Import Card */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-lg">
                <MdFileUpload className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">İçe Aktar</h2>
                <p className="text-blue-100 text-sm">
                  Excel dosyasından veri yükleyin
                </p>
              </div>
            </div>
          </div>

          <div className="p-6">
            {/* Drop Zone */}
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-200 mb-4 ${
                dragActive
                  ? "border-blue-400 bg-blue-50"
                  : selectedFile
                    ? "border-green-300 bg-green-50"
                    : "border-gray-300 hover:border-blue-300 hover:bg-gray-50"
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFileSelect}
                className="hidden"
              />
              {selectedFile ? (
                <div className="flex items-center justify-center gap-3">
                  <MdCheckCircle className="w-8 h-8 text-green-500" />
                  <div className="text-left">
                    <p className="font-medium text-gray-700">
                      {selectedFile.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {(selectedFile.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      clearFile();
                    }}
                    className="ml-2 p-1 hover:bg-gray-200 rounded-full transition-colors"
                  >
                    <MdClose className="w-5 h-5 text-gray-500" />
                  </button>
                </div>
              ) : (
                <>
                  <MdCloudUpload className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600 font-medium">
                    Dosyayı sürükleyip bırakın
                  </p>
                  <p className="text-gray-400 text-sm mt-1">
                    veya tıklayarak seçin (.xlsx, .xls)
                  </p>
                </>
              )}
            </div>

            {/* Preview */}
            {previewData && previewData.length > 0 && (
              <div className="mb-4 border border-gray-200 rounded-xl overflow-hidden">
                <div className="bg-gray-50 px-4 py-2 text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Önizleme (ilk 5 satır)
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50">
                        {Object.keys(previewData[0]).map((key) => (
                          <th
                            key={key}
                            className="px-3 py-2 text-left text-xs font-medium text-gray-500 whitespace-nowrap"
                          >
                            {key}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {previewData.map((row, i) => (
                        <tr key={i} className="border-t border-gray-100">
                          {Object.values(row).map((val: any, j) => (
                            <td
                              key={j}
                              className="px-3 py-2 text-gray-600 whitespace-nowrap max-w-[200px] truncate"
                            >
                              {String(val ?? "")}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            <button
              onClick={handleImport}
              disabled={!selectedFile || importStatus === "loading"}
              className="w-full flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-xl transition-colors duration-200"
            >
              {importStatus === "loading" ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <MdFileUpload className="w-5 h-5" />
              )}
              {importStatus === "loading" ? "İçe Aktarılıyor..." : "İçe Aktar"}
            </button>

            {/* Import Result */}
            {importStatus === "success" && importResult && (
              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2 text-green-600 text-sm bg-green-50 p-3 rounded-lg">
                  <MdCheckCircle className="w-5 h-5 shrink-0" />
                  <span>
                    <strong>{importResult.created}</strong> yeni kayıt
                    oluşturuldu, <strong>{importResult.updated}</strong> kayıt
                    güncellendi.
                  </span>
                </div>
                {importResult.errors.length > 0 && (
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                    <p className="text-amber-700 text-sm font-medium mb-1">
                      {importResult.errors.length} hata oluştu:
                    </p>
                    <ul className="text-amber-600 text-xs space-y-1 max-h-32 overflow-y-auto">
                      {importResult.errors.map((err, i) => (
                        <li key={i} className="flex items-start gap-1">
                          <span className="text-amber-400 mt-0.5">•</span>
                          {err}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
            {importStatus === "error" && (
              <div className="mt-4 flex items-center gap-2 text-red-600 text-sm bg-red-50 p-3 rounded-lg">
                <MdError className="w-5 h-5 shrink-0" />
                {statusMessage}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Field Reference */}
      <div className="mt-6 bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
        <h3 className="text-base font-semibold text-gray-700 mb-4">
          Alan Bilgileri –{" "}
          <span className="text-blue-600 capitalize">
            {TABS.find((t) => t.key === activeTab)?.label}
          </span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="text-sm font-medium text-red-600 mb-2">
              Zorunlu Alanlar
            </h4>
            <div className="flex flex-wrap gap-2">
              {fields.required.map((f) => (
                <span
                  key={f}
                  className="px-3 py-1 bg-red-50 text-red-700 text-sm rounded-lg border border-red-200 font-mono"
                >
                  {f}
                </span>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-2">
              Opsiyonel Alanlar
            </h4>
            <div className="flex flex-wrap gap-2">
              {fields.optional.map((f) => (
                <span
                  key={f}
                  className="px-3 py-1 bg-gray-50 text-gray-600 text-sm rounded-lg border border-gray-200 font-mono"
                >
                  {f}
                </span>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
          <p className="text-sm text-blue-700">
            <strong>İpucu:</strong> Önce mevcut veriyi dışa aktararak Excel
            şablon formatını görün, ardından aynı formatta dosya hazırlayıp içe
            aktarın. <code className="bg-blue-100 px-1 rounded">id</code> alanı
            varsa mevcut kayıt güncellenir, yoksa yeni kayıt oluşturulur.
          </p>
        </div>
      </div>
    </div>
  );
}
