import '../../css/geriatrico.css';
import { useEffect, useState } from "react";
import { CargandoComponent } from "../components";
import Swal from "sweetalert2";
import { useSede } from '../../hooks/useSede';
import { useAuthStore } from '../../hooks';
import { useNavigate } from 'react-router-dom';
import { useGeriatrico } from '../../hooks/useGeriatrico';

export const SedesInactivoPage = () => {
    const { obtenerSedesInactive, reactivarSedes } = useSede();
    const [geriatrico, setGeriatrico] = useState(null);
    const [loaded, setLoaded] = useState(false);
    const {homeMiGeriatrico} = useGeriatrico();
    const navigate = useNavigate();
    const [sedesInactive, setSedesInactive] = useState([]);
    const { startLogout } = useAuthStore();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedSedes, setSelectedSedes] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    useEffect(() => {
        const fetchSede = async () => {
            try {
                setLoaded(true);
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
                setLoaded(false);
            }
        };
        fetchSede();
    }, []);
   

    useEffect(() => {
        const fetchSedesInactivos = async () => {
            try {
                const result = await obtenerSedesInactive();
                if (result.success && Array.isArray(result.sedes)) {
                    setSedesInactive(result.sedes);
                } else {
                    setError(result.message || "Error desconocido al obtener los datos");
                }
            } catch (error) {
                setError("Error al obtener las sedes inactivos");
            } finally {
                setLoading(false);
            }
        };
        fetchSedesInactivos();
    }, []);


    const handleReactivarSedes = async (se_id) => {
        const confirm = await Swal.fire({
            text: "¿Estás seguro de que deseas reactivar este sedes?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sí, reactivar",
            cancelButtonText: "Cancelar"
        });

        if (confirm.isConfirmed) {
            const result = await reactivarSedes(se_id);

            if (result.success) {
                Swal.fire("La sede ha sido reactivado correctamente.", "success");
                setSedesInactive((prev) => prev.filter(s => s.se_id !== se_id)); // Remueve el geriátrico de la lista
            } else {
                Swal.fire(result.message, "error");
            }
        }
    };

    if (loading) return <CargandoComponent />;

    return (
        <div className="flex" style={{ backgroundColor: geriatrico?.color_principal }}>
        <div className="sidebar" style={{ backgroundColor: geriatrico?.color_secundario }}>
            <img src={geriatrico?.ge_logo} alt="Logo" style={{ width: "100px", height: "100px" }} />
                <div className="icons">
                    <div className="icon" onClick={() => navigate("/geriatrico/home")}>
                        <i className="fa-solid fa-house-user" />
                        <span className="icon-text">Inicio</span>
                    </div>
                    <div className="icon" onClick={() => navigate("/geriatrico/sedes")}>
                        <i className="fa-solid fa-building" />
                        <span className="icon-text">Sedes Activas</span>
                    </div>
                    <div className="icon" onClick={() => navigate("/geriatrico/sedesInactivos")}>
                        <i className="fa-solid fa-building" />
                        <span className="icon-text">Sedes Inactivos</span>
                    </div>
                    <div className="icon" onClick={() => navigate("/register")}>
                        <i className="fa-solid fa-user-plus" />
                        <span>Registrar</span>
                    </div>
                    <div className="icon" onClick={() => navigate("/geriatrico/gestionarPersonas")}>
                        <i className="fa-solid fa-users" />
                        <span className="icon-text">Ver Personas</span>
                    </div>
                    <div className="icon" onClick={startLogout}  >
                        <i className="fa-solid fa-right-from-bracket" />
                        <span className="icon-text">Salir</span>
                    </div>
                </div>
            </div>
            <div className='main-content'>
                <input type="text"
                    placeholder="Buscar por nombre o dirección..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input" />
                <div className="grid">
                    {sedesInactive.length > 0 ? (
                        sedesInactive.map((sede) => (
                            <div key={sede.se_id} className={`card-item ${sede.se_activo ? 'active' : 'inactive'}`} >
                                <div className="grid-item">
                                    {sede.se_foto ? (
                                        <img className="" src={sede.se_foto} alt={`${sede.se_nombre}`} width="100" height="100" />
                                    ) : (
                                        <i className="fa-solid fa-hospital" />
                                    )}
                                    <span>{sede.se_nombre}</span>
                                    <span>{sede.se_direccion}</span>
                                    <span>{sede.geriatrico.ge_nit}</span>
                                    <div className='status-icon'>
                                        {sede.se_activo ? (
                                            <i className='fa-solid fa-circle-check activo' />) :
                                            (<i className='fa-solid fa-circle-xmark inactivo' />)
                                        }
                                    </div>
                                    <div className="actions">
                                        <button
                                            className={`toggle-button ${sede.se_activo ? 'active' : 'inactive'}`}
                                            onClick={() => handleReactivarSedes(sede.se_id)}>
                                            <i className={`fas ${sede.se_activo ? 'fa-toggle-on' : 'fa-toggle-off'}`} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className='grid-item'>
                            <i className="fa-solid fa-hospital" />
                            <p className="no-results">No hay sedes inactivos</p>
                        </div>
                    )}
                </div>
            </div>
        </div>

    );
};
