import React, { useEffect, useState } from "react";
import { useRoles, useSession } from "../../../hooks";
import { SelectFieldProps } from "./types";

export const SelectField = (props: SelectFieldProps) => {
    const { obtenerRoles } = useRoles();
    const { session, obtenerSesion } = useSession();
    const [roles, setRoles] = useState<{ value: string; label: string }[]>([]);
    const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
    useEffect(() => {
        const cargaRoles = async () => {
            try {
                // Si session está vacío, intentar obtenerlo
                if (!session) {
                    console.log(session);
                    console.warn("🔄 Obteniendo sesión...");
                    await obtenerSesion(); 
                }
    
                // Si session sigue sin datos, detener ejecución
                if (!session?.per_id) {
                    console.error("⚠️ No se encontró la persona en la sesión.");
                    return;
                }
    
                const personaId = session.per_id;
    
                const resp = await obtenerRoles();
                if (resp.success) {
                    const opciones = resp.roles
                        .filter((rol: any) => 
                            personaId === 1 ? rol.rol_id === 2 : 
                            personaId === 2 ? rol.rol_id === 3 : 
                            personaId === 3 ? rol.rol_id !== 3 : 
                            true
                        )
                        .map((rol: any) => ({
                            value: rol.rol_id,
                            label: rol.rol_nombre,
                        }));
    
                    setRoles(opciones);
                } else {
                    console.error("❌ Error al obtener roles:", resp.message);
                }
            } catch (error) {
                console.error("❌ Error en la carga de roles:", error);
            }
        };
    
        if (session) {
            cargaRoles();
        }
    }, [session, obtenerRoles, obtenerSesion]);
    
    /** Maneja los cambios en los checkboxes */
    const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value, checked } = event.target;

        let updatedRoles = checked
            ? [...selectedRoles, value]
            : selectedRoles.filter((role) => role !== value);

        setSelectedRoles(updatedRoles);

        // Llamar `onChange` con los roles seleccionados
        if (props.onChange) {
            props.onChange(updatedRoles);
        }
    };

    return (
        <div className="">
            <label>{props.label}</label>
            <div className="checkbox-group">
                {roles.map((rol) => (
                    <label key={rol.value} className="checkbox-label">
                        <input
                            type="checkbox"
                            name={props.name}
                            value={rol.value}
                            checked={selectedRoles.includes(String(rol.value))}
                            onChange={handleCheckboxChange} // Llama a la función al cambiar
                        />
                        {rol.label}
                    </label>
                ))}
            </div>
        </div>
    );
};
