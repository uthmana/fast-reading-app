import WordsClient from "./WordsClient";
import { getAuthHandlerServer } from "../authHandlerServer";
import { getWords } from "../dataRequest";

export const metadata = {
  title: "Kelimeler | Yönetim Paneli",
};

export default async function page() {
  const authData = await getAuthHandlerServer("words");

  const words = await getWords({
    role: authData.userData?.role ?? "",
    subscriberId: authData.userData?.subscriberId,
  });

  return <WordsClient words={words} authData={authData} />;
}
