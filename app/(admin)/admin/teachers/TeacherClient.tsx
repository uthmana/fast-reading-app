"use client";

import TableBuilder from "@/components/admin/tableBuilder";
import Popup from "@/components/common/popup/popup";
import { fetchData } from "@/lib/fetchData/fetchData";
import { useFormHandler } from "@/utils/hooks/useFormHandler";
import React, { useEffect, useState } from "react";
import FormBuilder from "@/components/admin/formBuilder";
import { AuthDataTypes, TeacherTypes } from "@/components/admin/model/admin";

type Props = {
  teachers: TeacherTypes[];
  authData: AuthDataTypes;
};

const formartTeacherData = (allTeachers: TeacherTypes[]) => {
  return allTeachers?.map((item: any) => {
    const { user, ...rest } = item;
    return {
      ...rest,
      name: user.name,
    };
  });
};

export default function page({ teachers: allTeachers, authData }: Props) {
  const [isLoading, setIsloading] = useState(false);
  const [teachers, setTeachers] = useState(
    formartTeacherData(allTeachers) ?? [],
  );
  const [teachersRaw, setTeachersRaw] = useState((allTeachers ?? []) as any);
  const [isShowPopUp, setIsShowPopUp] = useState(false);
  const { canView, canCreate, canEdit, canDelete, userData } = authData;
  const { isSubmitting, resError, handleFormSubmit } = useFormHandler();
  const [data, setData] = useState({} as any);

  useEffect(() => {
    setTeachersRaw(allTeachers);
    const formattedData = allTeachers?.map((item: any) => {
      const { user, ...rest } = item;
      return {
        ...rest,
        name: user.name,
      };
    });
    setTeachers(formattedData);
  }, [allTeachers]);

  const handleAction = async (actionType: string, info: any) => {
    const currentUser = info?.row?.original;

    if (actionType === "add") {
      setData({ subscriberId: userData?.subscriberId });
      setIsShowPopUp(true);
    }
    if (actionType === "edit") {
      const tempData = [...teachersRaw].find(
        (item: any) => item.id === currentUser.id,
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
            [...teachers].filter((val: any) => val.id !== currentUser.id),
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
            id={userData?.role !== "ADMIN" ? "teacher" : "registerTeacher"}
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
