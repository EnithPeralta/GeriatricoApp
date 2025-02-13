import { useDispatch } from "react-redux";
import geriatricoApi from "../api/geriatricoApi";
import {
    saveGeriatricoFailure,
    saveGeriatricoSuccess,
    startSavingGeriatrico,
    clearGeriatricoState
} from "../store/geriatrico/geriatricoSlice";
import { getToken } from "../helpers/getToken";

export const useGeriatrico = () => {
    const dispatch = useDispatch();

    const crearGeriatrico = async ({ ge_nombre, ge_nit, ge_color_principal, ge_color_secundario, ge_color_terciario, ge_logo }) => {
        dispatch(startSavingGeriatrico()); // Iniciar la carga

        try {
            if (!ge_logo) {
                throw new Error("El logo del geriátrico es obligatorio.");
            }

            // Crear FormData con la clave correcta esperada por el backend
            const formData = new FormData();
            formData.set("ge_logo", ge_logo); // El backend espera 'ge_logo' en req.file
            formData.set("ge_nombre", ge_nombre);
            formData.set("ge_nit", ge_nit);
            formData.set("ge_color_principal", ge_color_principal);
            formData.set("ge_color_secundario", ge_color_secundario);
            formData.set("ge_color_terciario", ge_color_terciario);

            // Enviar los datos al backend
            const { data } = await geriatricoApi.post("/geriatricos", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });

            dispatch(saveGeriatricoSuccess(data)); // Guardar en Redux

            return {
                success: true,
                message: data.message || "Geriátrico creado exitosamente",
                geriatrico: data.geriatrico
            };

        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message || "Error al crear el geriátrico";
            dispatch(saveGeriatricoFailure(errorMessage)); // Guardar error en Redux

            return {
                success: false,
                message: errorMessage
            };
        }
    };

    const obtenerGeriatricos = async () => {
        dispatch(startSavingGeriatrico()); // Indicar que está cargando datos

        const token = getToken();

        if (!token) {
            dispatch(saveGeriatricoFailure("No hay token disponible"));
            return {
                success: false,
                message: "No hay token disponible",
                geriatricos: []
            };
        }

        try {
            const { data } = await geriatricoApi.get('/geriatricos', {
                headers: {
                    Authorization: `Bearer ${token}`, // Agregar token en los headers
                }
            });

            if (data?.geriatricos?.length > 0) {
                dispatch(saveGeriatricoSuccess({
                    message: "Geriátricos obtenidos",
                    geriatrico: data.geriatricos
                }));

                return {
                    success: true,
                    message: data.message || "Geriátricos obtenidos exitosamente",
                    geriatricos: data.geriatricos
                };
            } else {
                console.warn("No se han encontrado geriátricos.");
                return {
                    success: false,
                    message: "No se han encontrado geriátricos.",
                    geriatricos: []
                };
            }
        } catch (error) {
            console.error("Error al obtener los geriátricos:", error);
            dispatch(saveGeriatricoFailure("Error al obtener los geriátricos"));

            return {
                success: false,
                message: error.response?.data?.message || "Error al obtener los geriátricos",
                geriatricos: []
            };
        }
    };

    const actualizarGeriatrico = async (ge_id, datosGeriatrico) => {
        console.log(ge_id,datosGeriatrico);
        const token = getToken();

        if (!token) {
            return {
                success: false,
                message: "No hay token disponible",
                geriatrico: null
            };
        }

        if (!ge_id) {
            return {
                success: false,
                message: "El ID del geriátrico es requerido",
                geriatrico: null
            };
        }

        try {
            const { data } = await geriatricoApi.put(
                `/geriatricos/${ge_id}`,
                datosGeriatrico,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    }
                }
            );

            return {
                success: true,
                message: data.message || "Geriátrico actualizado exitosamente",
                geriatrico: data.geriatrico
            };
        } catch (error) {
            console.error("Error en actualizarGeriatrico:", error);

            return {
                success: false,
                message: error.response?.data?.message || "Error al actualizar el geriátrico",
                error: error.response?.data || error.message
            };
        }
    };

    const limpiarEstadoGeriatrico = () => {
        dispatch(clearGeriatricoState());
    };

    return { crearGeriatrico, obtenerGeriatricos, limpiarEstadoGeriatrico, actualizarGeriatrico };
};
