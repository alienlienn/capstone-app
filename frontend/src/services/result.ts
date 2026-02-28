import { ENV } from "../config/environment";
import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";
import { Platform } from "react-native";


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
        } as any);

        const response = await fetch(`${ENV.API_BASE_URL}/result/bulk_upload_excel`, {
            method: "POST",
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


export const downloadResultsTemplate = async () => {
    try {
        const templateUrl = `${ENV.API_BASE_URL}/result/download_template`;
        
        if (Platform.OS === 'web') {
            window.open(templateUrl, '_blank');
            return;
        }

        const fileUri = `${FileSystem.cacheDirectory}results_template.xlsx`;
        const { uri } = await FileSystem.downloadAsync(templateUrl, fileUri);

        if (await Sharing.isAvailableAsync()) {
            await Sharing.shareAsync(uri);
        } else {
            throw new Error("Sharing is not available on this device");
        }
    } catch (error) {
        console.error("Error downloading template:", error);
        throw error;
    }
};

