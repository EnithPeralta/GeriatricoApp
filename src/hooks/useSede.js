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

    return { obtenerSedesGeriatrico };
};
