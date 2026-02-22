import { ENV } from "../config/environment";


export const getTeacherStudents = async (userId: number) => {
    try {
        const response = await fetch(`${ENV.API_BASE_URL}/result/get_teacher_students/${userId}`);
        if (!response.ok) throw new Error("Failed to fetch teacher students");
        return await response.json();
    } catch (error) {
        console.error("Error fetching teacher students:", error);
        throw error;
    }
};

export const getParentStudents = async (userId: number) => {
    try {
        const response = await fetch(`${ENV.API_BASE_URL}/result/get_students/${userId}`);
        if (!response.ok) throw new Error("Failed to fetch parent students");
        return await response.json();
    } catch (error) {
        console.error("Error fetching parent students:", error);
        throw error;
    }
};

export const fetchStudentResults = async (studentId: number, term: string) => {
    try {
        const response = await fetch(`${ENV.API_BASE_URL}/result/student/${studentId}?term=${encodeURIComponent(term)}`);
        if (!response.ok) throw new Error("Failed to fetch student results");
        return await response.json();
    } catch (error) {
        console.error("Error fetching student results:", error);
        throw error;
    }
};

