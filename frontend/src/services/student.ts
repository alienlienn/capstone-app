import { ENV } from "../config/environment";

export const getStudentDetails = async (studentId: number) => {
  try {
    const response = await fetch(`${ENV.API_BASE_URL}/account/student_details/${studentId}`);
    if (!response.ok) throw new Error("Failed to fetch student details");
    return await response.json();
  } catch (error) {
    console.error("Error fetching student details:", error);
    throw error;
  }
};
