"use client";

import TableBuilder from "@/components/admin/tableBuilder";
import FormBuilder from "@/components/formBuilder";
import Popup from "@/components/popup/popup";
import { fetchData } from "@/utils/fetchData";
import { useFormHandler } from "@/utils/hooks";
import React, { useEffect, useState } from "react";
import { useAuthHandler } from "../authHandler/authOptions";

export default function page() {
  const [isLoading, setIsloading] = useState(false);
  const [categories, setCategories] = useState([] as any);
  const [isShowPopUp, setIsShowPopUp] = useState(false);
  const { canView, canCreate, canEdit, canDelete, userData, loading } =
    useAuthHandler();
  const { isSubmitting, resError, handleFormSubmit } = useFormHandler();
  const [data, setData] = useState({
    title: "",
    description: "",
    subscriberId: userData?.subscriberId || "",
  } as any);

  useEffect(() => {
    if (loading || !userData) return;

    const requestData = async () => {
      try {
        setIsloading(true);
        let resData = [] as any;
        if (userData.role && userData.role !== "ADMIN") {
          const query = encodeURIComponent(
            JSON.stringify({
              subscriberId: userData.subscriberId,
            }),
          );
          resData = await fetchData({
            apiPath: `/api/category?where=${query}`,
          });
        } else {
          resData = await fetchData({
            apiPath: "/api/category",
          });
        }

        setCategories(resData);
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

    if (actionType === "add") {
      setData({
        title: "",
        description: "",
        subscriberId: userData?.subscriberId || "",
      });
      setIsShowPopUp(true);
    }
    if (actionType === "edit") {
      setData({
        ...currentUser,
      });
      setIsShowPopUp(true);
    }
    if (actionType === "delete") {
      if (confirm("Silmek istediğini emin misin ?")) {
        try {
          setIsloading(true);
          const res = await fetch("/api/category", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: currentUser.id }),
          });

          if (res.ok) {
            await res.json();
            setCategories(
              [...categories].filter((val: any) => val.id !== currentUser.id),
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
  };

  const handleFormResponse = (response: Response) => {
    if (response.ok) {
      if (typeof window !== "undefined") {
        window.location.href = "/admin/category";
      }
    }
  };

  return (
    <div className="w-full">
      {canView ? (
        <TableBuilder
          key={isLoading}
          tableData={categories}
          columnKey="categoryColumn"
          onAction={handleAction}
          onAdd={handleAction}
          isLoading={isLoading}
          showAddButton={canCreate}
          showEditRow={canEdit}
          showDeleteRow={canDelete}
        />
      ) : null}

      {canCreate ? (
        <Popup
          show={isShowPopUp}
          onClose={() => setIsShowPopUp(false)}
          title="Kategori Ekle"
          bodyClass="flex flex-col gap-3 pb-6 pt-0 !max-w-[700px] !w-[90%] max-h-[80%]"
          overlayClass="z-10"
          titleClass="border-b-2 border-blue-400 pt-6 pb-2 px-8 bg-[#f5f5f5]"
        >
          <FormBuilder
            id={"category"}
            className="px-8"
            data={data}
            onSubmit={(values) =>
              handleFormSubmit({
                values,
                method: "POST",
                apiPath: "/api/category",
                callback: (res: Response) => handleFormResponse(res),
              })
            }
            isSubmitting={isSubmitting}
            resError={resError}
            submitBtnProps={{
              text: "Kaydet",
              type: "submit",
            }}
          />
        </Popup>
      ) : null}
    </div>
  );
}
