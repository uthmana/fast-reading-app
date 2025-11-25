"use client";

import StudentResult from "@/components/admin/studentResult/studentResult";
import TableBuilder from "@/components/admin/tableBuilder";
import FormBuilder from "@/components/formBuilder";
import Icon from "@/components/icon/icon";
import Popup from "@/components/popup/popup";
import { studyGroupOptions } from "@/utils/constants";
import { fetchData } from "@/utils/fetchData";
import { formatDateTime } from "@/utils/helpers";
import { useFormHandler } from "@/utils/hooks";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function page() {
  const searchParams = useSearchParams();
  const classId = searchParams.get("classId");
  const editmodel = searchParams.get("editmodel");
  const [isLoading, setIsloading] = useState(false);
  const [students, setStudents] = useState([] as any);
  const [studentsRaw, setStudentsRaw] = useState([] as any);
  const [isShowPopUp, setIsShowPopUp] = useState(false);
  const [isShowStudyResultPopUp, setIsShowStudyResultPopUp] = useState(false);
  const [studentResult, setStudentResult] = useState({} as any);
  const [loadingResult, setLoadingResult] = useState(false);

  const { isSubmitting, resError, handleFormSubmit } = useFormHandler();
  const [data, setData] = useState({
    role: "STUDENT",
    active: true,
  } as any);

  useEffect(() => {
    const requestData = async () => {
      try {
        setIsloading(true);
        let resData = await fetchData({ apiPath: "/api/students" });
        setStudentsRaw(resData);
        if (classId && !editmodel) {
          resData = [...resData].filter((item) => {
            return item.classId === parseInt(classId);
          });
        }
        const allData = resData.map((dVal: any) => {
          const { user, ...rest } = dVal;
          const { id, ...userRest } = user;
          return {
            ...userRest,
            id: rest.id,
            name: `
             <span style="display:block"> 
              ${userRest.name} </span>
             <span style="display:flex; gap:4px">
             <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 12a5 5 0 100-10 5 5 0 000 10zm6 2H6a6 6 0 00-6 6v1h24v-1a6 6 0 00-6-6z"/>
              </svg>
             ${userRest.username}</span>
             <span style="display:flex; gap:4px"> 
              <svg xmlns="http://www.w3.org/2000/svg"  width="14" height="14" viewBox="0 0 24 24"  fill="currentColor">
                <path d="M17 8V7a5 5 0 0 0-10 0v1H5v14h14V8h-2Zm-8-1a3 3 0 0 1 6 0v1H9V7Zm3 6a2 2 0 1 1-2 2 2 2 0 0 1 2-2Z"/>
              </svg>
             ${userRest.password}</span>
            `,
            studyGroup: studyGroupOptions.find(
              (item) => item.value === rest.studyGroup
            )?.name,
            startDate: rest.startDate,
            endDate: rest.endDate,
            studentId: rest.id,
            class: rest.class.name,
            progress: `% ${
              (rest.Progress?.find((item: any) => item.done)?.length /
                rest.Progress?.length) *
                100 || 0
            }`,
          };
        });
        setStudents(allData);

        setIsloading(false);
      } catch (error) {
        setIsloading(false);
        console.error(error);
        return;
      }
    };

    requestData();
    if (editmodel && classId) {
      setData({ classId });
      setIsShowPopUp(true);
    }
  }, [classId, editmodel]);

  const handleAction = async (actionType: string, info: any) => {
    const currentUser = info?.row?.original;
    if (actionType === "add") {
      setData({});
      setIsShowPopUp(true);
    }
    if (actionType === "edit") {
      const tempData = [...studentsRaw].find(
        (item) => item.id === currentUser.id
      );
      const { user, Progress, ...rest } = tempData;
      const { id, ...restUser } = user;
      setData({
        ...restUser,
        ...rest,
        startDate: currentUser.startDate?.split("T")[0],
        endDate: currentUser.endDate?.split("T")[0],
      });
      setIsShowPopUp(true);
    }
    if (actionType === "delete") {
      if (confirm("Silmek istediğini emin misin ?")) {
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
    }

    if (actionType === "showStudyResult") {
      setLoadingResult(true);
      setIsShowStudyResultPopUp(true);
      const tempData = [...studentsRaw].find(
        (item) => item.id === currentUser.id
      );

      const attempts = tempData?.attempts || [];
      const formatted = attempts?.map(
        ({ wpm, createdAt, correct, variant }: any) => ({
          wpm,
          correct,
          variant,
          category: formatDateTime(createdAt),
        })
      );
      const buildData = (key: "wpm" | "correct" | "wpc", variant: string) => {
        const filtered = formatted.filter((i: any) => i.variant === variant);
        return {
          data: filtered.map((i: any) => i[key]),
          categories: filtered.map((i: any) => i.category),
        };
      };

      try {
        const fastReadingData = buildData("wpm", "FASTREADING");
        const fastVisionData = buildData("correct", "FASTVISION");
        const resData = await fetchData({ apiPath: "/api/progressSummary" });
        const fastUnderstanding = resData?.fastUnderstandingProgress;
        const lessons = resData?.lessons;

        setStudentResult({
          id: tempData.id,
          name: tempData.user.name,
          fastReadingData,
          fastVisionData,
          fastUnderstanding,
          lessons,
        });
        setLoadingResult(false);
        setIsShowStudyResultPopUp(true);
      } catch (error) {}
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
        additionalActions={[
          {
            action: "showStudyResult",
            actionName: "Eğitim Sonuçları",
            icon: "book",
          },
        ]}
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

      <Popup
        show={isShowStudyResultPopUp}
        onClose={() => setIsShowStudyResultPopUp(false)}
        title={studentResult?.name}
        bodyClass="flex flex-col gap-3 py-6 px-8 !max-w-[90%] !w-[90%] max-h-[80%]"
        overlayClass="z-10"
      >
        {loadingResult ? (
          <div className="w-full min-h-[400px] flex justify-center items-center">
            <Icon name="loading" className="w-10 h-10 text-blue-700" />
          </div>
        ) : (
          <StudentResult key={studentResult.id} data={studentResult} />
        )}
      </Popup>
    </div>
  );
}
