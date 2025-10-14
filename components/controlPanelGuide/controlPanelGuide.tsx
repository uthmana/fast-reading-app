"use client";

import { MdInfo, MdPauseCircle, MdPlayCircle } from "react-icons/md";

export default function ControlPanelGuide({ showOptionSelect = false }) {
  return (
    <div className="p-6 text-gray-800 lg:max-w-[90%] max-w-full !text-lg mx-auto">
      <div className="flex items-center gap-2 mb-4">
        <MdInfo className="text-blue-600 w-6 h-6" />
        <h2 className="text-xl font-semibold">
          Kontrol Paneli Nasıl Kullanılır
        </h2>
      </div>

      <ul className="ml-5 space-y-3 text-sm leading-relaxed">
        {showOptionSelect ? (
          <li>
            <strong>Metin Seçin:</strong> Açılır menüden okumak veya üzerinde
            çalışmak istediğiniz metni seçin.
          </li>
        ) : null}

        <li>
          <strong>Hız Ayarı:</strong> 1’den 5’e kadar olan hız düğmelerinden
          birine tıklayarak okuma hızını belirleyin.
          <ul className="list-disc ml-6 mt-1 text-gray-600">
            <li>1 = En yavaş hız</li>
            <li>5 = En hızlı hız</li>
          </ul>
        </li>

        <li className="flex  gap-2">
          <MdPlayCircle className="w-7 h-7 text-blue-600" />
          <span>
            <strong>Egzersizi Başlatın:</strong> <b>Oynat (Play)</b> düğmesine
            tıklayarak egzersizi başlatın. Bu işlem, seçtiğiniz metni tam ekran
            beyaz tahtada görüntüler.
          </span>
        </li>

        <li className="flex  gap-2">
          <MdPauseCircle className="w-8 h-8 text-blue-600" />
          <span>
            <strong>Durdurun veya Devam Ettirin:</strong> Tam ekran modundayken{" "}
            <b>Durdur (Pause)</b> düğmesine basarak egzersizi durdurabilir ve
            kontrol paneline geri dönebilirsiniz.
          </span>
        </li>
      </ul>
    </div>
  );
}
