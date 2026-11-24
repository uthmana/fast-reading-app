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
