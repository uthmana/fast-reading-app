"use client";

import TableBuilder from "@/components/admin/tableBuilder";
import Button from "@/components/button/button";
import FormBuilder from "@/components/formBuilder";
import Popup from "@/components/popup/popup";
import { fetchData } from "@/utils/fetchData";
import { useFormHandler } from "@/utils/hooks";
import React, { useEffect, useState } from "react";
import { MdModeEdit, MdOutlineDelete } from "react-icons/md";
import { useAuthHandler } from "../authHandler/authOptions";

export default function page() {
  const [isLoading, setIsloading] = useState(false);
  const [articles, setArticles] = useState([] as any);
  const [isShowPopUp, setIsShowPopUp] = useState(false);
  const { isSubmitting, resError, handleFormSubmit } = useFormHandler();
  const [data, setData] = useState({} as any);
  const { canView, canCreate, canEdit, canDelete, loading, userData } =
    useAuthHandler();

  const defaultQuizValue = {
    id: Date.now().toString(),
    question: "",
    answer: "",
    optionsA: "",
    optionsB: "",
    optionsC: "",
    optionsD: "",
  };

  const [quiz, setQuiz] = useState([] as any);
  const [isShowQuizPopUp, setIsShowQuizPopUp] = useState(false);
  const [isQuizSubmitting, setIsQuizSubmitting] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState({} as any);
  const [quizFormData, setQuizFormData] = useState(defaultQuizValue as any);
  const [formTouched, setFormTouched] = useState(false);

  const requestData = async () => {
    if (loading || !userData) return;

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
          apiPath: `/api/articles?where=${query}`,
        });
      } else {
        resData = await fetchData({ apiPath: "/api/articles" });
      }

      setArticles(resData);
      setIsloading(false);
    } catch (error) {
      setIsloading(false);
      console.error(error);
      return;
    }
  };

  useEffect(() => {
    requestData();
  }, [loading, userData]);

  const handleAction = async (actionType: string, info: any) => {
    const currentArticle = info?.row?.original;
    setSelectedArticle(currentArticle);

    if (actionType === "add") {
      setData({
        subscriberId: userData?.subscriberId || "",
      });
      setIsShowPopUp(true);
    }
    if (actionType === "edit") {
      setData({
        ...currentArticle,
      });
      setIsShowPopUp(true);
    }
    if (actionType === "delete") {
      if (confirm("Silmek istediğini emin misin ?")) {
        try {
          setIsloading(true);
          await fetchData({
            apiPath: "/api/articles",
            method: "DELETE",
            payload: { id: currentArticle.id },
          });
          setArticles(
            [...articles].filter((val: any) => val.id !== currentArticle.id),
          );
          setIsloading(false);
        } catch (error) {
          setIsloading(false);
          console.error(error);
          return;
        }
      }
    }
    if (actionType === "quiz") {
      setQuiz(currentArticle?.tests);
      setIsShowQuizPopUp(true);
    }
  };

  const handleFormResponse = (response: Response) => {
    if (response.ok) {
      if (typeof window !== "undefined") {
        window.location.href = "/admin/articles";
      }
    }
  };

  const handleForm = (values: any) => {
    const { event, formData, isValid } = values;
    if (!isValid) return;
    event.preventDefault();
    const { id, question, answer, optionA, optionB, optionC, optionD } =
      formData;
    const mappedData = {
      id: id || Date.now().toString(),
      question,
      answer,
      options: [
        { id: "a", text: optionA },
        { id: "b", text: optionB },
        { id: "c", text: optionC },
        { id: "d", text: optionD },
      ],
    };
    setFormTouched(true);

    if (id) {
      const filteredQuiz = [...(quiz || [])].filter((q) => q.id !== id);
      filteredQuiz.push(mappedData);
      setQuiz(filteredQuiz);
      setQuizFormData(defaultQuizValue);

      return;
    }
    setQuiz([...(quiz || []), mappedData]);
    setQuizFormData(defaultQuizValue);
  };

  const deleteQuiz = (selectedQuiz: any) => {
    const filteredQuiz = [...(quiz || [])].filter(
      (q) => q.id !== selectedQuiz.id,
    );
    setQuiz(filteredQuiz);
    setFormTouched(true);
  };

  const editQuiz = (selectedQuiz: any) => {
    const { id, question, answer, options } = selectedQuiz;
    const mappedData = {
      id,
      question,
      answer,
      optionA: options[0]?.text,
      optionB: options[1]?.text,
      optionC: options[2]?.text,
      optionD: options[3]?.text || "Hepsi",
    };

    setQuizFormData(mappedData);
  };

  const saveQuiz = async () => {
    // Save changes to db
    try {
      setIsQuizSubmitting(true);
      const resData = await fetchData({
        apiPath: "/api/articles",
        method: "POST",
        payload: { ...selectedArticle, tests: quiz },
      });
      requestData();
      setFormTouched(false);
      setIsQuizSubmitting(false);
    } catch (error) {
      setFormTouched(false);
      setIsQuizSubmitting(false);
      console.error(error);
    }
  };

  return (
    <div className="w-full">
      {canView ? (
        <TableBuilder
          key={isLoading}
          tableData={articles}
          columnKey="articlesColumn"
          onAction={handleAction}
          onAdd={handleAction}
          isLoading={isLoading}
          showAddButton={canCreate}
          showEditRow={canEdit}
          showDeleteRow={canDelete}
        />
      ) : null}
      {canCreate ? (
        <>
          <Popup
            key="articlepopup"
            show={isShowPopUp}
            onClose={() => setIsShowPopUp(false)}
            title="Okuma Metin Ekle"
            bodyClass="flex flex-col gap-3 pb-6 pt-0 !max-w-[700px] !w-[90%] max-h-[80%]"
            overlayClass="z-10"
            titleClass="border-b-2 border-blue-400 pt-6 pb-2 px-8 bg-[#f5f5f5]"
          >
            <FormBuilder
              key={"article"}
              className="px-8"
              id={"article"}
              data={data}
              onSubmit={(values) => {
                handleFormSubmit({
                  values,
                  method: "POST",
                  apiPath: "/api/articles",
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
            key="quizpopup"
            show={isShowQuizPopUp}
            onClose={() => setIsShowQuizPopUp(false)}
            title={`${selectedArticle?.title} - TEST`}
            bodyClass="flex flex-col gap-3 pb-6 pt-0 !max-w-[700px] !w-[90%] max-h-[80%]"
            overlayClass="z-10"
            titleClass="border-b-2 border-blue-400 pt-6 pb-2 px-8 bg-[#f5f5f5]"
          >
            <div className="flex h-full px-8 gap-2 overflow-y-auto ">
              <div className="w-full flex flex-col justify-between">
                <div className="w-full pb-5 space-y-4 max-h-[480px] overflow-y-auto">
                  {quiz?.map((q: any, idx: number) => (
                    <div className="text-sm text-gray-800 text-left" key={idx}>
                      <p className="font-semibold relative pr-5">
                        {idx + 1}. {q.question}
                        <span className="absolute right-0 top-0 flex">
                          <Button
                            className="!p-0  !w-fit !bg-black/0"
                            text=""
                            icon={<MdModeEdit className="w-5 h-5 text-black" />}
                            onClick={() => editQuiz(q)}
                          />
                          <Button
                            onClick={() => deleteQuiz(q)}
                            className="!p-0 !w-fit !bg-black/0"
                            text=""
                            icon={
                              <MdOutlineDelete className="w-5 h-5 text-black" />
                            }
                          />
                        </span>
                      </p>

                      {q.options.map((option: any) => (
                        <div
                          key={option.id}
                          className={`flex items-center gap-3  py-1 hover: transition `}
                        >
                          <span
                            className={`capitalize h-4  border-gray-300  ${
                              q.answer === option.id
                                ? "text-blue-400 font-semibold"
                                : ""
                            }`}
                          >
                            {option.id}
                            {")"}
                          </span>

                          <span className="text-gray-700">{option.text}</span>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
                <Button
                  isSubmiting={isQuizSubmitting}
                  disabled={!formTouched}
                  className="bg-green-600"
                  text="Kaydet"
                  onClick={saveQuiz}
                />
              </div>

              <FormBuilder
                key={quizFormData.id || "new-quiz"}
                className="p-3 border max-w-[40%]"
                id={"quiz"}
                data={quizFormData}
                onSubmit={(values) => handleForm(values)}
                submitBtnProps={{
                  text: "Test Ekle",
                  type: "submit",
                }}
              />
            </div>
          </Popup>
        </>
      ) : null}
    </div>
  );
}
