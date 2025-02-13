import { useDispatch, useSelector } from "react-redux";
import geriatricoApi from "../api/geriatricoApi";
import { clearErrorMessage, onChecking, onLogin, onLogout } from "../store/auth/AuthSlice";
import { useNavigate } from "react-router-dom";
import { getToken } from "../helpers/getToken";

export const useAuthStore = () => {
    const { status, user, errorMessage } = useSelector(state => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const startLogin = async ({ per_usuario, per_password }) => {
        dispatch(onChecking());

        try {
            const { data } = await geriatricoApi.post('auth/login', { per_usuario, per_password });

            console.log("✅ Datos del servidor:", data);

            // Guardar token en localStorage
            localStorage.setItem('token', data.token);
            localStorage.setItem('token-init-date', new Date().getTime());

            // Guardar datos en el estado global
            dispatch(onLogin({
                per_usuario: data.persona.per_usuario,
                per_nombre_completo: data.persona.nombre_completo,
                per_telefono: data.persona.per_telefono,
                esSuperAdmin: data.persona.esSuperAdmin,
                token: data.token,
            }));

            return { success: true, esSuperAdmin: data.persona.esSuperAdmin }; // ✅ Retorna el rol
        } catch (error) {
            console.error("❌ Error en la solicitud:", error.response?.data || error);

            dispatch(onLogout(error.response?.data?.message));

            setTimeout(() => {
                dispatch(clearErrorMessage());
            }, 10);

            return false; // ✅ Agregar este return en caso de error
        }
    };


    const startRegister = async ({ per_password, per_usuario, per_genero, per_telefono, per_nombre_completo, per_documento, per_correo, per_foto }) => {
        dispatch(onChecking());
        const token = getToken();
        if (!token) {
            return {
                success: false,
                message: "Token de autenticación no encontrado",
            };
        }
        try {
            const formData = new FormData();
            formData.append("per_documento", per_documento);
            formData.append("per_telefono", per_telefono);
            formData.append("per_nombre_completo", per_nombre_completo);
            formData.append("per_correo", per_correo);
            formData.append("per_genero", per_genero);
            formData.append("per_usuario", per_usuario);
            formData.append("per_password", per_password);

            if (per_foto) {
                formData.append("per_foto", per_foto);
            }

            const { data } = await geriatricoApi.post('auth/registroPersona', formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data"
                },
            });

            console.log("Respuesta del servidor:", data);

            if (data.data && data.data.per_id) {
                const { per_usuario, per_password } = data.data.user;
                dispatch(onLogin({ username: per_usuario, password: per_password }));
            }

            return data; // 🔹 Ahora retornamos la respuesta al `registroSubmit`
        } catch (error) {
            console.error("Error en startRegister:", error);
            dispatch(onLogout(error.response?.data?.message || "Error desconocido"));
            setTimeout(() => {
                dispatch(clearErrorMessage());
            }, 10);
            return null; // 🔹 Retornar `null` en caso de error para evitar `undefined`
        }
    };


    const checkAuthToken = () => {
        const token = localStorage.getItem('token');

        if (!token) {
            dispatch(onLogout());
            return;
        }

        dispatch(onLogin({ token })); // ✅ Usuario sigue autenticado
    };

    const startLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('token-init-date');
        dispatch(onLogout()); // Cambia el estado a "no autenticado"
        navigate('/auth/login'); // Redirige al login al cerrar sesión
    };

    return {
        /*Propiedades*/
        status,
        user,
        errorMessage,
        /*Metodos*/
        startRegister,
        startLogin,
        checkAuthToken,
        startLogout
    }
}