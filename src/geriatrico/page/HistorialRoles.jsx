import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; // Importa useParams para obtener el ID de la URL
import { useRoles } from "../../hooks";

export const HistorialRoles = () => {
    const { id } = useParams(); // Obtiene el ge_id de la URL
    const [historial, setHistorial] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { obtenerHistorialRoles } = useRoles();

    useEffect(() => {
        const cargarHistorial = async () => {
            setLoading(true);
            setError(null);
            const response = await obtenerHistorialRoles({ ge_id: id }); // Usa el ge_id dinámico
            console.log(response);
            if (response.success) {
                setHistorial(response.data);
            } else {
                setError(response.message);
            }
            setLoading(false);
        };

        if (id) {
            cargarHistorial();
        }
    }, [id]);

    if (loading) return <p>Cargando historial de roles...</p>;
    if (error) return <p>Error: {error}</p>;
    if (historial.length === 0) return <p>No hay historial de roles disponible.</p>;

    return (
        <div>
            {historial.map((persona, index) => (
                <div key={index} style={{ border: "1px solid #ccc", padding: "10px", marginBottom: "10px" }}>
                    <p><strong>Teléfono:</strong> {persona.per_telefono}</p>
                    <p><strong>Correo:</strong> {persona.per_correo}</p>
                    <p><strong>Fecha Vinculación:</strong> {persona.gp_fecha_vinculacion}</p>
                    <p><strong>Estado:</strong> {persona.gp_activo ? "Activo" : "Inactivo"}</p>

                    <h4>Roles en Geriátrico</h4>
                    {persona.rolesGeriatrico.length > 0 ? (
                        <ul>
                            {persona.rolesGeriatrico.map((rol) => (
                                <li key={rol.rol_id}>
                                    {rol.rol_nombre} ({rol.rol_activo ? "Activo" : "Inactivo"}) - Inicio: {rol.fechaInicio} - Fin: {rol.fechaFin || "Presente"}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No tiene roles en geriátrico.</p>
                    )}

                    <h4>Roles en Sede</h4>
                    {persona.rolesSede.length > 0 ? (
                        <ul>
                            {persona.rolesSede.map((rol, index) => (
                                <li key={index}>
                                    {rol.rol_nombre} ({rol.rol_activo ? "Activo" : "Inactivo"}) - {rol.se_nombre} - Inicio: {rol.fechaInicio} - Fin: {rol.fechaFin || "Presente"}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No tiene roles en sede.</p>
                    )}
                </div>
            ))}
        </div>
    );
};
