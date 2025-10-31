"use client";

import TableBuilder from "@/components/admin/tableBuilder";
import FormBuilder from "@/components/formBuilder";
import Popup from "@/components/popup/popup";
import { useFormHandler } from "@/utils/hooks";
import React, { useEffect, useState } from "react";

export default function page() {
  const [isLoading, setIsloading] = useState(false);
  const [categories, setCategories] = useState([] as any);
  const [isShowPopUp, setIsShowPopUp] = useState(false);
  const { isSubmitting, resError, handleFormSubmit } = useFormHandler();
  const [data, setData] = useState({
    title: "",
    description: "",
  } as any);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsloading(true);
        const res = await fetch("/api/category", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        if (res.ok) {
          const resData = await res.json();
          setCategories(resData);
          setIsloading(false);
        }
      } catch (error) {
        setIsloading(false);
        console.error(error);
        return;
      }
    };

    fetchData();
  }, []);

  const handleAction = async (actionType: string, info: any) => {
    const currentUser = info?.row?.original;

    if (actionType === "add") {
      setData({});
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
              [...categories].filter((val: any) => val.id !== currentUser.id)
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
      <h1 className="text-2xl mb-4 p-2 font-bold">Kullanıcılar</h1>

      <TableBuilder
        key={isLoading}
        tableData={categories}
        columnKey="categoryColumn"
        onAction={handleAction}
        onAdd={handleAction}
      />

      <Popup
        show={isShowPopUp}
        onClose={() => setIsShowPopUp(false)}
        title="Kategori Ekle"
        bodyClass="flex flex-col gap-3 py-6 px-8"
      >
        <FormBuilder
          id={"category"}
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
    </div>
  );
}
