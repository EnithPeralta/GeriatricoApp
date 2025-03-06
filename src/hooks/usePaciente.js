import geriatricoApi from "../api/geriatricoApi";
import { getToken } from "../helpers/getToken";

export const usePaciente = () => {
    const registrarPaciente = async ({ per_id,
        pac_edad,
        pac_peso,
        pac_talla,
        pac_regimen_eps,
        pac_nombre_eps,
        pac_rh_grupo_sanguineo,
        pac_talla_camisa,
        pac_talla_pantalon,
        rol_id,
        sp_fecha_inicio,
        sp_fecha_fin, }) => {
        console.log("📤 Enviando datos para registrar paciente:", {
            per_id,
            pac_edad,
            pac_peso,
            pac_talla,
            pac_regimen_eps,
            pac_nombre_eps,
            pac_rh_grupo_sanguineo,
            pac_talla_camisa,
            pac_talla_pantalon,
            rol_id,
            sp_fecha_inicio,
            sp_fecha_fin,
        });

        const token = getToken();
        if (!token) {
            return {
                success: false,
                message: "🔒 Token de autenticación no encontrado.",
            };
        }

        if (!rol_id) {
            console.error("⚠️ El rol_id está vacío o indefinido.");
            return { success: false, message: "El rol del usuario es obligatorio." };
        }

        try {
            const { data } = await geriatricoApi.post(
                "/pacientes/registrar",
                {
                    per_id,
                    pac_edad,
                    pac_peso,
                    pac_talla,
                    pac_regimen_eps,
                    pac_nombre_eps,
                    pac_rh_grupo_sanguineo,
                    pac_talla_camisa,
                    pac_talla_pantalon,
                    rol_id,
                    sp_fecha_inicio,
                    sp_fecha_fin,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            console.log("✅ Respuesta del servidor:", data);

            return {
                success: true,
                message: data.message || "Paciente registrado con éxito.",
                paciente: data.datosPaciente || null, // Ajustado a la respuesta del backend
                vinculacion: data.nuevaVinculacion || null, // Validado contra el backend
                sedeActual: data.sedeActual || null, // Si el paciente ya está en otra sede
            };
        } catch (error) {
            console.error("❌ Error al registrar paciente:", error);

            let errorMessage = "Error al registrar el paciente.";
            let sedeActual = null;

            if (error.response) {
                errorMessage = error.response.data?.message || errorMessage;
                sedeActual = error.response.data?.sedeActual || null;
            } else if (error.request) {
                errorMessage = "No se pudo conectar con el servidor.";
            }

            return {
                success: false,
                message: errorMessage,
                sedeActual, // Retorna la sede si ya está registrado en otra
            };
        }
    };

    const obtenerRolesPacientesSede = async () => {
        const token = getToken();
        if (!token) {
            return {
                success: false,
                message: "Token de autenticación no encontrado",
                data: null
            };
        }

        try {
            const { data } = await geriatricoApi.get(`pacientes/sede`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            console.log("✅ Respuesta del servidor:", data);

            return {
                success: true,
                message: data.message || "Pacientes obtenidos exitosamente",
                data: data.data || [] // Acceder a data dentro de la respuesta
            };


        } catch (error) {
            console.error("❌ Error al obtener los pacientes:", error);

            let errorMessage = "Error al obtener los pacientes";
            if (error.response) {
                errorMessage = error.response.data?.message || errorMessage;
            } else if (error.request) {
                errorMessage = "No se recibió respuesta del servidor";
            }

            return {
                success: false,
                message: errorMessage,
                data: []
            };
        }
    };

    const obtenerDetallePacienteSede = async (per_id) => {
        if (!per_id) {
            return {
                success: false,
                message: "ID del paciente no proporcionado",
                paciente: null
            };
        }

        const token = getToken();
        if (!token) {
            return {
                success: false,
                message: "Token de autenticación no encontrado",
                paciente: null
            };
        }

        try {
            const { data } = await geriatricoApi.get(`pacientes/sede/${per_id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            console.log("✅ Respuesta del servidor:", data);

            if (!data?.paciente) {
                return {
                    success: false,
                    message: "Paciente no encontrado en el geriátrico al que perteneces.",
                    paciente: null
                };
            }

            return {
                success: true,
                message: data.message || "Paciente obtenido exitosamente",
                paciente: data.paciente
            };

        } catch (error) {
            console.error("❌ Error al obtener el paciente:", error);
            console.error(error.response?.data);
            return {
                success: false,
                message: error.response?.data?.message || "Error al obtener el paciente",
                paciente: null
            };
        }
    };

    const actualizarDetallePaciente = async (per_id, datosPaciente) => {
        const token = getToken();
        
        if (!token) {
            return {
                success: false,
                message: "❌ Token de autenticación no encontrado",
                paciente: null
            };
        }
    
        try {
            const { data } = await geriatricoApi.put(`pacientes/${per_id}`, datosPaciente, {
                headers: { Authorization: `Bearer ${token}` },
            });
    
            console.log("✅ Respuesta del servidor:", data);
    
            if (!data?.paciente) {
                return {
                    success: false,
                    message: "⚠️ Paciente no encontrado en el geriátrico al que perteneces.",
                    paciente: null
                };
            }
    
            return {
                success: true,
                message: data.message || "✅ Paciente actualizado exitosamente",
                paciente: data.paciente
            };
    
        } catch (error) {
            console.error("❌ Error al actualizar el paciente:", error.response?.data || error.message);
    
            return {
                success: false,
                message: error.response?.data?.message || "❌ Error al actualizar el paciente",
                paciente: null
            };
        }
    };
    

    return {
        actualizarDetallePaciente,
        registrarPaciente,
        obtenerRolesPacientesSede,
        obtenerDetallePacienteSede
    };
};
