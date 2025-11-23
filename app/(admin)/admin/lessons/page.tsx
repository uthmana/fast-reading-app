"use client";

import TableBuilder from "@/components/admin/tableBuilder";
import FormBuilder from "@/components/formBuilder";
import Popup from "@/components/popup/popup";
import { fetchData } from "@/utils/fetchData";
import { useFormHandler } from "@/utils/hooks";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  DragStartEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import SortableItem from "@/components/admin/sortableItem/sortableItem";
import Button from "@/components/button/button";
import dynamic from "next/dynamic";

const DndContextWithNoSSR = dynamic(
  () => import("@dnd-kit/core").then((mod) => mod.DndContext),
  { ssr: false }
);

export default function page() {
  const [isLoading, setIsloading] = useState(false);
  const [lessons, setLessons] = useState([] as any);
  const [isShowPopUp, setIsShowPopUp] = useState(false);
  const { isSubmitting, resError, handleFormSubmit } = useFormHandler();
  const [data, setData] = useState({} as any);
  const [isShowLessonPopUp, setIsShowExercisePopUp] = useState(false);
  const [selectedlesson, setSelectedLesson] = useState({} as any);
  const [items, setItems] = useState([] as any);
  const [activeItem, setActiveItem] = useState<any | undefined>(undefined);

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
      setItems(currentLesson?.Exercise);
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

  const handleDragCancel = () => {
    setActiveItem(undefined);
  };

  //TODO: make the list items dragable and reorder
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setActiveItem(items?.find((item: any) => item.sequence === active.id));
  };

  function handleDragEnd(event: any) {
    const { active, over } = event;

    if (!over) return;

    const activeItem = items.find((ex: any) => ex.id === active.id);
    const overItem = items.find((ex: any) => ex.id === over.id);

    if (!activeItem || !overItem) {
      return;
    }

    const activeIndex = items.findIndex((ex: any) => ex.id === active.id);
    const overIndex = items.findIndex((ex: any) => ex.id === over.id);

    if (activeIndex !== overIndex) {
      setItems((prev: any) => {
        const updated = arrayMove(prev, activeIndex, overIndex).map(
          (ex: any, i: number) => ({ ...ex, id: i + 1 })
        );

        return updated;
      });
    }
    setActiveItem(undefined);
  }

  const handleSortable = () => {
    //TODO: Save changes to DB
    //console.log(items, selectedlesson);
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
          <ol className="list-decimal space-y-1">
            <DndContextWithNoSSR
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              onDragCancel={handleDragCancel}
            >
              <SortableContext
                items={items?.map((item: any) => item.id)}
                strategy={verticalListSortingStrategy}
              >
                {items?.map((item: any) => (
                  <SortableItem
                    key={item.id}
                    className="hover:text-blue-500"
                    item={item}
                  />
                ))}
              </SortableContext>
              <DragOverlay
                adjustScale
                style={{
                  transformOrigin: "0 0",
                }}
              >
                {activeItem ? (
                  <SortableItem item={activeItem} forceDragging={true} />
                ) : null}
              </DragOverlay>
            </DndContextWithNoSSR>
          </ol>
          <Button className="mt-3" text="KAYDET" onClick={handleSortable} />
        </div>
      </Popup>
    </div>
  );
}
