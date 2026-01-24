import { ENV } from "../config/environment";
import { LoginRequest } from "../types/types";

export async function loginUser(payload: LoginRequest) {
  const response = await fetch(
    `${ENV.API_BASE_URL}/account/user_authentication`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "Login Unsuccessful");
  }

  return response.json();
}

export async function fetchUserById(userId: string) {
  const response = await fetch(`${ENV.API_BASE_URL}/account/profile_details/${userId}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch user details");
  }

  return response.json();
}
