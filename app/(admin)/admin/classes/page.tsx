"use client";

import TableBuilder from "@/components/admin/tableBuilder";
import FormBuilder from "@/components/formBuilder";
import Popup from "@/components/popup/popup";
import { fetchData } from "@/utils/fetchData";
import { useFormHandler } from "@/utils/hooks";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useAuthHandler } from "../authHandler/authOptions";

export default function page() {
  const router = useRouter();
  const [isLoading, setIsloading] = useState(false);
  const [classes, setClasses] = useState([] as any);
  const [isShowPopUp, setIsShowPopUp] = useState(false);
  const { loading, canView, canCreate, canEdit, canDelete, userData } =
    useAuthHandler();
  const { isSubmitting, resError, handleFormSubmit } = useFormHandler();
  const [data, setData] = useState({
    role: "ADMIN",
    active: true,
  } as any);

  useEffect(() => {
    if (loading || !userData) return;

    const requestData = async () => {
      try {
        setIsloading(true);
        const query = encodeURIComponent(
          JSON.stringify({
            subscriberId: userData.subscriberId,
          })
        );
        setIsloading(true);
        const resData = await fetchData({
          apiPath: `/api/classes?where=${query}&subscriber=true`,
        });

        setClasses(resData);
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
            [...classes].filter((val: any) => val.id !== currentUser.id)
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
            id={"classes"}
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
