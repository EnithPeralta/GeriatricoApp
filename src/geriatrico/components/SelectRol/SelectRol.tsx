import React, { useState, useEffect } from "react";
import { useRoles } from "../../../hooks";
import { Rol, SelectRolProps } from "./types";

export const SelectRol = (props: SelectRolProps) => {
    const [roles, setRoles] = useState<Rol[]>([]);
    const { obtenerRolesAsignados } = useRoles();
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchRoles = async () => {
            try {
                setLoading(true);
                const response = await obtenerRolesAsignados();
                if (response.success) {
                    setRoles(response.roles || []);
                    console.log(response.roles);
                } else {
                    setError(response.message);
                }
            } catch (err) {
                setError("Error al cargar los roles");
            } finally {
                setLoading(false);
            }
        };

        fetchRoles();
    }, []);

    return (
        <div className="custom-select-wrapper">
            <select 
                name={props.name} 
                value={props.value} 
                onChange={props.onChange} 
                className="custom-select"
            >
                <option value="" hidden>Seleccione un rol</option>
                {roles.map((rol) => (
                    <option 
                        key={`${rol.tipo}-${rol.rol_id}`} 
                        value={rol.rol_id}
                        // data-se_id={rol.se_id || undefined} // Solo se_id si existe
                        data-ge_id={rol.ge_id || undefined} // Solo ge_id si existe
                    >
                        {rol.se_nombre || rol.ge_nombre}
                    </option>
                ))}
            </select>
        </div>
    );
};
