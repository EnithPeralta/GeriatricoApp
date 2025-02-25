import geriatricoApi from "../api/geriatricoApi";
import { getToken } from "../helpers/getToken";

export const useGeriatricoPersona = () => {
    const vincularPersonaAGeriatrico = async (per_id) => {
        const token = getToken();
    
        if (!token) {
            return {
                success: false,
                message: "Token de autenticación no encontrado.",
            };
        }
    
        try {
            const response = await geriatricoApi.post("/geriatricopersona/vincular", 
                { per_id }, 
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );
    
            return {
                success: true,
                message: response.data.message || "Persona vinculada con éxito a la geriatría.",
            };
    
        } catch (error) {
            console.error("Error al vincular persona a geriatría:", error.response || error.message);
            return {
                success: false,
                message: error.response?.data?.message || "Error al vincular la persona a la geriatría.",
                error: error.response?.data || error.message,
            };
        }
    };

    const personasVinculadasActivasMiGeriatrico = async () => {
        const token = getToken();
    
        if (!token) {
            return {
                success: false,
                message: "Token de autenticación no encontrado.",
            };
        }
    
        try {
            const response = await geriatricoApi.get("/geriatricopersona/vinculadas", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
    
            return {
                success: true,
                message: response.data.message || "Personas vinculadas obtenidas con éxito.",
                personas: response.data.data || [], // Ajustado según la estructura del backend
            };
    
        } catch (error) {
            console.error("Error al obtener personas vinculadas:", error.response || error.message);
    
            // Manejo específico para el caso en que no haya personas activas vinculadas
            if (error.response?.status === 404) {
                return {
                    success: false,
                    message: "No hay personas activas vinculadas a este geriátrico.",
                    personas: [],
                };
            }
    
            return {
                success: false,
                message: error.response?.data?.message || "Error al obtener las personas vinculadas.",
                error: error.response?.data || error.message,
            };
        }
    };
    
    
    return {
        vincularPersonaAGeriatrico,
        personasVinculadasActivasMiGeriatrico
    }
}
