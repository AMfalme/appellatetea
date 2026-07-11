const CLOUDINARY_CLOUD_NAME = "your-cloud-name";
const CLOUDINARY_UPLOAD_PRESET = "your-upload-preset";

export interface CloudinaryUploadResult {
  public_id: string;
  secure_url: string;
  url: string;
}

export async function uploadToCloudinary(
  file: File,
  folder: string = "articles"
): Promise<CloudinaryUploadResult> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
  formData.append("folder", folder);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/auto/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || "Upload failed");
  }

  const data = await response.json();
  return {
    public_id: data.public_id,
    secure_url: data.secure_url,
    url: data.url,
  };
}

export async function deleteFromCloudinary(publicId: string): Promise<void> {
  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/destroy`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        public_id: publicId,
        invalidate: true,
      }),
    }
  );

  if (!response.ok) {
    throw new Error("Delete failed");
  }
}