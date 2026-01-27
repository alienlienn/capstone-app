import { ENV } from "../config/environment";

export async function updateUserProfile(userId: number, payload: any) {
  const response = await fetch(
    `${ENV.API_BASE_URL}/account/profile/${userId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to update profile");
  }

  return response.json();
}
