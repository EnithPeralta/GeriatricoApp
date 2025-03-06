import { useEffect, useState } from "react";
import '../../css/pacientes.css';
import { usePaciente } from "../../hooks";
import { useGeriatrico } from "../../hooks/useGeriatrico";

export const PacientesPage = () => {
    const [pacientes, setPacientes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [pacienteSeleccionado, setPacienteSeleccionado] = useState(null);
    const [loadingDetalle, setLoadingDetalle] = useState(false);
    const { obtenerRolesPacientesSede, obtenerDetallePacienteSede } = usePaciente();
    const { homeMiGeriatrico } = useGeriatrico();
    const [geriatrico, setGeriatrico] = useState(null);

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
    }, []);


    useEffect(() => {
        const fetchPacientes = async () => {
            setLoading(true);
            setError(null);

            const response = await obtenerRolesPacientesSede();

            if (response.success) {
                setPacientes(response.data);
            } else {
                setError(response.message);
            }

            setLoading(false);
        };

        fetchPacientes();
    }, []);

    // Función para obtener los detalles de un paciente
    const handleVerDetalle = async (per_id) => {
        setLoadingDetalle(true);
        const response = await obtenerDetallePacienteSede(per_id);

        console.log(response);

        if (response.success) {
            setPacienteSeleccionado(response.paciente);
        } else {
            setError(response.message);
        }

        setLoadingDetalle(false);
    };

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
                    <h1>Pacientes</h1>

                    {loading ? (
                        <p>Cargando pacientes...</p>
                    ) : error ? (
                        <p className="error-message">{error}</p>
                    ) : (
                        pacientes.length > 0 ? (
                            pacientes.map((paciente, index) => (
                                <div
                                    key={index}
                                    className="sede-card"
                                    onClick={() => handleVerDetalle(paciente.per_id)} // Evento clic
                                >
                                    <div className="sede-info">
                                        <div className="full-name">{paciente.per_nombre}</div>
                                        <div className="CC">{paciente.per_documento}</div>
                                    </div>

                                </div>
                            ))
                        ) : (
                            <p>No hay pacientes registrados.</p>
                        )
                    )}

                    <button className="add-button-paciente">
                        <i className="fa-solid fa-plus"></i>
                    </button>
                </div>
            </div>

            {/* Modal para mostrar detalles del paciente */}
            {pacienteSeleccionado && (
                <div className="modal-overlay">
                    <div className="modal">
                        <div className="modal-content">
                            {loadingDetalle ? (
                                <p>Cargando detalles...</p>
                            ) : (
                                <div>
                                    <div className="modal-field">
                                        <label>Nombre</label>
                                        <input
                                            type="text"
                                            name="nombre"
                                            value={pacienteSeleccionado.nombre}
                                            readOnly
                                        />
                                    </div>
                                    <div className="modal-field">
                                        <label>Edad</label>
                                        <input
                                            type="text"
                                            name="edad"
                                            value={pacienteSeleccionado.edad}
                                            readOnly
                                        />
                                    </div>

                                    <div className="modal-field">
                                        <label>Peso</label>
                                        <input
                                            type="text"
                                            name="peso"
                                            value={pacienteSeleccionado.peso}
                                            readOnly
                                        />
                                    </div>
                                    <div className="modal-field">
                                        <label>Talla</label>
                                        <input
                                            type="text"
                                            name="talla"
                                            value={pacienteSeleccionado.talla}
                                            readOnly
                                        />
                                    </div>
                                    <div className="modal-field">
                                        <label>EPS</label>
                                        <input
                                            type="text"
                                            name="nombre_eps"
                                            value={pacienteSeleccionado.nombre_eps}
                                            readOnly
                                        />
                                    </div>
                                    <div className="modal-field">
                                        <label>Regimen EPS</label>
                                        <input
                                            type="text"
                                            name="regimen_eps"
                                            value={pacienteSeleccionado.regimen_eps}
                                            readOnly
                                        />
                                    </div>

                                    <div className="modal-field">
                                        <label>Grupo Sanguineo</label>
                                        <input
                                            type="text"
                                            name="rh_grupo_sanguineo"
                                            value={pacienteSeleccionado.rh_grupo_sanguineo}
                                            readOnly
                                        />
                                    </div>
                                    <div className="modal-img">
                                        <img src={pacienteSeleccionado.foto} alt="Foto del paciente" height={200} width={200} />
                                    </div>
                                </div>
                            )}
                            <button className="cancel" onClick={() => setPacienteSeleccionado(null)}>Cerrar</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
