import { useDispatch } from 'react-redux';
import geriatricoApi from "../api/geriatricoApi";
import { setError, setLoading, setPerson } from '../store/personas/personSlice';
import { getToken } from '../helpers/getToken';

export const usePersona = () => {
    const dispatch = useDispatch();

    const getAuthenticatedPersona = async () => {
        dispatch(setLoading(true)); // Iniciar la carga

        // Obtener el token de autenticación (ajusta según tu implementación)
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
            const { data } = await geriatricoApi.get('personas/perfil', {
                headers: {
                    Authorization: `Bearer ${token}`, // Agregar token en los headers
                }
            });

            // Asegurarse de que la respuesta contenga una persona
            if (!data || !data.persona) {
                dispatch(setError("No se encontró la persona autenticada"));
                return {
                    success: false,
                    message: "No se encontró la persona autenticada",
                    persona: null
                };
            }

            dispatch(setPerson(data.persona)); // Despachar persona al store
            return {
                success: true,
                message: data.message || "Persona obtenida exitosamente",
                persona: data.persona
            };

        } catch (error) {
            console.error(error);
            // Verifica si error tiene una respuesta y un mensaje
            const errorMessage = error.response?.data?.message || 'Error al obtener los datos de la persona';
            dispatch(setError(errorMessage)); // Despachar error al store
            return {
                success: false,
                message: errorMessage,
                persona: null
            };
        } finally {
            dispatch(setLoading(false)); // Termina la carga
        }
    };

    const updatePerfil = async (data) => {
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
            console.log("Datos originales antes de enviar:", data);
    
            const camposPermitidos = ["per_correo", "per_telefono", "per_usuario", "per_nombre", "per_foto"];
            const datosFiltrados = Object.fromEntries(
                Object.entries(data).filter(([key]) => camposPermitidos.includes(key))
            );
    
            console.log("Datos filtrados antes de procesar la imagen:", datosFiltrados);
    
            const formData = new FormData();
            
            for (const [key, value] of Object.entries(datosFiltrados)) {
                if (key === "per_foto" && typeof value === "string" && value.startsWith("data:image")) {
                    // Convertir Base64 a Blob
                    const blob = await fetch(value).then(res => res.blob());
                    formData.append("per_foto", blob, "perfil.jpg");
                } else {
                    formData.append(key, value);
                }
            }
    
            console.log("FormData antes de enviar:", formData);
    
            const response = await geriatricoApi.put('personas/updateperfil', formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data"
                }
            });
    
            console.log("Respuesta del backend:", response.data);
    
            return {
                success: true,
                message: "Perfil actualizado con éxito",
                persona: response.data.persona
            };
    
        } catch (error) {
            console.error("Error en la API:", error);
    
            const errorMessage = error.response?.data?.message || "Error al actualizar el perfil";
            dispatch(setError(errorMessage));
    
            return {
                success: false,
                message: errorMessage,
                persona: null
            };
        } finally {
            dispatch(setLoading(false));
        }
    };
    const obtenerPersonasRegistradas = async () => {
        dispatch(setLoading(true));
    
        const token = getToken();
        if (!token) {
          const errorMsg = "Token de autenticación no encontrado";
          dispatch(setError(errorMsg));
          return { success: false, message: errorMsg, personas: null };
        }
    
        try {
          const { data } = await geriatricoApi.get("/personas", {
            headers: { Authorization: `Bearer ${token}` },
          });
    
          if (!data?.personas || data.personas.length === 0) {
            return {
              success: false,
              message: "No se han encontrado personas registradas",
              personas: [],
            };
          }
    
          return {
            success: true,
            message: data.message || "Personas obtenidas con éxito",
            personas: data.personas,
          };
        } catch (error) {
          console.error("Error en la API:", error);
          const errorMessage = error.response?.data?.message || "Error al obtener las personas";
          dispatch(setError(errorMessage));
          return { success: false, message: errorMessage, personas: null };
        } finally {
          dispatch(setLoading(false));
        }
      };
     return {
        getAuthenticatedPersona,
        updatePerfil,
        obtenerPersonasRegistradas
    };
};
