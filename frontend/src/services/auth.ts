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

  const loginData = await response.json();
  const user = await fetchUserById(loginData.user_id);
  return user;
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


export async function fetchStudentsByUserId(userId: number) {
  const response = await fetch(`${ENV.API_BASE_URL}/account/get_students/${userId}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch student details");
  }

  return response.json();
}
