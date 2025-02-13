import geriatricoApi from "../api/geriatricoApi";

export const useRoles = () => {
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
    

    return {
        crearRol,
        obtenerRoles,
        actualizarRol
    };
};
