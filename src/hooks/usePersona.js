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

    return { persona, getAuthenticatedPersona, updatePerfil, obtenerPersonasRegistradas };
};
