import React, { useEffect, useState } from "react";
import { useRoles } from "../../../hooks";
import { SelectFieldProps } from "./types";
import { usePersona } from "../../../hooks/usePersona";

export const SelectField = (props: SelectFieldProps) => {
    const { obtenerRoles } = useRoles();
    const { persona } = usePersona();
    const [roles, setRoles] = useState<{ value: string; label: string }[]>([]);

    useEffect(() => {
        const cargaRoles = async () => {
            try {
                const resp = await obtenerRoles();
                if (resp.success) {
                    const opciones = resp.roles
                        .filter((rol: any) => (persona?.id === 1 ? rol.rol_id === 2 : true))
                        .map((rol: any) => ({
                            value: rol.rol_id,
                            label: rol.rol_nombre,
                        }));
                    setRoles(opciones);
                } else {
                    console.error("Error al obtener roles:", resp.message);
                }
            } catch (error) {
                console.error("Error en la carga de roles:", error);
            }
        };

        if (persona) {
            cargaRoles();
        }
    }, [persona, obtenerRoles]);

    return (
        <div className="input-container-register">
            <label>{props.label}</label>
            <select
                className="custom-select-container"
                name={props.name}
                value={props.value || ""}
                onChange={props.onChange}
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
