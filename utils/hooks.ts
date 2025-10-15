"use client";

import { FormEvent, useState } from "react";

export const useFormHandler = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resError, setResError] = useState("" as any);
  const [response, setResponse] = useState({} as Response);

  const handleFormSubmit = async ({
    values,
    apiPath,
    method,
    callback,
  }: {
    values: { isValid: boolean; formData: any; event: FormEvent };
    apiPath: string;
    method: string;
    callback: any;
  }) => {
    const { isValid, formData, event } = values;
    event.preventDefault();
    setResError("");
    if (!isValid) {
      setResError("invalid form");
      return;
    }

    console.log("formData", formData);
    try {
      setIsSubmitting(true);
      const res = await fetch(apiPath, {
        method: method || "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const restData = await res.json();

      if (res.ok) {
        setResponse(restData);
        if (callback) callback({ ...restData, ok: res.ok });
        setIsSubmitting(false);
      }

      if (restData?.error) {
        setIsSubmitting(false);
        setResError(restData?.error);
        console.error(restData);
      }
    } catch (error) {
      setIsSubmitting(false);
      setResError(error);
      console.error(error);
      return;
    }
  };

  return { isSubmitting, resError, response, handleFormSubmit };
};

export const useDrage = () => {
  const [isDown, setIsDown] = useState(false);
  const [startX, setStartX] = useState<number | null>(null);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDown(true);
    setStartX(e.pageX - e.currentTarget.offsetLeft);
    setScrollLeft(e.currentTarget.scrollLeft);
    e.currentTarget.classList.add("dragging-active");
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDown(false);
    e.currentTarget.classList.remove("dragging-active");
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDown(false);
    e.currentTarget.classList.remove("dragging-active");
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDown || startX === null) return;
    e.preventDefault();
    const x = e.pageX - e.currentTarget.offsetLeft;
    const walk = (x - startX) * 3; // scroll speed factor
    e.currentTarget.scrollLeft = scrollLeft - walk;
  };

  return {
    handleMouseDown,
    handleMouseLeave,
    handleMouseUp,
    handleMouseMove,
  };
};
