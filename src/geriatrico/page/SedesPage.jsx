import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "../../css/geriatrico.css";
import { setRolSeleccionado } from "../../store/geriatrico/rolSlice";
import { SedeModal } from "../components/ModalSedes/SedeModal";
import Swal from "sweetalert2";
import { useSede } from "../../hooks/useSede";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../hooks";
import { SedeDetalle } from "../components/ModalSedes/SedeDetalle";
import { useGeriatrico } from "../../hooks/useGeriatrico";
import { CargandoComponent } from "../components";

export const SedesPage = () => {
    const { obtenerSedesGeriatrico, inactivarSedes, obtenerDetalleSede } = useSede();
    const { homeMiGeriatrico } = useGeriatrico();
    const { startLogout } = useAuthStore();
    const [sedes, setSedes] = useState([]);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalOpens, setIsModalOpens] = useState(false);
    const [sedeToEdit, setSedeToEdit] = useState(null);
    const [selectedSede, setSelectedSede] = useState(null);
    const [geriatrico, setGeriatrico] = useState(null);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const rolSeleccionado = useSelector(state => state.roles?.rolSeleccionado ?? null);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        const storedRolId = localStorage.getItem("rol_id");
        const storedGeId = localStorage.getItem("ge_id");

        if (!rolSeleccionado && storedRolId) {
            dispatch(setRolSeleccionado({ rol_id: Number(storedRolId), ge_id: storedGeId ? Number(storedGeId) : null }));
        }
    }, [dispatch, rolSeleccionado]);


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
        if (rolSeleccionado && !loaded) {
            setLoaded(true);
            obtenerSedesGeriatrico(Number(rolSeleccionado.rol_id))
                .then(response => {
                    if (response.success) {
                        setSedes(response.sedes);
                    } else {
                        setError(response.message);
                    }
                })
                .catch(() => setError("Error obteniendo sedes"));
        }
    }, [rolSeleccionado]);

    const handleOpenModal = (sede = null) => {
        setSedeToEdit(sede ?? null);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSedeToEdit(null);
    };

    const handleSaveSede = (newSede) => {
        setSedes(prev => [...prev, newSede]);
    };

    const handleInactivarSedes = async (se_id) => {
        const confirm = await Swal.fire({
            text: "¿Estás seguro de que deseas inactivar la sede?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sí, Inactivar",
            cancelButtonText: "Cancelar"
        });

        if (confirm.isConfirmed) {
            try {
                const result = await inactivarSedes(se_id);
                if (result.success) {
                    Swal.fire({
                        icon: "success",
                        text: "La sede ha sido inactivada correctamente.",
                    });
                    setSedes(prev => prev.filter(s => s.se_id !== se_id));
                } else {
                    Swal.fire(result.message, "error");
                }
            } catch {
                Swal.fire("No se pudo inactivar la sede", "error");
            }
        }
    };

    const filteredSedes = sedes.filter(sede =>
        sede.se_nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sede.se_direccion.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleDetalles = async (se_id) => {
        try {
            const result = await obtenerDetalleSede(se_id);
            if (result.success) {
                setSelectedSede(result.sede);
                setIsModalOpens(true);
            } else {
                console.log(result);
            }
        } catch (error) {
            console.error(error);
        }
    }

    if (loaded) {
        return <CargandoComponent />;
    }
    return (
        <div className="flex" style={{ backgroundColor: geriatrico?.color_principal }}>
            <div className="sidebar" style={{ backgroundColor: geriatrico?.color_secundario }}>
                <img src={geriatrico?.ge_logo} alt="Logo" style={{ width: "100px", height: "100px", padding: "10px" }} />
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
                    <div className="icon" onClick={() => navigate("/geriatrico/profile")}>
                        <i className="fa-solid fa-user" />
                        <span className="icon-text">Perfil</span>
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

            <div className="main-content">
                <input type="text"
                    placeholder="Buscar por nombre o dirección..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input" />
                <div className="grid">
                    {filteredSedes.length > 0 ? (
                        filteredSedes.map((sede) => (
                            <div key={sede.se_id} className={`card-item ${sede.se_activo ? 'active' : 'inactive'}`}>
                                <div className="grid-item">
                                    {sede.se_foto ? (
                                        <img className="" src={sede.se_foto} alt={`${sede.se_nombre}`} width="100" height="100" />
                                    ) : (
                                        <i className="fa-solid fa-hospital" />
                                    )}
                                    <span >{sede.se_nombre}</span>
                                    <span>{sede.se_direccion}</span>
                                    <div className="status-icon-sedes">
                                        {sede.se_activo ? (
                                            <i className="fa-solid fa-circle-check activo"></i>
                                        ) : (
                                            <i className="fa-solid fa-circle-xmark inactivo"></i>
                                        )}
                                    </div>
                                    <button className="details-button" onClick={() => handleDetalles(sede.se_id)} >
                                        Ver Mas
                                    </button>
                                    <div className="actions">
                                        <button
                                            className={`toggle-button ${sede.se_activo ? 'active' : 'inactive'}`}
                                            onClick={() => handleInactivarSedes(sede.se_id)}
                                        >
                                            <i className={`fas ${sede.se_activo ? 'fa-toggle-on' : 'fa-toggle-off'}`} />
                                        </button>

                                        <div className="edit-button-sedes" onClick={() => handleOpenModal(sede)}>
                                            <i className="fas fa-edit"></i>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        ))
                    ) : (
                        <p>No se encontraron sedes.</p>
                    )}
                    <div className="grid-item" onClick={() => setIsModalOpen(true)}>
                        <div className="grid-item-add">
                            <i className="fas fa-circle-plus" />
                            <p>Crear Sedes</p>
                        </div>
                    </div>
                </div>
            </div>
            <SedeModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSave={handleSaveSede}
                sede={sedeToEdit}
            />
            <SedeDetalle
                sedeDetalle={selectedSede}
                isOpens={isModalOpens}
                onClose={() => setIsModalOpens(false)}
            />
        </div>
    );
};
