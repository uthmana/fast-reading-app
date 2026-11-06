"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { toPng } from "html-to-image";
import { jsPDF } from "jspdf";
import { brand, Certificate, formatDate } from "../../helpers";

const W = 1123; // A4 landscape @ 96dpi
const H = 794;

/** Decorative gold line-wave ornament (deterministic, so SSR == client). */
function Waves({ className }: { className: string }) {
  const lines = Array.from({ length: 22 }, (_, i) => {
    const t = i / 21;
    const pts: string[] = [];
    for (let x = 0; x <= 330; x += 6) {
      const y =
        60 +
        i * 11 +
        Math.sin(x / 38 + t * 3.2) * (18 + t * 26) +
        Math.cos(x / 70 - t * 2) * 14 -
        (x / 330) * 40;
      pts.push(`${x === 0 ? "M" : "L"}${x} ${y.toFixed(1)}`);
    }
    return { d: pts.join(" "), o: 0.18 + (1 - Math.abs(t - 0.5) * 2) * 0.5 };
  });
  return (
    <svg className={`waves ${className}`} viewBox="0 0 330 330" aria-hidden>
      {lines.map((l, i) => (
        <path
          key={i}
          d={l.d}
          fill="none"
          stroke="#e3c35e"
          strokeWidth="1.2"
          opacity={l.o}
        />
      ))}
    </svg>
  );
}

export default function CertificateView({
  cert,
  verifyUrl,
}: {
  cert: Certificate | null;
  verifyUrl: string;
}) {
  const fitRef = useRef<HTMLDivElement>(null);
  const certRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [busy, setBusy] = useState<null | "pdf" | "png">(null);
  const [status, setStatus] = useState("");

  // Scale the fixed-size certificate to the available width.
  useEffect(() => {
    const el = fitRef.current;
    if (!el) return;
    const update = () => setScale(Math.min(1, el.clientWidth / W));
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const render = useCallback(async () => {
    if (!certRef.current) throw new Error("not ready");
    await document.fonts.ready;
    return toPng(certRef.current, {
      pixelRatio: 2.5,
      cacheBust: true,
      width: W,
      height: H,
    });
  }, []);

  const fileBase = `sertifika-${cert?.serial}`;

  const downloadPng = async () => {
    try {
      setBusy("png");
      setStatus("");
      const url = await render();
      const a = document.createElement("a");
      a.href = url;
      a.download = `${fileBase}.png`;
      a.click();
    } catch {
      setStatus("PNG oluşturulamadı. Lütfen tekrar deneyin.");
    } finally {
      setBusy(null);
    }
  };

  const downloadPdf = async () => {
    try {
      setBusy("pdf");
      setStatus("");
      const url = await render();
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "px",
        format: [W, H],
        compress: true,
      });
      pdf.addImage(url, "PNG", 0, 0, W, H);
      pdf.setProperties({
        title: `${cert?.holderName} - ${cert?.program}`,
        subject: cert?.serial,
      });
      pdf.save(`${fileBase}.pdf`);
    } catch {
      setStatus("PDF oluşturulamadı. Lütfen tekrar deneyin.");
    } finally {
      setBusy(null);
    }
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(verifyUrl);
      setStatus("Doğrulama bağlantısı kopyalandı.");
    } catch {
      setStatus(verifyUrl);
    }
  };

  return (
    <main className="page">
      <div className="verified">
        <span className="dot" /> Bu sertifika kayıtlarımızda doğrulandı ·{" "}
        {cert?.serial}
      </div>

      <div className="cert-fit" ref={fitRef} style={{ height: H * scale }}>
        <div className="cert-scaler" style={{ transform: `scale(${scale})` }}>
          <div
            className="cert"
            ref={certRef}
            style={{ ["--accent" as string]: brand.accent }}
          >
            <Waves className="tr" />
            <Waves className="bl" />

            <div className="brand">
              <div className="brand-name">{brand.name.toUpperCase()}</div>
              <div className="brand-tag">{brand.tagline}</div>
            </div>
            <div className="contact">
              <div>{brand.name}</div>
              <div>
                <div> {brand.website} </div>
                <div> {brand.phone}</div>
                <div> {brand.email}</div>
              </div>
            </div>

            <div className="title">SERTİFİKA</div>
            <div className="kicker">
              {(cert?.heading ?? "Başarı Sertifikası").toLocaleUpperCase(
                "tr-TR",
              )}
            </div>
            <div className="program">
              {cert?.program.toLocaleUpperCase("tr-TR")} EĞİTİMİ
            </div>
            <div className="holder">{cert?.holderName}</div>
            <div className="rule" />
            <p className="desc">{cert?.description}</p>

            <div className="sig l">
              <div>{brand.name}</div>
              <div className="line" />
              <div className="val">{brand.signerLabel}</div>
            </div>
            <div className="sig r">
              <div>Eğitim Bitiş Tarihi</div>
              <div className="line" />
              <div className="val">
                {cert?.completionDate ? formatDate(cert.completionDate) : ""}
              </div>
            </div>

            <div className="qr">
              <QRCodeSVG
                value={verifyUrl}
                size={150}
                level="M"
                marginSize={0}
                bgColor="#fffef8"
                fgColor="#000000"
              />
              <div className="serial">Seri No: {cert?.serial}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="toolbar">
        <button className="btn" onClick={downloadPdf} disabled={!!busy}>
          {busy === "pdf" ? "Hazırlanıyor…" : "PDF indir"}
        </button>
        <button className="btn" onClick={downloadPng} disabled={!!busy}>
          {busy === "png" ? "Hazırlanıyor…" : "PNG indir"}
        </button>
        <button className="btn ghost" onClick={() => window.print()}>
          Yazdır
        </button>
        <button className="btn ghost" onClick={copyLink}>
          Bağlantıyı kopyala
        </button>
      </div>
      <div className="status" role="status">
        {status}
      </div>
    </main>
  );
}
