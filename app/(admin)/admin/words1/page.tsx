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
  const [words, setWords] = useState([] as any);
  const [isShowPopUp, setIsShowPopUp] = useState(false);
  const { canView, canCreate, canEdit, canDelete, userData, loading } =
    useAuthHandler();
  const { isSubmitting, resError, handleFormSubmit } = useFormHandler();
  const [data, setData] = useState({
    word: "",
    similarWord: "",
    subscriberId: userData?.subscriberId || "",
  } as any);

  useEffect(() => {
    if (loading || !userData) return;
    const requestData = async () => {
      try {
        setIsloading(true);

        let resData = [] as any;
        if (userData.role && userData.role !== "ADMIN") {
          const query = encodeURIComponent(
            JSON.stringify({
              subscriberId: userData.subscriberId,
            }),
          );
          resData = await fetchData({
            apiPath: `/api/words?where=${query}`,
          });
        } else {
          resData = await fetchData({
            apiPath: "/api/words",
          });
        }
        setWords(resData);
        setIsloading(false);
      } catch (error) {
        setIsloading(false);
        console.error(error);
        return;
      }
    };

    requestData();
  }, [userData, loading]);

  const handleAction = async (actionType: string, info: any) => {
    const currentUser = info?.row?.original;

    if (actionType === "add") {
      setData({
        word: "",
        similarWord: "",
        subscriberId: userData?.subscriberId || "",
      });
      setIsShowPopUp(true);
    }
    if (actionType === "edit") {
      const studyGroups = currentUser.studyGroups.map(
        (item: { id: number; group: string; wordsId: number }) => {
          return item.group;
        },
      );
      setData({
        ...currentUser,
        studyGroups,
      });
      setIsShowPopUp(true);
    }
    if (actionType === "delete") {
      if (confirm("Silmek istediğini emin misin ?")) {
        try {
          setIsloading(true);

          const resData = await fetchData({
            apiPath: "/api/words",
            method: "DELETE",
            payload: { id: currentUser.id },
          });
          setWords([...words].filter((val: any) => val.id !== currentUser.id));
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
        window.location.href = "/admin/words";
      }
    }
  };

  return (
    <div className="w-full">
      {canView ? (
        <TableBuilder
          key={isLoading}
          tableData={words}
          columnKey="allWordsColumn"
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
          title="Kelime Ekle"
          bodyClass="flex flex-col gap-3 pb-6 pt-0 !max-w-[700px] !w-[90%] max-h-[80%]"
          overlayClass="z-10"
          titleClass="border-b-2 border-blue-400 pt-6 pb-2 px-8 bg-[#f5f5f5]"
        >
          <FormBuilder
            id={"allWords"}
            className="px-8"
            data={data}
            onSubmit={(values) =>
              handleFormSubmit({
                values,
                method: "POST",
                apiPath: "/api/words",
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
