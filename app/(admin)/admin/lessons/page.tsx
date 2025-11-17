"use client";

import TableBuilder from "@/components/admin/tableBuilder";
import FormBuilder from "@/components/formBuilder";
import Popup from "@/components/popup/popup";
import { fetchData } from "@/utils/fetchData";
import { useFormHandler } from "@/utils/hooks";
import Link from "next/link";
import React, { useEffect, useState } from "react";

export default function page() {
  const [isLoading, setIsloading] = useState(false);
  const [lessons, setLessons] = useState([] as any);
  const [isShowPopUp, setIsShowPopUp] = useState(false);
  const { isSubmitting, resError, handleFormSubmit } = useFormHandler();
  const [data, setData] = useState({} as any);

  const [isShowLessonPopUp, setIsShowExercisePopUp] = useState(false);
  const [selectedlesson, setSelectedLesson] = useState({} as any);

  const requestData = async () => {
    try {
      setIsloading(true);
      const resData = await fetchData({ apiPath: "/api/lessons" });
      setLessons(resData);
      setIsloading(false);
    } catch (error) {
      setIsloading(false);
      console.error(error);
      return;
    }
  };

  useEffect(() => {
    requestData();
  }, []);

  const handleAction = async (actionType: string, info: any) => {
    const currentLesson = info?.row?.original;
    setSelectedLesson(currentLesson);

    if (actionType === "add") {
      setData({});
      setIsShowPopUp(true);
    }
    if (actionType === "edit") {
      setData({
        ...currentLesson,
        ...(currentLesson?.Exercise?.length > 0
          ? { Exercise: currentLesson?.Exercise?.map((item: any) => item.id) }
          : {}),
      });
      setIsShowPopUp(true);
    }
    if (actionType === "delete") {
      if (confirm("Silmek istediğini emin misin ?")) {
        try {
          setIsloading(true);
          await fetchData({
            apiPath: "/api/lessons",
            method: "DELETE",
            payload: { id: currentLesson.id },
          });
          setLessons(
            [...lessons].filter((val: any) => val.id !== currentLesson.id)
          );
          setIsloading(false);
        } catch (error) {
          setIsloading(false);
          console.error(error);
          return;
        }
      }
    }
    if (actionType === "exercises") {
      setIsShowExercisePopUp(true);
    }
  };

  const handleFormResponse = (response: Response) => {
    if (response.ok) {
      if (typeof window !== "undefined") {
        window.location.href = "/admin/lessons";
      }
    }
  };

  const handleLesssonData = async (values: any) => {
    const { event, formData } = values;
    event.preventDefault();
    try {
      const apiPath =
        formData.Exercise.length > 0
          ? `/api/exercises?ids=${encodeURIComponent(
              formData.Exercise.join(",")
            )}`
          : "";
      const resData = await fetchData({ apiPath });
      const newFormData = {
        ...formData,
        Exercise: resData?.map((item: any) => {
          const { createdAt, lessonId, ...rest } = item;
          return rest;
        }),
      };
      const newValue = { ...values, formData: newFormData };
      handleFormSubmit({
        values: newValue,
        method: "POST",
        apiPath: "/api/lessons",
        callback: (res: Response) => handleFormResponse(res),
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="w-full">
      <h1 className="text-2xl mb-4 p-2 font-bold">Dersler</h1>

      <TableBuilder
        key={isLoading}
        tableData={lessons}
        columnKey="lessonColumn"
        onAction={handleAction}
        onAdd={handleAction}
      />

      <Popup
        key="lessonpopup"
        show={isShowPopUp}
        onClose={() => setIsShowPopUp(false)}
        title="Ders Ekle"
        bodyClass="flex flex-col gap-3 py-6 px-8"
      >
        <FormBuilder
          key={"lesson" + isShowPopUp}
          id={"lessons"}
          data={data}
          onSubmit={(values) => {
            //handleLesssonData(values);
            handleFormSubmit({
              values: values,
              method: "POST",
              apiPath: "/api/lessons",
              callback: (res: Response) => handleFormResponse(res),
            });
          }}
          isSubmitting={isSubmitting}
          resError={resError}
          submitBtnProps={{
            text: "Kaydet",
            type: "submit",
          }}
        />
      </Popup>

      <Popup
        key="lessonExercisepopup"
        show={isShowLessonPopUp}
        onClose={() => setIsShowExercisePopUp(false)}
        title={`${selectedlesson?.title}`}
        bodyClass="flex flex-col gap-3 py-6 px-8 max-w-[500px]"
        overlayClass="z-[51]"
      >
        <div className="text-left w-[80%] mx-auto">
          <ol className="list-decimal">
            {selectedlesson?.Exercise?.map((item: any, idx: number) => (
              <li key={item.id} className="hover:text-blue-500">
                <Link target="_blank" href={item.pathName}>
                  {item.title}
                </Link>
              </li>
            ))}
          </ol>
        </div>
      </Popup>
    </div>
  );
}
