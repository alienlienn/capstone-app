import { ENV } from "../config/environment";
import { StudentResult } from "../types/types";

export const addResults = async (results: StudentResult | StudentResult[]) => {
  try {
    const response = await fetch(`${ENV.API_BASE_URL}/account/add_results`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(results),
    });
    if (!response.ok) throw new Error("Failed to add results");
    return await response.json();
  } catch (error) {
    console.error("Error adding results:", error);
    throw error;
  }
};

export const getStudentResults = async (studentId: number) => {
  try {
    const response = await fetch(`${ENV.API_BASE_URL}/account/get_student_results/${studentId}`);
    if (!response.ok) throw new Error("Failed to fetch student results");
    return await response.json();
  } catch (error) {
    console.error("Error fetching student results:", error);
    throw error;
  }
};
