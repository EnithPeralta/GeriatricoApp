import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import '../../css/geriatrico.css';
import { GoBackButton } from "../components";
import { setRolSeleccionado } from "../../store/geriatrico/rolSlice";
import { SedeModal } from "../components/ModalSedes/SedeModal";
import Swal from "sweetalert2";
import { useSede } from "../../hooks/useSede";
import { useNavigate } from "react-router-dom";


export const SedesPage = () => {
    const { obtenerSedesGeriatrico, inactivarSedes } = useSede();
    const [sedes, setSedes] = useState([]);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [sedeToEdit, setSedeToEdit] = useState(null);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const rolSeleccionado = useSelector((state) => state.roles?.rolSeleccionado ?? null);
    const [loaded, setLoaded] = useState(false); // Evita múltiples llamadas

    useEffect(() => {
        const storedRolId = localStorage.getItem("rol_id");
        const storedGeId = localStorage.getItem("ge_id");

        if (!rolSeleccionado && storedRolId) {
            dispatch(setRolSeleccionado({ rol_id: Number(storedRolId), ge_id: storedGeId ? Number(storedGeId) : null }));
        }
    }, [dispatch, rolSeleccionado]);

    useEffect(() => {
        if (rolSeleccionado && !loaded) {
            setLoaded(true); // Evita múltiples llamadas
            console.log("Ejecutando obtenerSedesGeriatrico con rol_id:", rolSeleccionado.rol_id);

            obtenerSedesGeriatrico(Number(rolSeleccionado.rol_id))
                .then(response => {
                    console.log("Respuesta de obtenerSedesGeriatrico:", response);
                    if (response.success) {
                        setSedes(response.sedes);
                    } else {
                        setError(response.message);
                    }
                })
                .catch(error => {
                    console.error("Error en obtenerSedesGeriatrico:", error);
                    setError("Error obteniendo sedes");
                });
        }
    }, [rolSeleccionado]); // Eliminamos `obtenerSedesGeriatrico` de las dependencias

    const handleOpenModal = (sede = null) => {
        setSedeToEdit(sede);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSedeToEdit(null);
    };

    const handleSaveSede = (newSede) => {
        setSedes((prev) => [...prev, newSede]);
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
                    Swal.fire("Inactivado", "La sede ha sido inactivada correctamente.", "success");
                    setSedes(prev => prev.filter(s => s.se_id !== se_id)); // Remueve la sede de la lista
                } else {
                    Swal.fire("Error", result.message, "error");
                }
            } catch (error) {
                Swal.fire("Error", "No se pudo inactivar la sede", "error");
            }
        }
    };


    const filteredSedes = sedes.filter((sede) =>
        sede.se_nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sede.se_direccion.toString().includes(searchTerm)
    ); // Filtra las sedes

    return (
        <div className="container-geriatrico">
            <GoBackButton />
            <div className="content-geriatrico">
                <div className="titulo-input">
                    <h1 className="titulo">Lista de Sedes</h1>
                    <button className="button-geriatrico" onClick={() => navigate("/geriatrico/sedesInactivos")}>
                        Sedes Inactivos
                    </button>
                    <button className="button" onClick={()=>navigate("/register")}>
                        Registrar 
                    </button>
                    
                    <button className="button" onClick={()=>navigate("/geriatrico/gestionarPersonas")}>
                        Ver Personas 
                    </button>
                    <input
                        type="text"
                        placeholder="Buscar por nombre o dirección..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />
                </div>
                <div className="grid">
                    {filteredSedes.length > 0 ? (
                        filteredSedes.map((sede, index) => (
                            <div key={index} className={`card ${sede.se_activo ? 'active' : 'inactive'}`}>
                                <div className="card-content">
                                    <div className="">
                                        {sede.se_foto ? (
                                            <img className="geriatrico-logo" src={sede.se_foto} alt={`Foto de la sede ${sede.se_nombre}`} />
                                        ) : (
                                            <i className="fa-solid fa-hospital"></i>
                                        )}
                                    </div>
                                    <div className="geriatrico-name">{sede.se_nombre}</div>
                                    <div className="geriatrico-nit">{sede.se_direccion}</div>
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
                        <p>No hay sedes registradas</p>
                    )}
                    <div className="card" onClick={() => setIsModalOpen(true)}>
                        <div className="card-content-i">
                            <i className="fas fa-plus" />
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
        </div>
    );
};
