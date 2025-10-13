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
    role: "STUDENT",
    active: true,
  } as any);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsloading(true);
        const res = await fetch("/api/students", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        if (res.ok) {
          const resData = await res.json();
          const allData = resData.map((dVal: any) => {
            const { user, ...rest } = dVal;
            const { id, ...uersRest } = user;
            return {
              ...uersRest,
              id: rest.id,
              level: rest.level,
              startDate: rest.startDate,
              endDate: rest.endDate,
              studentId: rest.id,
            };
          });
          setStudents(allData);
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
      setData({ ...data });
      setIsShowPopUp(true);
    }
    if (actionType === "edit") {
      setData({
        ...currentUser,
        startDate: currentUser.startDate?.split("T")[0],
        endDate: currentUser.endDate?.split("T")[0],
      });
      setIsShowPopUp(true);
    }
    if (actionType === "delete") {
      try {
        setIsloading(true);
        const res = await fetch("/api/students", {
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
  };

  const handleFormResponse = (response: Response) => {
    if (response.ok) {
      if (typeof window !== "undefined") {
        window.location.href = "/admin/students";
        return;
      }
    }
  };

  return (
    <div className="w-full">
      <h1 className="text-2xl mb-4 p-2 font-bold">Öğrenciler</h1>
      <TableBuilder
        isLoading={isLoading}
        key={isLoading}
        tableData={students}
        columnKey="studentColumn"
        onAction={handleAction}
        onAdd={handleAction}
      />

      <Popup
        show={isShowPopUp}
        onClose={() => setIsShowPopUp(false)}
        title="Öğrenci Ekle"
        bodyClass="flex flex-col gap-3 py-6 px-8"
      >
        <FormBuilder
          id={"student"}
          data={data}
          onSubmit={(values) =>
            handleFormSubmit({
              values,
              method: "POST",
              apiPath: "/api/students",
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
