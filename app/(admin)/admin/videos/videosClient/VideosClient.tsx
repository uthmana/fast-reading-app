"use client";

import { useState, useTransition } from "react";
import Icon from "@/components/icons/icon";
import { updateMenuVideo } from "./actions";
import { AuthDataTypes } from "@/components/admin/model/admin";

type VideoItem = {
  id: string;
  name: string;
  description: string | null;
  icon: string | null;
  youtubeId: string | null;
};

type Props = {
  videoItems: VideoItem[];
  authData: AuthDataTypes;
};

export default function VideosClient({ videoItems, authData }: Props) {
  const [items, setItems] = useState(videoItems);
  const [editingItem, setEditingItem] = useState<VideoItem | null>(null);
  const [youtubeId, setYoutubeId] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();
  const { canEdit } = authData;

  const handleEdit = (item: VideoItem) => {
    setEditingItem(item);
    setYoutubeId(item.youtubeId ?? "");
    setDescription(item.description ?? "");
    setError("");
  };

  const handleSave = () => {
    if (!editingItem) return;

    setError("");

    startTransition(async () => {
      const result = await updateMenuVideo({
        id: editingItem.id,
        youtubeId,
        description,
      });

      if (!result.success) {
        setError(result.message);
        return;
      }

      setItems((prev) =>
        prev.map((item) =>
          item.id === editingItem.id
            ? {
                ...item,
                youtubeId: youtubeId.trim(),
                description: description.trim(),
              }
            : item,
        ),
      );

      setEditingItem(null);
    });
  };

  return (
    <>
      <div className="flex flex-wrap gap-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="w-full md:w-[calc(50%-12px)] group max-h-fit shadow rounded border bg-white"
          >
            <div className="relative w-full aspect-video">
              {item.youtubeId ? (
                <iframe
                  key={item.youtubeId}
                  className="w-full h-full"
                  src={`https://www.youtube.com/embed/${item.youtubeId}`}
                  title={item.name}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-500">
                  Video bulunamadı
                </div>
              )}

              {canEdit ? (
                <button
                  type="button"
                  onClick={() => handleEdit(item)}
                  title="Videoyu düzenle"
                  className="absolute top-3 right-3 p-2 rounded-md bg-blue-100 shadow hover:bg-gray-100 transition"
                >
                  <Icon name="edit" className="w-5 h-5" fill="blue-500" />
                </button>
              ) : null}
            </div>

            <div className="px-3 flex items-start py-5 gap-2">
              <div className="flex justify-center items-center p-1">
                <Icon
                  name={`${item.icon as "menu"}`}
                  className="w-6 h-6 transition group-hover:scale-110"
                  fill="black"
                />
              </div>

              <div>
                <h2 className="text-xl font-semibold">{item.name}</h2>

                <p
                  title={item.description ?? ""}
                  className="text-gray-600 text-base line-clamp-4 mt-1"
                >
                  {item.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {editingItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget && !isPending) {
              setEditingItem(null);
            }
          }}
        >
          <div className="w-full max-w-lg rounded-lg bg-white shadow-xl">
            <div className="flex items-center justify-between border-b px-5 py-4">
              <h2 className="text-lg font-semibold">Videoyu Düzenle</h2>

              <button
                type="button"
                onClick={() => setEditingItem(null)}
                disabled={isPending}
                className="text-gray-500 hover:text-black text-xl"
              >
                &times;
              </button>
            </div>

            <div className="space-y-4 p-5">
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Menü Adı
                </label>
                <input
                  type="text"
                  value={editingItem.name}
                  disabled
                  className="w-full rounded-md border bg-gray-100 px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  YouTube Video ID
                </label>
                <input
                  type="text"
                  value={youtubeId}
                  onChange={(e) => setYoutubeId(e.target.value)}
                  placeholder="Örn: xiTK523Ot5U"
                  className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Açıklama
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={5}
                  placeholder="Video açıklaması..."
                  className="w-full resize-y rounded-md border px-3 py-2 text-sm outline-none focus:border-blue-500"
                />
              </div>

              {error && <p className="text-sm text-red-600">{error}</p>}
            </div>

            <div className="flex justify-end gap-2 border-t px-5 py-4">
              <button
                type="button"
                onClick={() => setEditingItem(null)}
                disabled={isPending}
                className="rounded-md border px-4 py-2 text-sm hover:bg-gray-50 disabled:opacity-50"
              >
                İptal
              </button>

              <button
                type="button"
                onClick={handleSave}
                disabled={isPending}
                className="rounded-md bg-blue-500 px-5 py-2 text-sm text-white hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isPending ? "Kaydediliyor..." : "Kaydet"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
