"use client";

import TableBuilder from "@/components/admin/tableBuilder";
import FormBuilder from "@/components/formBuilder";
import Popup from "@/components/popup/popup";
import { fetchData } from "@/utils/fetchData";
import { useFormHandler } from "@/utils/hooks";
import React, { useEffect, useState } from "react";
import {
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragOverlay,
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
  const [isSorting, setIsSorting] = useState(false);
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
      const formattedLessonExercise = currentLesson?.LessonExercise?.map(
        ({ exercise, ...rest }: any) => {
          return { ...rest, title: exercise.title };
        }
      );
      setItems(formattedLessonExercise);
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
    const { isValid, event, formData } = values;

    const formattedExercise = formData?.Exercise.map((item: string) =>
      parseInt(item)
    );
    const nwFormData = {
      isValid,
      event,
      formData: { ...formData, Exercise: formattedExercise },
    };
    handleFormSubmit({
      values: nwFormData,
      method: "POST",
      apiPath: "/api/lessons",
      callback: (res: Response) => handleFormResponse(res),
    });
  };

  const handleDragCancel = () => {
    setActiveItem(undefined);
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const removeItem = (id: number) => {
    const updated = [...items]
      .filter((item: any) => item.id !== id)
      .map((item: any, i: number) => ({ ...item, order: i + 1 }));

    setItems(updated);
  };

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setActiveItem(items?.find((item: any) => item.order === active.id));
  };

  function handleDragEnd(event: any) {
    const { active, over } = event;

    if (!over) return;

    const activeItem = items.find((ex: any) => ex.order === active.id);
    const overItem = items.find((ex: any) => ex.order === over.id);

    if (!activeItem || !overItem) {
      return;
    }

    const activeIndex = items.findIndex((ex: any) => ex.order === active.id);
    const overIndex = items.findIndex((ex: any) => ex.order === over.id);

    if (activeIndex !== overIndex) {
      setItems((prev: any) => {
        const updated = arrayMove(prev, activeIndex, overIndex).map(
          (ex: any, i: number) => ({ ...ex, order: i + 1 })
        );

        return updated;
      });
    }
    setActiveItem(undefined);
  }

  const handleSortable = async () => {
    const { id, title, order } = selectedlesson;
    const payload = {
      id: id,
      order: order,
      title: title,
      Exercise:
        items.map((item: { exerciseId: number }) => item.exerciseId) ?? [],
    };
    try {
      setIsSorting(true);
      const resData = await fetchData({
        apiPath: "/api/lessons",
        method: "POST",
        payload,
      });

      requestData();
      setIsSorting(false);
      //setIsShowExercisePopUp(false);
    } catch (error) {
      console.error(error);
      setIsSorting(false);
    }
  };

  return (
    <div className="w-full">
      <TableBuilder
        key={isLoading}
        tableData={lessons}
        columnKey="lessonColumn"
        onAction={handleAction}
        onAdd={handleAction}
        isLoading={isLoading}
      />

      <Popup
        key="lessonpopup"
        show={isShowPopUp}
        onClose={() => setIsShowPopUp(false)}
        title="Ders Ekle"
        bodyClass="flex flex-col gap-3 pb-6 pt-0 !max-w-[700px] !w-[90%] max-h-[80%]"
        overlayClass="z-10"
        titleClass="border-b-2 border-blue-400 pt-6 pb-2 px-8 bg-[#f5f5f5]"
      >
        <FormBuilder
          key={"lesson" + isShowPopUp}
          className="px-8 overflow-y-auto"
          id={"lessons"}
          data={data}
          onSubmit={(values) => {
            handleLesssonData(values);
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
        key={activeItem}
        show={isShowLessonPopUp}
        onClose={() => setIsShowExercisePopUp(false)}
        title={`${selectedlesson?.title}`}
        bodyClass="flex flex-col gap-3 pb-6 pt-0 !max-w-[700px] !w-[90%] max-h-[80%]"
        overlayClass="z-10"
        titleClass="border-b-2 border-blue-400 pt-6 pb-2 px-8 bg-[#f5f5f5]"
      >
        <div className="text-left w-full px-8 overflow-y-auto mx-auto">
          {items?.length ? (
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
                <ul className="list-decimal px-3 lg:px-5 mx-auto space-y-1">
                  {items?.map((item: any) => (
                    <SortableItem
                      key={item.id}
                      className="hover:text-blue-500"
                      item={item}
                      removeItem={removeItem}
                    />
                  ))}
                </ul>
              </SortableContext>
              <DragOverlay
                adjustScale
                style={{ transformOrigin: "0 0 ", backgroundColor: "white" }}
              >
                {activeItem ? (
                  <SortableItem
                    item={activeItem}
                    removeItem={removeItem}
                    forceDragging={true}
                  />
                ) : null}
              </DragOverlay>
            </DndContextWithNoSSR>
          ) : null}

          <Button
            isSubmiting={isSorting}
            disabled={isSorting}
            className="mt-3"
            text="KAYDET"
            onClick={handleSortable}
          />
        </div>
      </Popup>
    </div>
  );
}
