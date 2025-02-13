import { useDispatch, useSelector } from "react-redux";
import geriatricoApi from "../api/geriatricoApi";
import { clearErrorMessage, onChecking, onLogin, onLogout } from "../store/auth/AuthSlice";


export const useEnfermera = () => {
    const { status, user, errorMessage } = useSelector(state => state.auth);
    const dispatch = useDispatch();

    const startRegisterEnfermera = async ({ per_id, enf_codigo }) => {
        dispatch(onChecking());
        try {
            const { data } = await geriatricoApi.post('enfermeras/registrar', { per_id, enf_codigo });
            console.log(data)
            // Si la respuesta contiene un mensaje indicando que ya está registrada
            if (data.message === 'La persona ya está registrada como enfermera.') {
                dispatch(onLogout(data.message));
            } else {
                dispatch(onLogin({ username: data.per_usuario, password: data.per_password }));
            }
            console.log(data);
        } catch (error) {
            dispatch(onLogout(error.response?.data?.message || '--'));
            setTimeout(() => {
                dispatch(clearErrorMessage());
            }, 10);
        }
    };

    return {
        // Propiedades
        status, user, errorMessage,
        // Metodos
        startRegisterEnfermera

    }
}
