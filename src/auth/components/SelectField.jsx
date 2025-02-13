import { useEffect, useState } from "react";
import { useRoles, useAuthStore } from "../../hooks";

export const SelectField = ({ label, name, value, onChange }) => {
    const { obtenerRoles } = useRoles();
    const { user } = useAuthStore(); // Obtener datos del usuario autenticado
    const [roles, setRoles] = useState([]);

    useEffect(() => {
        const cargaRoles = async () => {
            try {
                const resp = await obtenerRoles();
                if (resp.success) {
                    let opciones = resp.roles.map((rol) => ({
                        value: rol.rol_id,
                        label: rol.rol_nombre,
                    }));

                    // Si el usuario NO es Super Administrador (ID "0"), ocultar "Administrador de Geriátrico"
                    if (user?.rol_id !== "0") {
                        opciones = opciones.filter(rol => rol.label !== "Administrador de geriátrico");
                    }

                    setRoles(opciones);
                } else {
                    console.error("Error al obtener roles:", resp.message);
                }
            } catch (error) {
                console.error("Error en la carga de roles:", error);
            }
        };
        cargaRoles();
    }, [user]);

    return (
        <div className="input-container-register">
            <label>{label}</label>
            <select
                className="input-wrapper"
                name={name}
                value={value || ""} // Evita valores undefined
                onChange={onChange}
            >
                <option value="">Seleccione un rol</option>
                {roles.map((rol) => (
                    <option key={rol.value} value={rol.value}>
                        {rol.label}
                    </option>
                ))}
            </select>
        </div>
    );
};
