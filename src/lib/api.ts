export interface Certificate {
    certificateNo: string;
    studentName: string;
    fatherName: string;
    duration: string;
    completionDate: string; // or Date
    status: string;
}

const API_URL = import.meta.env.VITE_API_URL;

export async function fetchCertificate(id: string): Promise<Certificate | null> {
    // If no URL is set, return mock data for development
    if (!API_URL) {
        console.error("API URL is not defined in .env");
        return null;
    }

    try {
        const response = await fetch(`${API_URL}?action=search&certificateNo=${id}`);
        const result = await response.json();
        if (result.status === "success") {
            return result.data;
        }
        return null;
    } catch (error) {
        console.error("Failed to fetch certificate", error);
        return null;
    }
}

export async function fetchAllCertificates(): Promise<Certificate[]> {
    if (!API_URL) {
        console.error("API URL is not defined");
        return [];
    }

    try {
        const response = await fetch(`${API_URL}?action=getAll`);
        const result = await response.json();
        if (result.status === "success") {
            return result.data;
        }
        return [];
    } catch (error) {
        console.error("Failed to fetch all certificates", error);
        return [];
    }
}


export async function addCertificate(cert: Certificate): Promise<{ success: boolean; message: string }> {
    if (!API_URL) {
        console.warn("API URL not configured");
        return { success: false, message: "API Configuration Missing" };
    }

    try {
        const response = await fetch(`${API_URL}?action=add`, {
            method: "POST",
            body: JSON.stringify(cert),
        });

        const result = await response.json();
        if (result.status === "success") {
            return { success: true, message: "Added successfully" };
        }
        return { success: false, message: result.message || "Unknown error" };
    } catch (error: any) {
        console.error("Error adding certificate", error);
        return { success: false, message: error.toString() };
    }
}
