"use client";

import TableBuilder from "@/components/admin/tableBuilder";
import FormBuilder from "@/components/formBuilder";
import Popup from "@/components/popup/popup";
import { fetchData } from "@/utils/fetchData";
import { useFormHandler } from "@/utils/hooks";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function page() {
  const router = useRouter();
  const [isLoading, setIsloading] = useState(false);
  const [classes, setClasses] = useState([] as any);
  const [isShowPopUp, setIsShowPopUp] = useState(false);
  const { isSubmitting, resError, handleFormSubmit } = useFormHandler();
  const [data, setData] = useState({
    role: "ADMIN",
    active: true,
  } as any);

  useEffect(() => {
    const requestData = async () => {
      try {
        setIsloading(true);
        const resData = await fetchData({ apiPath: "/api/classes" });
        setClasses(resData);
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
    const currentUser = info?.row?.original;

    if (actionType === "add") {
      setData({});
      setIsShowPopUp(true);
    }
    if (actionType === "edit") {
      setData({
        ...currentUser,
        createdAt: new Date(currentUser.createdAt).toISOString().split("T")[0],
      });
      setIsShowPopUp(true);
    }
    if (actionType === "delete") {
      if (confirm("Silmek istediğini emin misin ?")) {
        try {
          setIsloading(true);
          const res = await fetch("/api/classes", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: currentUser.id }),
          });

          if (res.ok) {
            await res.json();
            setClasses(
              [...classes].filter((val: any) => val.id !== currentUser.id)
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
    if (actionType === "addStudentToClass") {
      router.push(`/admin/students?classId=${currentUser.id}&editmodel=true`);
    }
  };

  const handleFormResponse = (response: Response) => {
    if (response.ok) {
      if (typeof window !== "undefined") {
        window.location.href = "/admin/classes";
      }
    }
  };

  return (
    <div className="w-full">
      <h1 className="text-2xl mb-4 p-2 font-bold">Sınıflar</h1>

      <TableBuilder
        key={isLoading}
        tableData={classes}
        columnKey="classColumn"
        onAction={handleAction}
        onAdd={handleAction}
        additionalActions={[
          {
            action: "addStudentToClass",
            actionName: "Sınıfa Öğrenci Ekle",
            icon: "addUser",
          },
        ]}
      />

      <Popup
        show={isShowPopUp}
        onClose={() => setIsShowPopUp(false)}
        title="Sınıf Ekle"
        bodyClass="flex flex-col gap-3 py-6 px-8"
      >
        <FormBuilder
          id={"classes"}
          data={data}
          onSubmit={(values) =>
            handleFormSubmit({
              values,
              method: "POST",
              apiPath: "/api/classes",
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
