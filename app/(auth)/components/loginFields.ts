export const loginFields = [
  {
    key: "name",
    name: "Kullanıcı Adı / E-posta / TC Kimlik No",
    placeholder: "",
    type: "text",
    value: { key: "name", type: "string", value: "" },
    required: true,
  },
  {
    key: "password",
    name: "Parola",
    placeholder: "",
    type: "password",
    value: { key: "password", type: "string", value: "" },
    required: true,
    maxlength: 40,
  },
];
