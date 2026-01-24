"use client";

import StudentResult from "@/components/admin/studentResult/studentResult";
import TableBuilder from "@/components/admin/tableBuilder";
import FormBuilder from "@/components/formBuilder";
import Icon from "@/components/icon/icon";
import Popup from "@/components/popup/popup";
import { fetchData } from "@/utils/fetchData";
import { formatDateTime } from "@/utils/helpers";
import { useFormHandler } from "@/utils/hooks";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useAuthHandler } from "../../authHandler/authOptions";

export default function StudentPageContent() {
  const searchParams = useSearchParams();
  const classId = searchParams.get("classId");
  const regno = searchParams.get("regno");
  const editmodel = searchParams.get("editmodel");
  const [isLoading, setIsloading] = useState(false);
  const [students, setStudents] = useState([] as any);
  const [studentsRaw, setStudentsRaw] = useState([] as any);
  const [isShowPopUp, setIsShowPopUp] = useState(false);
  const [isShowStudyResultPopUp, setIsShowStudyResultPopUp] = useState(false);
  const [studentResult, setStudentResult] = useState({} as any);
  const [loadingResult, setLoadingResult] = useState(false);
  const { loading, canView, canCreate, canEdit, canDelete, userData } =
    useAuthHandler();
  const { isSubmitting, resError, handleFormSubmit } = useFormHandler();
  const [data, setData] = useState({
    role: "STUDENT",
    active: true,
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
            apiPath: `/api/students?where=${query}&progresspercent=true`,
          });
        } else {
          resData = await fetchData({
            apiPath: `/api/students?progresspercent=true`,
          });
        }

        setStudentsRaw(resData);
        if (classId && !editmodel) {
          resData = [...resData].filter((item) => {
            return item.classId === parseInt(classId);
          });
        }

        if (editmodel && classId) {
          setData({ classId, subscriberId: userData.subscriberId });
          setIsShowPopUp(true);
        }

        if (regno) {
          const resData = await fetchData({
            apiPath: `/api/registration?id=${regno}`,
          });

          setData({
            name: resData.name,
            email: resData.email,
            studyGroup: resData.studyGroup,
            regno,
          });
          setIsShowPopUp(true);
        }

        const allData = resData.map((dVal: any) => {
          const { user, ...rest } = dVal;
          const { id, ...userRest } = user;
          return {
            ...userRest,
            id: rest.id,
            name: `
            <span style="display:flex; width:100%; gap:12px; align-items:center">
               <span style="display:flex; align-items:center;justify-content:center; background:lightGray; padding: 6px;border-radius:100%">
                     <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="#FFFFFF">
                <path d="M12 12a5 5 0 100-10 5 5 0 000 10zm6 2H6a6 6 0 00-6 6v1h24v-1a6 6 0 00-6-6z"/>
              </svg>
             </span>
              <span>
             <span style="display:block; font-size:14px; text-transform:capitalize;margin-bottom: 4px"> ${userRest.name} </span>
             <span style="display:flex;align-items:center; gap:4px">
             <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="lightGray">
                <path d="M12 12a5 5 0 100-10 5 5 0 000 10zm6 2H6a6 6 0 00-6 6v1h24v-1a6 6 0 00-6-6z"/>
              </svg>
             ${userRest.username}</span>
             <span style="display:flex;align-items:center; gap:4px"> 
              <svg xmlns="http://www.w3.org/2000/svg"  width="12" height="12" viewBox="0 0 24 24"  fill="lightGray">
                <path d="M17 8V7a5 5 0 0 0-10 0v1H5v14h14V8h-2Zm-8-1a3 3 0 0 1 6 0v1H9V7Zm3 6a2 2 0 1 1-2 2 2 2 0 0 1 2-2Z"/>
              </svg>
             ${userRest.password}</span>
            </span>
            </span> `,
            studyGroup: rest.studyGroup,
            startDate: rest.startDate,
            endDate: rest.endDate,
            studentId: rest.id,
            class: rest.class.name,
            active: userRest.active,
            progress: `% ${rest.progressPercent}`,
            subscriberId: rest.subscriberId,
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
  }, [loading, userData, classId, editmodel, regno]);

  const handleAction = async (actionType: string, info: any) => {
    const currentUser = info?.row?.original;
    if (actionType === "add") {
      setData({ subscriberId: userData && userData.subscriberId });
      setIsShowPopUp(true);
    }
    if (actionType === "edit") {
      const tempData = [...studentsRaw].find(
        (item) => item.id === currentUser.id,
      );
      const { user, Progress, ...rest } = tempData;
      const { id, ...restUser } = user;
      setData({
        ...restUser,
        ...rest,
        startDate: currentUser.startDate?.split("T")[0],
        endDate: currentUser.endDate?.split("T")[0],
        active: restUser.active,
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
              [...students].filter((val: any) => val.id !== currentUser.id),
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
        (item) => item.id === currentUser.id,
      );

      const attempts = tempData?.attempts || [];
      const formatted = attempts?.map(
        ({ wpm, wpf, createdAt, correct, variant }: any) => ({
          wpm,
          wpf,
          correct,
          variant,
          category: formatDateTime(createdAt),
        }),
      );
      const buildData = (
        key: "wpm" | "correct" | "wpc" | "wpf",
        variant: string,
      ) => {
        const filtered = formatted.filter((i: any) => i.variant === variant);
        return {
          data: filtered.map((i: any) => i[key]),
          categories: filtered.map((i: any) => i.category),
        };
      };

      try {
        const fastReadingData = buildData("wpm", "FASTREADING");
        const fastVisionData = buildData("wpf", "FASTVISION");
        const resData = await fetchData({
          apiPath: `/api/progressSummary?studentId=${currentUser.id}`,
        });

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
      {canView ? (
        <TableBuilder
          isLoading={isLoading || loading}
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
          showAddButton={canCreate}
          showEditRow={canEdit}
          showDeleteRow={canDelete}
        />
      ) : null}
      {canCreate ? (
        <Popup
          show={isShowPopUp}
          onClose={() => setIsShowPopUp(false)}
          title="Öğrenci Ekle"
          bodyClass="flex flex-col gap-3 pb-6 pt-0 !max-w-[700px] !w-[90%] max-h-[80%]"
          overlayClass="z-10"
          titleClass="border-b-2 border-blue-400 pt-6 pb-2 px-8 bg-[#f5f5f5]"
        >
          <FormBuilder
            id={userData?.role !== "ADMIN" ? "student" : "registerStudent"}
            className="px-8 overflow-y-auto"
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
      ) : null}

      <Popup
        show={isShowStudyResultPopUp}
        onClose={() => setIsShowStudyResultPopUp(false)}
        title={studentResult?.name}
        bodyClass="flex flex-col gap-3 pb-6 pt-0 !max-w-[90%] !w-[90%] max-h-[80%]"
        overlayClass="z-10"
        titleClass="border-b-2 border-blue-400 pt-6 pb-2 px-8 bg-[#f5f5f5]"
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
