import { ENV } from "../config/environment";


export async function uploadProfileAvatar(userId: number, avatar: string | File) {
  const formData = new FormData();

  if (avatar instanceof File) {
    formData.append("file", avatar);
  } else {
    const filename = avatar.split("/").pop();
    const match = /\.(\w+)$/.exec(filename || "");
    const type = match ? `image/${match[1]}` : `image`;
    formData.append("file", { uri: avatar, name: filename, type } as any);
  }

  const res = await fetch(`${ENV.API_BASE_URL}/account/upload_avatar/${userId}`, {
    method: "POST",
    body: formData,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  if (!res.ok) throw new Error("Avatar upload failed");

  const data = await res.json();
  return data.profile_image_url;
}
