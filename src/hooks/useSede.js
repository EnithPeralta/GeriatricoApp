import { useDispatch } from "react-redux";
import { getToken } from "../helpers/getToken";
import { startSede, setSede, setSedeError } from "../store/geriatrico/sedeSlice";
import geriatricoApi from "../api/geriatricoApi";

export const useSede = () => {
    const dispatch = useDispatch();

    const obtenerSedesGeriatrico = async () => {
        dispatch(startSede());

        const token = getToken();

        if (!token) {
            const errorMessage = "Token de autenticación no encontrado";
            dispatch(setSedeError(errorMessage));
            return { success: false, message: errorMessage, sedes: [] };
        }

        try {
            const { data } = await geriatricoApi.get("/sedes/sedesGeriatrico", {
                credentials: "include",
                headers: { Authorization: `Bearer ${token}` },
            });

            console.log("✅ Respuesta del servidor:", data);

            if (!data.sedes || !Array.isArray(data.sedes)) {
                throw new Error("Formato de respuesta inválido");
            }

            dispatch(setSede(data.sedes));

            return { success: true, message: data.message || "Sedes obtenidas exitosamente", sedes: data.sedes };
        } catch (error) {
            console.error("❌ Error al obtener sedes:", error);
            const errorMessage = error.response?.data?.error || "Error al obtener las sedes";
            dispatch(setSedeError(errorMessage));

            return { success: false, message: errorMessage, sedes: [] };
        }
    };

    const createSede = async ({ se_nombre, se_telefono, se_direccion, cupos_totales, cupos_ocupados, se_foto }) => {
        dispatch(startSede());

        const token = getToken();
        if (!token) {
            const errorMessage = "No hay token disponible";
            console.error(errorMessage);
            dispatch(setSedeError(errorMessage));
            return { success: false, message: errorMessage, sede: null };
        }

        try {
            // 🔹 Validar que todos los campos obligatorios estén presentes
            if (!se_nombre || !se_telefono || !se_direccion || !cupos_totales) {
                const errorMessage = "Todos los campos son obligatorios.";
                console.error(errorMessage);
                dispatch(setSedeError(errorMessage));
                return { success: false, message: errorMessage, sede: null };
            }

            const formData = new FormData();
            formData.append("se_nombre", se_nombre);
            formData.append("se_telefono", se_telefono);
            formData.append("se_direccion", se_direccion);
            formData.append("cupos_totales", Number(cupos_totales));

            // 🔹 Agregar `cupos_ocupados` solo si está presente
            if (cupos_ocupados !== undefined) {
                formData.append("cupos_ocupados", Number(cupos_ocupados));
            }

            // 🔹 Validar la imagen antes de enviarla
            if (se_foto) {
                if (typeof se_foto === "string" && se_foto.startsWith("data:image")) {
                    const blob = await fetch(se_foto).then(res => res.blob());
                    formData.append("se_foto", blob, "sede.jpg");  // 🔹 Nombre corregido
                } else {
                    formData.append("se_foto", se_foto);
                }
            } else {
                const errorMessage = "La foto de la sede es obligatoria.";
                console.error(errorMessage);
                dispatch(setSedeError(errorMessage));
                return { success: false, message: errorMessage, sede: null };
            }

            // 📌 LOG DE DEPURACIÓN
            console.log("📤 Enviando solicitud con datos:", {
                se_nombre, se_telefono, se_direccion, cupos_totales, cupos_ocupados, se_foto
            });

            const { data } = await geriatricoApi.post("/sedes", formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data"
                },
            });

            console.log("✅ Respuesta del servidor:", data);

            return {
                success: true,
                message: data.message || "Sede creada exitosamente",
                sede: data.sede  // 🔹 Corregido (antes era `data.sedes`)
            };

        } catch (error) {
            console.error("❌ Error al crear la sede:", error.response?.data || error.message);

            const errorMessage = error.response?.data?.message || "Error interno en el servidor";
            dispatch(setSedeError(errorMessage));

            return {
                success: false,
                message: errorMessage,
                sede: null
            };
        }
    };

    const obtenerSedesInactive = async () => {
        const token = getToken();

        if (!token) {
            const errorMessage = "Token de autenticación no encontrado";
            dispatch(setSedeError(errorMessage)); // ✅ Ahora dispatch viene como argumento
            return { success: false, message: errorMessage, sedes: [] };
        }

        try {
            const { data } = await geriatricoApi.get("/sedes/inactivas", {
                credentials: "include",
                headers: { Authorization: `Bearer ${token}` },
            });

            console.log("✅ Respuesta del servidor:", data);

            if (!data.sedes || !Array.isArray(data.sedes)) {
                throw new Error("Formato de respuesta inválido");
            }

            dispatch(setSede(data.sedes)); // ✅ Guardamos en el estado global

            return { success: true, message: data.message || "Sedes obtenidas exitosamente", sedes: data.sedes };
        } catch (error) {
            console.error("❌ Error al obtener sedes:", error);
            const errorMessage = error.response?.data?.error || "Error al obtener las sedes";
            dispatch(setSedeError(errorMessage));

            return { success: false, message: errorMessage, sedes: [] };
        }
    };


    const actualizarSede = async (se_id, datosSede) => {
        dispatch(startSede());
        console.log("Intentando actualizar sede con ID:", se_id, "Datos:", datosSede);

        const token = getToken();
        if (!token) {
            const errorMessage = "No hay token disponible";
            dispatch(setSedeError(errorMessage));
            return { success: false, message: errorMessage, sede: null };
        }

        if (!se_id) {
            const errorMessage = "ID de sede no válido";
            dispatch(setSedeError(errorMessage));
            return { success: false, message: errorMessage, sede: null };
        }

        try {
            const formData = new FormData();

            for (const [key, value] of Object.entries(datosSede)) {
                if (key === "se_foto" && typeof value === "string" && value.startsWith("data:image")) {
                    const blob = await fetch(value).then(res => res.blob());
                    formData.append("se_foto", blob, "logo.jpg");
                } else {
                    formData.append(key, value);
                }
            }

            const { data } = await geriatricoApi.put(`/sedes/${se_id}`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data"
                },
            });

            console.log("✅ Respuesta del servidor:", data);
            return { success: true, message: data.message || "Sede actualizada exitosamente", sede: data.sede };
        } catch (error) {
            console.error("❌ Error al actualizar sede:", error);
            const errorMessage = error.response?.data?.message || "Error al actualizar la sede";
            dispatch(setSedeError(errorMessage));
            return { success: false, message: errorMessage, sede: null };
        }
    };

    const reactivarSedes = async (se_id) => {
        dispatch(startSede());
        console.log("Intentando reactivar sede con ID:", se_id);

        const token = getToken();
        if (!token) {
            const errorMessage = "No hay token disponible";
            dispatch(setSedeError(errorMessage));
            return { success: false, message: errorMessage, sede: null };
        }

        try {
            const { data } = await geriatricoApi.put(
                `/sedes/reactivar/${se_id}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            console.log("✅ Respuesta del servidor:", data);
            return { success: true, message: data.message || "Sede reactivada exitosamente", sede: null };
        } catch (error) {
            console.error("❌ Error al reactivar sede:", error);
            const errorMessage = error.response?.data?.message || "Error al reactivar la sede";
            dispatch(setSedeError(errorMessage));
            return { success: false, message: errorMessage, sede: null };
        }
    };

    const inactivarSedes = async (se_id) => {
        dispatch(startSede());
        console.log("Intentando inactivar sede con ID:", se_id);

        const token = getToken();
        if (!token) {
            const errorMessage = "No hay token disponible";
            dispatch(setSedeError(errorMessage));
            return { success: false, message: errorMessage, sede: null };
        }

        try {
            const { data } = await geriatricoApi.put(
                `/sedes/inactivar/${se_id}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            console.log("✅ Respuesta del servidor:", data);
            return { success: true, message: data.message || "Sede inactivada exitosamente", sede: null };
        } catch (error) {
            console.error("❌ Error al inactivar sede:", error);
            const errorMessage = error.response?.data?.message || "Error al inactivar la sede";
            dispatch(setSedeError(errorMessage));
            return { success: false, message: errorMessage, sede: null };
        }
    };

    const obtenerSedesHome = async () => {
        dispatch(startSede());
        console.log("Intentando obtener sedes para la home...");
        
        const token = getToken();
        if (!token) {
            const errorMessage = "Token de autenticación no encontrado";
            dispatch(setSedeError(errorMessage));
            return { success: false, message: errorMessage, sedes: [] };
        }
    
        try {
            const { data } = await geriatricoApi.get("/sedes/homeSede", {
                headers: { Authorization: `Bearer ${token}` },
            });
    
            console.log("✅ Respuesta del servidor:", data);
    
            if (!data.sedes || !Array.isArray(data.sedes)) {
                throw new Error("Formato de respuesta inválido: No es un array");
            }
    
            dispatch(setSede(data.sedes));
            return { success: true, message: data.message || "Sedes obtenidas exitosamente", sedes: data.sedes };
    
        } catch (error) {
            console.error("❌ Error al obtener sedes:", error);
    
            const errorMessage = error.response?.data?.message || "Error al obtener las sedes";
            dispatch(setSedeError(errorMessage));
    
            return { success: false, message: errorMessage, sedes: [] };
        }
    };
    

    return { obtenerSedesGeriatrico, obtenerSedesInactive, createSede, actualizarSede, reactivarSedes, inactivarSedes, obtenerSedesHome };
};
