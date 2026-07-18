"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  saveClothAction,
  uploadClothImageAction,
} from "@/actions/admin";
import type { Cloth } from "@/lib/types";
import { getClothImageUrl } from "@/lib/images";
import Image from "next/image";

type Props = {
  cloth?: Cloth;
};

export function ClothForm({ cloth }: Props) {
  const router = useRouter();
  const [imageUrl, setImageUrl] = useState(cloth?.image_url ?? "");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [isUploading, startUpload] = useTransition();

  function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.set("file", file);

    startUpload(async () => {
      const result = await uploadClothImageAction(formData);
      if (result.success && result.url) {
        setImageUrl(result.url);
      } else {
        setError(result.error ?? "Upload failed");
      }
    });
  }

  function handleSubmit(formData: FormData) {
    if (imageUrl) formData.set("image_url", imageUrl);
    if (cloth) formData.set("active", formData.get("active") ? "true" : "false");

    startTransition(async () => {
      const result = await saveClothAction(formData, cloth?.id);
      if (result.success) {
        router.push("/admin/clothes");
        router.refresh();
      } else {
        setError(result.error ?? "Save failed");
      }
    });
  }

  return (
    <form action={handleSubmit} className="space-y-5">
      <div>
        <label className="text-xs font-medium uppercase tracking-wider text-muted">
          Name *
        </label>
        <input
          name="name"
          required
          defaultValue={cloth?.name}
          className="mt-1 w-full rounded-md border border-border px-3 py-2 text-sm outline-none"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="text-xs font-medium uppercase tracking-wider text-muted">
            Category
          </label>
          <input
            name="category"
            defaultValue={cloth?.category ?? ""}
            className="mt-1 w-full rounded-md border border-border px-3 py-2 text-sm outline-none"
          />
        </div>
        <div>
          <label className="text-xs font-medium uppercase tracking-wider text-muted">
            Festival
          </label>
          <input
            name="festival"
            defaultValue={cloth?.festival ?? ""}
            className="mt-1 w-full rounded-md border border-border px-3 py-2 text-sm outline-none"
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label className="text-xs font-medium uppercase tracking-wider text-muted">
            Size
          </label>
          <input
            name="size"
            defaultValue={cloth?.size ?? ""}
            className="mt-1 w-full rounded-md border border-border px-3 py-2 text-sm outline-none"
          />
        </div>
        <div>
          <label className="text-xs font-medium uppercase tracking-wider text-muted">
            Price (₹/day) *
          </label>
          <input
            name="price"
            type="number"
            required
            min="1"
            defaultValue={cloth?.price}
            className="mt-1 w-full rounded-md border border-border px-3 py-2 text-sm outline-none"
          />
        </div>
        <div>
          <label className="text-xs font-medium uppercase tracking-wider text-muted">
            Deposit (₹)
          </label>
          <input
            name="security_deposit"
            type="number"
            min="0"
            defaultValue={cloth?.security_deposit ?? 0}
            className="mt-1 w-full rounded-md border border-border px-3 py-2 text-sm outline-none"
          />
        </div>
      </div>

      <div>
        <label className="text-xs font-medium uppercase tracking-wider text-muted">
          Description
        </label>
        <textarea
          name="description"
          rows={4}
          defaultValue={cloth?.description ?? ""}
          className="mt-1 w-full rounded-md border border-border px-3 py-2 text-sm outline-none"
        />
      </div>

      <div>
        <label className="text-xs font-medium uppercase tracking-wider text-muted">
          Image
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={handleUpload}
          disabled={isUploading}
          className="mt-1 block w-full text-sm"
        />
        {isUploading && (
          <p className="mt-1 text-xs text-muted">Uploading...</p>
        )}
        {imageUrl && (
          <div className="relative mt-3 h-40 w-32 overflow-hidden rounded-md bg-gray-100">
            <Image
              src={getClothImageUrl(imageUrl)}
              alt="Preview"
              fill
              className="object-cover"
            />
          </div>
        )}
        <input type="hidden" name="image_url" value={imageUrl} />
      </div>

      {cloth && (
        <label className="flex items-center gap-2 text-sm">
          <input
            name="active"
            type="checkbox"
            defaultChecked={cloth.active}
            className="rounded"
          />
          Active (visible on site)
        </label>
      )}

      {error && (
        <p className="rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="rounded-full bg-accent px-8 py-3 text-sm font-medium uppercase tracking-widest text-white hover:bg-gray-800 disabled:opacity-50"
      >
        {isPending ? "Saving..." : cloth ? "Update Outfit" : "Add Outfit"}
      </button>
    </form>
  );
}
