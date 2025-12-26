export interface SubmitResult {
    success: boolean;
    message?: string;
}

// TODO: Reemplaza esto con tu URL de Google Apps Script Web App
// Debería verse como: https://script.google.com/macros/s/.../exec
const FORM_ENDPOINT = "https://script.google.com/macros/s/AKfycby8i58PfHya0R2funvktlN1e8fu_li4pOCaG8OEVPRqWBgJpRo01M1efeCBEHXY1D54/exec";

export async function submitForm(data: Record<string, any>): Promise<SubmitResult> {
    try {
        // Log para depuración
        console.log("Enviando datos a:", FORM_ENDPOINT);
        console.log("Payload:", data);

        const payload = JSON.stringify(data);

        const response = await fetch(FORM_ENDPOINT, {
            method: "POST",
            redirect: "follow",
            headers: {
                "Content-Type": "text/plain;charset=utf-8",
            },
            body: payload,
        });

        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status}`);
        }

        const result = await response.json();

        // Manejar respuesta exitosa estándar de Google Apps Script
        if (result.result === "success" || result.success === true) {
            return { success: true };
        } else {
            return {
                success: false,
                message: result.message || "Error en el script de destino"
            };
        }

    } catch (error) {
        console.error("Form Submission Error:", error);
        return {
            success: false,
            message: "Hubo un error de conexión. Verifica tu internet e inténtalo de nuevo."
        };
    }
}
