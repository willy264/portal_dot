import { MAX_EVIDENCE_BYTES } from "./evidence";
export const THUMBNAIL_BYTES = 65536;
type Encode = (
  width: number,
  height: number,
  quality: number,
) => Promise<Blob | null>;
/** Every candidate is the final encoded output. Never hash an earlier/full-size input. */
export async function encodeThumbnail(
  width: number,
  height: number,
  encode: Encode,
  maxBytes = THUMBNAIL_BYTES,
): Promise<Blob> {
  if (width <= 0 || height <= 0 || width * height > 40000000)
    throw new Error("The image dimensions are too large or invalid.");
  const initial = Math.min(1, 1280 / Math.max(width, height));
  for (const reduction of [1, 0.75, 0.5, 0.35, 0.2, 0.1]) {
    const w = Math.max(1, Math.round(width * initial * reduction));
    const h = Math.max(1, Math.round(height * initial * reduction));
    for (const quality of [0.82, 0.65, 0.45, 0.3]) {
      const blob = await encode(w, h, quality);
      if (
        blob &&
        blob.size > 0 &&
        blob.size <= maxBytes &&
        blob.type === "image/jpeg"
      )
        return blob;
    }
  }
  throw new Error(
    "This photo could not fit within the verified storage limit. Choose a simpler photo.",
  );
}
export async function prepareEvidenceImage(
  file: File,
  maxBytes = THUMBNAIL_BYTES,
): Promise<Blob> {
  if (file.size > MAX_EVIDENCE_BYTES)
    throw new Error("Choose a photo smaller than 5 MB.");
  if (!["image/jpeg", "image/png", "image/webp"].includes(file.type))
    throw new Error("Choose a JPEG, PNG or WebP image.");
  const bitmap = await createImageBitmap(file);
  try {
    return await encodeThumbnail(
      bitmap.width,
      bitmap.height,
      async (width, height, quality) => {
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const context = canvas.getContext("2d");
        if (!context)
          throw new Error("This browser could not prepare the photo.");
        context.fillStyle = "#fff";
        context.fillRect(0, 0, width, height);
        context.drawImage(bitmap, 0, 0, width, height);
        return await new Promise((resolve) =>
          canvas.toBlob(resolve, "image/jpeg", quality),
        );
      },
      maxBytes,
    );
  } finally {
    bitmap.close();
  }
}
