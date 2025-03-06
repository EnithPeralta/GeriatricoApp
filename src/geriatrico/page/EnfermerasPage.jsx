import React, { useEffect, useState } from 'react'
import { useGeriatrico } from '../../hooks/useGeriatrico';
import { useEnfermera } from '../../hooks';

export const EnfermerasPage = () => {
    const [enfermeras, setEnfermeras] = useState([]);
    const { homeMiGeriatrico } = useGeriatrico();
    const [geriatrico, setGeriatrico] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { obtenerRolesEnfermerasSede } = useEnfermera();

    useEffect(() => {

        const fetchSede = async () => {
            try {
                setLoading(true);
                setError(null);
                const result = await homeMiGeriatrico();
                console.log("📡 Respuesta de la API:", result);
                if (result.success && result.geriatrico) {
                    setGeriatrico(result.geriatrico);
                } else {
                    setError("No se encontraron datos de la sede.");
                }
            } catch (err) {
                setError("Error al obtener los datos.");
            } finally {
                setLoading(false);
            }
        };
        fetchSede();
    }, [])

    useEffect(() => {
        const fetchEnfermeras = async () => {
            setLoading(true);
            setError(null);

            const response = await obtenerRolesEnfermerasSede();
            console.log(response);
            if (response.success) {
                setEnfermeras(response.data);
            } else {
                setError(response.message);
            }

            setLoading(false);
        }

        fetchEnfermeras();
    }, []);


    return (
        <div className="bodyPaciente" style={{ backgroundColor: geriatrico?.color_principal }}>
            <div className="background-circle-pacientes circle-left-pacientes" style={{ backgroundColor: geriatrico?.color_secundario }} ></div>
            <div className="background-circle-pacientes circle-right-pacientes" style={{ backgroundColor: geriatrico?.color_terciario }}></div>
            <div className="header-pacientes">
                <div className="app-name">Geriátrico App</div>
                <img src={geriatrico?.ge_logo} alt="Logo Geriatrico" height={150} width={150} />
            </div>
            <div className="container">
                <div className="cont">
                    <h1>Enfermeras</h1>
                    {loading ? (
                        <p>Cargando pacientes...</p>
                    ) : error ? (
                        <p className="error-message">{error}</p>
                    ) : (
                        enfermeras.length > 0 ? (
                            enfermeras.map((enfermera) => (
                                <div key={enfermera.enf_id} className="sede-card">
                                    <div className='sede-info'>
                                        <div className="full-name">{enfermera.nombre}</div>
                                        <div className="CC">{enfermera.enf_codigo}</div>
                                        <div className="CC">{enfermera.documento}</div>
                                        <div className="CC">{enfermera.fechaInicio} - {enfermera.fechaFin ? enfermera.fechaFin : 'Indefinido'}</div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p>No se encontraron enfermeras.</p>
                        )
                    )}</div>
            </div>
        </div>
    )
}
