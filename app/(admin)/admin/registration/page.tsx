"use client";

import React, { useEffect, useState } from "react";
import TableBuilder from "@/components/admin/tableBuilder";
import { fetchData } from "@/utils/fetchData";
import { useAuthHandler } from "../authHandler/authOptions";
import Popup from "@/components/popup/popup";
import { formatDateTime } from "@/utils/helpers";
import Link from "next/link";
import Button from "@/components/button/button";

export default function page() {
  const [isLoading, setIsloading] = useState(false);
  const [registrations, setRegistrations] = useState([] as any);
  const [selectedRegistration, setSelectedRegistration] = useState(null as any);
  const { canView, canDelete, userData, loading } = useAuthHandler();
  const [isShowApplicationDetailPopUp, setIsShowApplicationDetailPopUp] =
    useState(false);

  useEffect(() => {
    if (loading || !userData) return;
    const requestData = async () => {
      try {
        setIsloading(true);

        if (userData.role === "ADMIN") {
          const resData = await fetchData({
            apiPath: `/api/registration`,
          });
          setRegistrations(resData);
          setIsloading(false);
          return;
        }
        setIsloading(false);
      } catch (error) {
        setIsloading(false);
        console.error(error);
        return;
      }
    };

    requestData();
  }, [userData, loading]);

  const handleAction = async (actionType: string, info: any) => {
    const currentUser = info?.row?.original;

    if (actionType === "delete") {
      if (confirm("Silmek istediğini emin misin ?")) {
        try {
          setIsloading(true);
          const res = await fetch("/api/registration", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: currentUser.id }),
          });

          if (res.ok) {
            await res.json();
            setRegistrations(
              [...registrations].filter(
                (val: any) => val.id !== currentUser.id,
              ),
            );
            setIsloading(false);
          }
        } catch (error) {
          setIsloading(false);
          console.error(error);
          return;
        }
      }
    }

    if (actionType === "showApplicationDetail") {
      setSelectedRegistration(currentUser);
      setIsShowApplicationDetailPopUp(true);
    }
  };

  return (
    <div className="w-full">
      {userData?.role === "ADMIN" ? (
        <TableBuilder
          isLoading={isLoading}
          key={isLoading}
          tableData={registrations}
          showAddButton={false}
          columnKey="registrationColumn"
          onAction={handleAction}
          additionalActions={[
            {
              action: "showApplicationDetail",
              actionName: "Bașvuru Detayı",
              icon: "eye",
            },
          ]}
          showEditRow={false}
          showDeleteRow={canDelete}
        />
      ) : canView ? (
        <TableBuilder
          isLoading={isLoading}
          key={isLoading}
          tableData={registrations}
          showAddButton={false}
          columnKey="registrationColumn"
          onAction={handleAction}
          showEditRow={false}
          additionalActions={[
            {
              action: "showApplicationDetail",
              actionName: "Bașvuru Detayı",
              icon: "eye",
            },
          ]}
          showDeleteRow={canDelete}
        />
      ) : null}

      <Popup
        show={isShowApplicationDetailPopUp}
        onClose={() => setIsShowApplicationDetailPopUp(false)}
        title={selectedRegistration?.name + " - Başvuru Detayı"}
        bodyClass="flex flex-col gap-3 pb-6 pt-0 !max-w-[90%] !w-[800px] max-h-[80%]"
        overlayClass="z-10"
        titleClass="border-b-2 border-blue-400 pt-6 pb-2 px-8 bg-[#f5f5f5]"
      >
        <div className="mx-auto bg-white p-6 text-left space-y-6">
          {/* Başvuru Bilgileri */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 text-sm">
            <div>
              <p className="text-gray-400">Başvuru Türü</p>
              <p className="font-medium text-gray-900">
                {selectedRegistration?.type === "TRIAL_CLASS"
                  ? "Öğrenci Kaydı"
                  : "Bayilik"}
              </p>
            </div>

            {selectedRegistration?.type === "FRANCHISE" && (
              <div>
                <p className="text-gray-400">Kurum Bilgisi</p>
                <p className="font-medium text-gray-900">
                  {selectedRegistration?.companyInfo}
                </p>
              </div>
            )}

            {selectedRegistration?.type !== "FRANCHISE" && (
              <div>
                <p className="text-gray-400">Eğitim Grubu</p>
                <p className="font-medium text-gray-900">
                  {selectedRegistration?.studyGroup}
                </p>
              </div>
            )}

            <div>
              <p className="text-gray-400">E-posta</p>
              <p className="font-medium text-gray-900">
                {selectedRegistration?.email}
              </p>
            </div>

            <div>
              <p className="text-gray-400">Telefon</p>
              <p className="font-medium text-gray-900">
                {selectedRegistration?.phone}
              </p>
            </div>

            <div>
              <p className="text-gray-400">Başvuru Tarihi</p>
              <p className="font-medium text-gray-900">
                {formatDateTime(selectedRegistration?.createdAt)}
              </p>
            </div>
          </div>

          {/* Mesaj */}
          <div className="border-t pt-4">
            <p className="text-sm font-semibold text-gray-700 mb-2">Mesaj</p>
            <p className="text-gray-600 whitespace-pre-wrap leading-relaxed">
              {selectedRegistration?.message}
            </p>
          </div>

          {/* Durum */}
          <div className="flex items-center justify-between border-t pt-4">
            <p className="text-sm font-semibold text-gray-700">İşlem Durumu</p>
            <span
              className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium
        ${
          selectedRegistration?.isProcessed
            ? "bg-green-100 text-green-700"
            : "bg-yellow-100 text-yellow-700"
        }`}
            >
              {selectedRegistration?.isProcessed ? "İşlendi" : "Beklemede"}
            </span>
          </div>

          {selectedRegistration?.isProcessed ? null : (
            <div className="border-t pt-4 ">
              <Link
                href={`/admin/${
                  selectedRegistration?.type === "FRANCHISE"
                    ? "users"
                    : "students"
                }?regno=${selectedRegistration?.id}`}
                className="text-sm no-underline"
              >
                <Button
                  className="uppercase hover:bg-blue-600"
                  text="Kayit olustur"
                />
              </Link>
            </div>
          )}
        </div>
      </Popup>
    </div>
  );
}
