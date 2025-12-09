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
  const [teachers, setTeachers] = useState([] as any);
  const [teachersRaw, setTeachersRaw] = useState([] as any);
  const [isShowPopUp, setIsShowPopUp] = useState(false);
  const { canView, canCreate, canEdit, canDelete, loading, userData } =
    useAuthHandler();
  const { isSubmitting, resError, handleFormSubmit } = useFormHandler();
  const [data, setData] = useState({} as any);

  useEffect(() => {
    if (loading || !userData) return;

    const requestData = async () => {
      try {
        if (!userData.subscriberId) return;
        const query = encodeURIComponent(
          JSON.stringify({
            subscriberId: userData.subscriberId,
          })
        );
        setIsloading(true);
        const res = await fetchData({
          apiPath: `/api/teachers?where=${query}`,
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
  }, [loading, userData]);

  const handleAction = async (actionType: string, info: any) => {
    const currentUser = info?.row?.original;

    if (actionType === "add") {
      setData({ subscriberId: userData?.subscriberId });
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
      {canView ? (
        <TableBuilder
          key={isLoading}
          tableData={teachers}
          columnKey="teacherColumn"
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
          title="Öğretmen Ekle"
          bodyClass="flex flex-col gap-3 pb-6 pt-0 !max-w-[700px] !w-[90%] max-h-[80%]"
          overlayClass="z-10"
          titleClass="border-b-2 border-blue-400 pt-6 pb-2 px-8 bg-[#f5f5f5]"
        >
          <FormBuilder
            id={"teacher"}
            data={data}
            className="px-8 overflow-y-auto"
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
      ) : null}
    </div>
  );
}
