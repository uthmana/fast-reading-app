"use client";

import TableBuilder from "@/components/admin/tableBuilder";
import FormBuilder from "@/components/formBuilder";
import Popup from "@/components/popup/popup";
import { fetchData } from "@/utils/fetchData";
import { useFormHandler } from "@/utils/hooks";
import React, { useEffect, useState } from "react";

export default function page() {
  const [isLoading, setIsloading] = useState(false);
  const [teachers, setTeachers] = useState([] as any);
  const [teachersRaw, setTeachersRaw] = useState([] as any);
  const [isShowPopUp, setIsShowPopUp] = useState(false);
  const { isSubmitting, resError, handleFormSubmit } = useFormHandler();
  const [data, setData] = useState({} as any);

  useEffect(() => {
    const requestData = async () => {
      try {
        setIsloading(true);
        const res = await fetchData({
          apiPath: "/api/teachers",
        });
        setTeachersRaw(res);
        const formattedData = res?.map((item: any) => {
          const { user, ...rest } = item;
          return {
            ...rest,
            name: user.name,
          };
        });
        setTeachers(formattedData);
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
      const tempData = [...teachersRaw].find(
        (item: any) => item.id === currentUser.id
      );
      const { id, active, ...rest } = tempData?.user;
      setData({
        ...rest,
        ...currentUser,
      });
      setIsShowPopUp(true);
    }
    if (actionType === "delete") {
      if (confirm("Silmek istediğini emin misin ?")) {
        try {
          setIsloading(true);

          const res = await fetchData({
            apiPath: "/api/teachers",
            method: "DELETE",
            payload: { id: currentUser.id },
          });
          setTeachers(
            [...teachers].filter((val: any) => val.id !== currentUser.id)
          );
          setIsloading(false);
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
        window.location.href = "/admin/teachers";
      }
    }
  };

  return (
    <div className="w-full">
      <h1 className="text-2xl mb-4 p-2 font-bold">Kullanıcılar</h1>

      <TableBuilder
        key={isLoading}
        tableData={teachers}
        columnKey="teacherColumn"
        onAction={handleAction}
        onAdd={handleAction}
      />

      <Popup
        show={isShowPopUp}
        onClose={() => setIsShowPopUp(false)}
        title="Öğretmen Ekle"
        bodyClass="flex flex-col gap-3 py-6 px-8"
      >
        <FormBuilder
          id={"teacher"}
          data={data}
          onSubmit={(values) =>
            handleFormSubmit({
              values,
              method: "POST",
              apiPath: "/api/teachers",
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
