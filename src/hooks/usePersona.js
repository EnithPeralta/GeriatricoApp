import { useDispatch, useSelector } from "react-redux";
import geriatricoApi from "../api/geriatricoApi";
import { setError, setLoading, setPerson } from "../store/personas/personSlice";
import { getToken } from "../helpers/getToken";

export const usePersona = () => {
    const { persona } = useSelector((state) => state.person); // Mejorar el tipado aquí si es posible
    const dispatch = useDispatch();

    const getAuthenticatedPersona = async () => {
        dispatch(setLoading(true));

        const token = getToken();
        if (!token) {
            const errorMsg = "Token de autenticación no encontrado";
            dispatch(setError(errorMsg));
            return { success: false, message: errorMsg, persona: null };
        }

        try {
            const { data } = await geriatricoApi.get("personas/perfil", {
                headers: { Authorization: `Bearer ${token}` },
                withCredentials: true,
            });

            if (!data?.persona) {
                const errorMsg = "No se encontró la persona autenticada";
                dispatch(setError(errorMsg));
                return { success: false, message: errorMsg, persona: null };
            }

            dispatch(setPerson(data.persona));
            return { success: true, message: "Persona obtenida con éxito", persona: data.persona };

        } catch (error) {
            const errorMessage = error.response?.data?.message || "Error al obtener los datos de la persona";
            dispatch(setError(errorMessage));
            return { success: false, message: errorMessage, persona: null };

        } finally {
            dispatch(setLoading(false));
        }
    };

    const updatePerfil = async (data) => {
        dispatch(setLoading(true));

        const token = getToken();
        if (!token) {
            dispatch(setError("Token de autenticación no encontrado"));
            return { success: false, message: "Token de autenticación no encontrado", persona: null };
        }

        try {
            const camposPermitidos = ["per_correo", "per_telefono", "per_usuario", "per_nombre", "per_foto"];
            const datosFiltrados = Object.fromEntries(
                Object.entries(data).filter(([key]) => camposPermitidos.includes(key))
            );

            const formData = new FormData();
            for (const [key, value] of Object.entries(datosFiltrados)) {
                if (key === "per_foto" && typeof value === "string" && value.startsWith("data:image")) {
                    const blob = await fetch(value).then((res) => res.blob());
                    formData.append("per_foto", blob, "perfil.jpg");
                } else {
                    formData.append(key, value);
                }
            }

            const response = await geriatricoApi.put("personas/updateperfil", formData, {
                headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
            });

            return { success: true, message: "Perfil actualizado con éxito", persona: response.data.persona };

        } catch (error) {
            const errorMessage = error.response?.data?.message || "Error al actualizar el perfil";
            dispatch(setError(errorMessage));
            return { success: false, message: errorMessage, persona: null };

        } finally {
            dispatch(setLoading(false));
        }
    };

    const obtenerPersonasRegistradas = async () => {
        dispatch(setLoading(true));

        const token = getToken();
        if (!token) {
            dispatch(setError("Token de autenticación no encontrado"));
            return { success: false, message: "Token de autenticación no encontrado", personas: null };
        }

        try {
            const { data } = await geriatricoApi.get("/personas", {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!data?.personas || data.personas.length === 0) {
                return { success: false, message: "No se han encontrado personas registradas", personas: [] };
            }

            return { success: true, message: "Personas obtenidas con éxito", personas: data.personas };

        } catch (error) {
            const errorMessage = error.response?.data?.message || "Error al obtener las personas";
            dispatch(setError(errorMessage));
            return { success: false, message: errorMessage, personas: null };

        } finally {
            dispatch(setLoading(false));
        }
    };

    // Funcion para buscar si una persona ya esta vinculada a un geriatrico
    const buscarVincularPersona = async ({ documento, ge_id }) => {
        const token = getToken();

        if (!token) {
            return {
                success: false,
                message: "Token de autenticación no encontrado.",
            };
        }

        try {
            const { data } = await geriatricoApi.get(
                `/personas/buscar/${documento}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (!data) {
                return {
                    success: false,
                    message: "Persona no encontrada. ¿Desea registrarla?",
                    action: "register",
                };
            }

            const { per_id, per_nombre, per_documento, geriatricos } = data;

            // Verificar si ya está vinculada al geriátrico actual
            const vinculoExistente = geriatricos.some((g) => g.ge_id === ge_id);

            if (vinculoExistente) {
                return {
                    success: false,
                    message: "La persona ya está vinculada a este geriátrico.",
                    action: "none",
                };
            }

            return {
                success: true,
                message: "Persona encontrada. ¿Desea vincularla?",
                action: "link",
                per_id,
                per_nombre,
                per_documento,
                geriatricos, // Lista de geriátricos a los que ya pertenece
            };
        } catch (error) {
            console.error("❌ Error al buscar la persona:", error);
            return {
                success: false,
                message: error.response?.data?.message || "Error al buscar la persona.",
                action: "error",
            };
        }
    };

    const obtenerPersonaRoles = async ({ per_id }) => {
        dispatch(setLoading(true));

        const token = getToken();
        if (!token) {
            dispatch(setError("Token de autenticación no encontrado"));
            return {
                success: false,
                message: "Token de autenticación no encontrado",
                persona: null
            };
        }

        try {
            const { data } = await geriatricoApi.get(`/personas/roles/${per_id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            console.log(data);

            if (!data?.persona) {
                return {
                    success: false,
                    message: "No se han encontrado datos para esta persona",
                    persona: null,
                };
            }

            return {
                success: true,
                message: "Datos obtenidos con éxito",
                persona: data.persona,
            };
        } catch (error) {
            console.error("Error al obtener los roles de la persona:", error);
            const errorMessage = error.response?.data?.message || "Error al obtener los datos de la persona";
            dispatch(setError(errorMessage));
            return {
                success: false,
                message: errorMessage,
                persona: null,
            };
        }
    };

    const updatePerson = async (per_id, data) => {
        console.log("Datos enviados:", data);
        const token = getToken();
        if (!token) {
            return { success: false, message: "Token de autenticación no encontrado" };
        }
    
        const formData = new FormData();
        for (const [key, value] of Object.entries(data)) {
            if (key === "per_foto" && typeof value === "string" && value.startsWith("data:image")) {
                try {
                    const blob = await fetch(value).then(res => res.blob());
                    formData.append("per_foto", blob, "perfil.jpg");
                } catch (error) {
                    console.error("Error al procesar la imagen:", error);
                    return { success: false, message: "Error al procesar la imagen" };
                }
            } else {
                formData.append(key, value);
            }
        }
    
        try {
            const response = await geriatricoApi.put(`/personas/${per_id}`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data"
                }
            });
        
            console.log("Respuesta completa del servidor:", response.data);
        
            if (response.data.persona) {  // ✅ Verificamos que 'persona' esté presente
                console.log("Persona actualizada con éxito", response.data);
                return { success: true, message: response.data.message, persona: response.data.persona };
            } else {
                console.warn("No se encontró el objeto 'persona' en la respuesta:", response.data);
                return { success: false, message: response.data.message || "Error desconocido en la actualización" };
            }
        } catch (error) {
            console.error("Error en la actualización:", error);
            return { success: false, message: error.response?.data?.message || "Error al actualizar la persona" };
        }
    };                

    
        
    return { persona, getAuthenticatedPersona, updatePerfil, obtenerPersonasRegistradas, buscarVincularPersona, obtenerPersonaRoles, updatePerson };
};
