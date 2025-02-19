import { useState } from "react";
import geriatricoApi from "../api/geriatricoApi";
import { getToken } from "../helpers/getToken";
import { setRolError, setRolSeleccionado, startSeleccion } from "../store/geriatrico/rolSlice";
import { useDispatch } from "react-redux";
import { setGeriatricoSeleccionado } from "../store/geriatrico/geriatricoSlice";

export const useRoles = () => {
    const dispatch = useDispatch();

    const crearRol = async ({ rol_nombre, rol_descripcion }) => {
        try {
            const { data } = await geriatricoApi.post('/roles', { rol_nombre, rol_descripcion });

            if (data && data.rol) {
                return {
                    success: true,
                    message: data.message || 'Rol creado exitosamente',
                    rol: data.rol
                };
            } else {
                throw new Error('Respuesta inesperada del servidor');
            }
        } catch (error) {
            console.error('Error al crear el rol:', error);

            return {
                success: false,
                message: error.response?.data?.message || 'Error al crear el rol'
            };
        }
    };

    const obtenerRoles = async () => {
        try {
            const { data } = await geriatricoApi.get('/roles');

            if (data && data.roles) {
                return {
                    success: true,
                    message: data.message || 'Roles obtenidos exitosamente',
                    roles: data.roles
                };
            } else {
                throw new Error('Respuesta inesperada del servidor');
            }
        } catch (error) {
            console.error('Error al obtener los roles:', error);

            return {
                success: false,
                message: error.response?.data?.message || 'Error al obtener los roles'
            };
        }
    };

    const actualizarRol = async ({ rol_id, rol_nombre, rol_descripcion }) => {
        try {
            // Hacer la solicitud PUT con los datos a actualizar
            const { data } = await geriatricoApi.put(`/roles/${rol_id}`, { rol_nombre, rol_descripcion });

            // Validar la respuesta
            if (data?.rol) {
                return {
                    success: true,
                    message: data.message || 'Rol actualizado exitosamente',
                    rol: data.rol
                };
            } else {
                throw new Error('Respuesta inesperada del servidor');
            }
        } catch (error) {
            console.error('Error al actualizar el rol:', error);

            return {
                success: false,
                message: error.response?.data?.message || 'Error al actualizar el rol'
            };
        }
    };

    const obtenerRolesAsignados = async () => {
        try {
            const { data } = await geriatricoApi.get('/roles/rolesAsignados');
            // Extraemos los roles de ambas categorías
            const rolesGeriatrico = data?.opcionesGeriatrico?.map(rol => ({
                rol_id: rol.rol_id,
                rol_nombre: rol.rol_nombre,
                ge_id: rol.ge_id,
                ge_nombre: rol.ge_nombre,
                tipo: "geriatrico"
            })) || [];

            const rolesSede = data?.opcionesSede?.map(rol => ({
                rol_id: rol.rol_id,
                rol_nombre: rol.rol_nombre,
                se_id: rol.se_id,
                se_nombre: rol.se_nombre,
                tipo: "sede"
            })) || [];

            const roles = [...rolesGeriatrico, ...rolesSede];

            if (roles.length > 0) {
                return {
                    success: true,
                    message: data.message || 'Roles asignados obtenidos exitosamente',
                    roles
                };
            }

            return {
                success: false,
                message: "No tienes roles asignados.",
                roles: []
            };

        } catch (error) {
            console.error("Error al obtener los roles asignados:", error);
            return {
                success: false,
                message: error.response?.data?.message || "Error al obtener los roles asignados"
            };
        }
    };
    const seleccionarRol = async ({ rol_id, se_id, ge_id }) => {
        const rolIdNum = Number(rol_id);  // Convierte a número
        const geIdNum = ge_id ? Number(ge_id) : undefined;  // Convierte a número si ge_id existe
        const seIdNum = se_id? Number(se_id) : undefined;  // Convierte a número si se_id existe
    
        console.log("🟢 Recibidos:", { rolIdNum, seIdNum, geIdNum });
    
        dispatch(startSeleccion());
    
        const token = getToken();
        console.log("🔑 Token utilizado:", token);
    
        if (!token) {
            const errorMessage = "Token de autenticación no encontrado";
            dispatch(setRolError(errorMessage));
            return { success: false, message: errorMessage };
        }
    
        if (!rolIdNum || (!seIdNum && !geIdNum)) {
            const errorMessage = "Debe seleccionar un rol y una sede o geriátrico.";
            dispatch(setRolError(errorMessage));
            return { success: false, message: errorMessage };
        }
    
        if (seIdNum && geIdNum) {
            const errorMessage = "Debe seleccionar solo una sede o geriátrico, no ambos.";
            dispatch(setRolError(errorMessage));
            return { success: false, message: errorMessage };
        }
    
        try {
            const payload = {
                rol_id: rolIdNum,
                ...(seIdNum ? { se_id } : {}),
                ...(geIdNum ? { ge_id: geIdNum } : {}),
            };
    
            console.log("📤 Payload final:", payload);
    
            const { data } = await geriatricoApi.post(
                "/roles/rolSeleccionado",
                payload,
                { headers: { Authorization: `Bearer ${token}` } }
            );
    
            console.log("✅ Respuesta exitosa:", data);
            console.log(data.ge_id);

            // Guardar en Redux
            dispatch(setRolSeleccionado({ rol_id: rolIdNum, se_id: seIdNum, ge_id: geIdNum }));
    
            return { success: true, message: data.message, data };
        } catch (error) {
            console.error("❌ Error en la petición:", error);
    
            const errorMessage = error.response?.data?.errors[0]?.msg || "Error al seleccionar rol";
            dispatch(setRolError(errorMessage));
    
            return { success: false, message: errorMessage };
        }
    };
    
    // const seleccionarRol = async ({ rol_id, se_id, ge_id }) => {
    //     console.log("🟢 Recibidos:", { rol_id, se_id, ge_id });

    //     dispatch(startSeleccion());

    //     const token = getToken();
    //     console.log("🔑 Token utilizado:", token);

    //     if (!token) {
    //         const errorMessage = "Token de autenticación no encontrado";
    //         dispatch(setRolError(errorMessage));
    //         return { success: false, message: errorMessage };
    //     }

    //     if (!rol_id || (!se_id && !ge_id)) {
    //         const errorMessage = "Debe seleccionar un rol y una sede o geriátrico.";
    //         dispatch(setRolError(errorMessage));
    //         return { success: false, message: errorMessage };
    //     }

    //     if (se_id && ge_id) {
    //         const errorMessage = "Debe seleccionar solo una sede o geriátrico, no ambos.";
    //         dispatch(setRolError(errorMessage));
    //         return { success: false, message: errorMessage };
    //     }

    //     try {
    //         const payload = {
    //             rol_id,
    //             ...(se_id ? { se_id } : {}),
    //             ...(ge_id ? { ge_id } : {}),
    //         };

    //         console.log("📤 Payload final:", payload);

    //         const { data } = await geriatricoApi.post(
    //             "/roles/rolSeleccionado",
    //             payload,
    //             { headers: { Authorization: `Bearer ${token}` } }
    //         );

    //         console.log("✅ Respuesta exitosa:", data);

    //         // Guardar en Redux
    //         dispatch(setRolSeleccionado({ rol_id, se_id, ge_id }));

    //         return { success: true, message: data.message, data };
    //     } catch (error) {
    //         console.error("❌ Error en la petición:", error);

    //         const errorMessage = error.response?.data?.errors[0]?.msg || "Error al seleccionar rol";
    //         dispatch(setRolError(errorMessage));

    //         return { success: false, message: errorMessage };
    //     }
    // };

    return {
        crearRol,
        obtenerRoles,
        actualizarRol,
        obtenerRolesAsignados,
        seleccionarRol
    };
}
