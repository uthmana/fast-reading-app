import React from "react";

export default function CertificatePage({ params }: { params: any }) {
  return (
    <div className="w-full">
      Sertifika {params?.ogrenci} , {params?.grp}
    </div>
  );
}
