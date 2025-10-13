"use client";

import TableBuilder from "@/components/admin/tableBuilder";
import FormBuilder from "@/components/formBuilder";
import Popup from "@/components/popup/popup";
import { fetchData } from "@/utils/fetchData";
import { useFormHandler } from "@/utils/hooks";
import React, { useEffect, useState } from "react";

export default function page() {
  const [isLoading, setIsloading] = useState(false);
  const [articles, setArticles] = useState([] as any);
  const [isShowPopUp, setIsShowPopUp] = useState(false);
  const { isSubmitting, resError, handleFormSubmit } = useFormHandler();
  const [data, setData] = useState({} as any);

  useEffect(() => {
    const requestData = async () => {
      try {
        setIsloading(true);
        const resData = await fetchData({ apiPath: "/api/articles" });
        setArticles(resData);
        setIsloading(false);
      } catch (error) {
        setIsloading(false);
        console.error(error);
        return;
      }
    };

    requestData();
  }, []);

  const handleAction = async (actionType: string, info: any) => {
    const currentArticle = info?.row?.original;

    if (actionType === "add") {
      setData({ ...data });
      setIsShowPopUp(true);
    }
    if (actionType === "edit") {
      setData({
        ...currentArticle,
      });
      setIsShowPopUp(true);
    }
    if (actionType === "delete") {
      try {
        setIsloading(true);
        await fetchData({
          apiPath: "/api/articles",
          method: "DELETE",
          payload: { id: currentArticle.id },
        });
        setArticles(
          [...articles].filter((val: any) => val.id !== currentArticle.id)
        );
        setIsloading(false);
      } catch (error) {
        setIsloading(false);
        console.error(error);
        return;
      }
    }
  };

  const handleFormResponse = (response: Response) => {
    if (response.ok) {
      if (typeof window !== "undefined") {
        window.location.href = "/admin/articles";
      }
    }
  };

  return (
    <div className="w-full">
      <h1 className="text-2xl mb-4 p-2 font-bold">Okuma Metinler</h1>

      <TableBuilder
        key={isLoading}
        tableData={articles}
        columnKey="articlesColumn"
        onAction={handleAction}
        onAdd={handleAction}
      />

      <Popup
        show={isShowPopUp}
        onClose={() => setIsShowPopUp(false)}
        title="Makale Ekle"
        bodyClass="flex flex-col gap-3 py-6 px-8"
      >
        <FormBuilder
          id={"article"}
          data={data}
          onSubmit={(values) =>
            handleFormSubmit({
              values,
              method: "POST",
              apiPath: "/api/articles",
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
