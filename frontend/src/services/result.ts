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
}

export const updateStudentResults = async (studentId: number, term: string, results: any[], summary: any) => {
    try {
        const response = await fetch(`${ENV.API_BASE_URL}/result/update_student_results`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                student_id: studentId,
                term: term,
                results: results,
                summary: summary
            }),
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || "Failed to update results");
        }
        return await response.json();
    } catch (error) {
        console.error("Error updating student results:", error);
        throw error;
    }
};

export const bulkUploadResults = async (fileUri: string, fileName: string) => {
    try {
        const formData = new FormData();
        // @ts-ignore
        formData.append("file", {
            uri: fileUri,
            name: fileName,
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });

        const response = await fetch(`${ENV.API_BASE_URL}/result/bulk_upload_excel`, {
            method: "POST",
            headers: {
                "Accept": "application/json",
            },
            body: formData,
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || "Failed to upload results");
        }
        return await response.json();
    } catch (error) {
        console.error("Error bulk uploading results:", error);
        throw error;
    }
};

