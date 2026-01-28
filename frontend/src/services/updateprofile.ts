import { ENV } from "../config/environment";

export async function updateUserProfile(userId: number, payload: any) {
  const response = await fetch(
    `${ENV.API_BASE_URL}/account/update_profile/${userId}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Failed to update profile");
  }

  return response.json();
}

