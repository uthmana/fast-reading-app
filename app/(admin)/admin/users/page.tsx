"use client";

import TableBuilder from "@/components/admin/tableBuilder";
import FormBuilder from "@/components/formBuilder";
import Popup from "@/components/popup/popup";
import { useFormHandler } from "@/utils/hooks";
import React, { useEffect, useState } from "react";

export default function page() {
  const [isLoading, setIsloading] = useState(false);
  const [students, setStudents] = useState([] as any);
  const [isShowPopUp, setIsShowPopUp] = useState(false);
  const { isSubmitting, resError, handleFormSubmit } = useFormHandler();
  const [data, setData] = useState({
    role: "ADMIN",
    active: true,
  } as any);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsloading(true);
        const res = await fetch("/api/users", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        if (res.ok) {
          const resData = await res.json();
          setStudents(resData.filter((val: any) => val.role === "ADMIN"));
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
        createdAt: new Date(currentUser.createdAt).toISOString().split("T")[0],
      });
      setIsShowPopUp(true);
    }
    if (actionType === "delete") {
      if (confirm("Silmek istediğini emin misin ?")) {
        try {
          setIsloading(true);
          const res = await fetch("/api/users", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: currentUser.id }),
          });

          if (res.ok) {
            await res.json();
            setStudents(
              [...students].filter((val: any) => val.id !== currentUser.id)
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
        window.location.href = "/admin/users";
      }
    }
  };

  return (
    <div className="w-full">
      <h1 className="text-2xl mb-4 p-2 font-bold">Kullanıcılar</h1>

      <TableBuilder
        key={isLoading}
        tableData={students}
        columnKey="usersColumn"
        onAction={handleAction}
        onAdd={handleAction}
      />

      <Popup
        show={isShowPopUp}
        onClose={() => setIsShowPopUp(false)}
        title="Kullanıcı Ekle"
        bodyClass="flex flex-col gap-3 py-6 px-8"
      >
        <FormBuilder
          id={"user"}
          data={data}
          onSubmit={(values) =>
            handleFormSubmit({
              values,
              method: "POST",
              apiPath: "/api/users",
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
