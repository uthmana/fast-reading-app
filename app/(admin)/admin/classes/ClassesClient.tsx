"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { AuthDataTypes, ClassesTypes } from "../(utils)/lib/dataModel";
import TableBuilder from "../(utils)/components/tableBuilder";
import FormBuilder from "../(utils)/components/formBuilder";
import { useFormHandler } from "../(utils)/hooks/useFormHandler";
import { fetchData } from "../(utils)/lib/fetchData/fetchData";
import Popup from "../(utils)/components/popup/popup";

type Props = {
  classes: ClassesTypes[];
  authData: AuthDataTypes;
};

export default function classesClient({
  classes: classesData,
  authData,
}: Props) {
  const router = useRouter();
  const [isLoading, setIsloading] = useState(false);
  const [classes, setClasses] = useState(classesData);
  const [isShowPopUp, setIsShowPopUp] = useState(false);
  const { canView, canCreate, canEdit, canDelete, userData } = authData;
  const { isSubmitting, resError, handleFormSubmit } = useFormHandler();
  const [data, setData] = useState({
    role: "ADMIN",
    active: true,
  } as any);

  const handleAction = async (actionType: string, info: any) => {
    const currentUser = info?.row?.original;

    if (actionType === "add") {
      setData({
        subscriberId: userData?.subscriberId,
      });
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
          const resData = await fetchData({
            apiPath: "/api/classes",
            method: "DELETE",
            payload: { id: currentUser.id },
          });
          setClasses(
            [...classes].filter((val: any) => val.id !== currentUser.id),
          );
          setIsloading(false);
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
      {canView ? (
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
          title="Sınıf Ekle"
          bodyClass="flex flex-col gap-3 pb-6 pt-0 !max-w-[700px] !w-[90%] max-h-[80%]"
          overlayClass="z-10"
          titleClass="border-b-2 border-blue-400 pt-6 pb-2 px-8 bg-[#f5f5f5]"
        >
          <FormBuilder
            id={userData?.role !== "ADMIN" ? "classes" : "registerClasses"}
            className="px-8"
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
      ) : null}
    </div>
  );
}
