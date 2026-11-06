import type { Metadata } from "next";
import { headers } from "next/headers";
import { parseCertificateSerial, verifyStudent } from "./helpers";
import CertificateView from "./components/certificateView/CertificateView";
import NotFound from "./components/notFound/NotFound";
import "./style.css";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ serial?: string }>;
}): Promise<Metadata> {
  const { serial } = await searchParams;
  const { decodedSerial, studentId, isValid } = parseCertificateSerial(serial);

  if (!isValid) return { title: "Sertifika bulunamadı" };
  const { cert } = await verifyStudent(studentId, decodedSerial);
  if (!cert) return { title: "Sertifika bulunamadı" };
  return { title: `${cert.holderName} · ${cert.program} Sertifikası` };
}

export default async function CertificatePage({
  searchParams,
}: {
  searchParams: Promise<{ serial?: string }>;
}) {
  const { serial } = await searchParams;
  const { decodedSerial, studentId, isValid } = parseCertificateSerial(serial);

  if (!isValid) return <NotFound />;
  const { isVerified, cert } = await verifyStudent(studentId, decodedSerial);
  if (!isVerified) return <NotFound />;

  // const cert = {
  //   serial: "HB-202610-000001",
  //   holderName: "Deneme Kullanıcı",
  //   program: "Test Program",
  //   completionDate: "2026-10-26T11:59:50.674Z",
  //   heading: "Başlık",
  //   description: ";Açıklama",
  // };

  // The QR encodes the absolute URL of this very page, so scanning verifies it.
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
  const proto =
    h.get("x-forwarded-proto") ??
    (host.startsWith("localhost") ? "http" : "https");
  const base = process.env.NEXT_PUBLIC_BASE_PATH ?? `${proto}://${host}`;
  const verifyUrl = `${base}sertifika/${cert?.serial ? encodeURIComponent(cert.serial) : ""}`;

  return <CertificateView cert={cert as any} verifyUrl={verifyUrl} />;
}
