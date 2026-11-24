import { studyGroupOptions } from "@/app/(ogrenci)/ogrenci/(utils)/constants/constants";

export const registerFields = [
  {
    key: "name",
    name: "Ad Soyad",
    placeholder: "Ad Soyad",
    type: "text",
    value: { key: "name", type: "string", value: "" },
    required: true,
    maxlength: 50,
  },
  {
    key: "email",
    name: "E-Posta",
    placeholder: "example@mail.com",
    type: "email",
    value: { key: "email", type: "string", value: "" },
    required: true,
    maxlength: 100,
  },
  {
    key: "phone",
    name: "Telefon numaranız",
    placeholder: "",
    type: "tel",
    value: { key: "phone", type: "string", value: "" },
    required: true,
    maxlength: 17,
  },
  {
    key: "studyGroup",
    name: "Eğitim Grubunuz",
    placeholder: "Seçiniz",
    type: "select",
    options: studyGroupOptions,
    value: { key: "studyGroup", type: "string", value: "" },
    required: true,
  },

  {
    key: "message",
    name: "Açıklama",
    placeholder: "",
    type: "textarea",
    value: { key: "message", type: "string", value: "" },
    required: false,
    rows: 3,
  },
];
