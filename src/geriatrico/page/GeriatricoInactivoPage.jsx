import '../../css/geriatrico.css';
import { useEffect, useState } from "react";
import { useGeriatrico } from "../../hooks/useGeriatrico";
import { CargandoComponent, ModalEditarGeriatrico } from "../components";
import { GoBackButton } from "../components/GoBackButton";
import Swal from "sweetalert2"; // Importamos SweetAlert2 para las alertas

export const GeriatricoInactivoPage = () => {
    const { obtenerGeriatricosInactivos, actualizarGeriatrico, reactivarGeriatrico } = useGeriatrico();
    const [geriatricoInactive, setGeriatricoInactive] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedGeriatrico, setSelectedGeriatrico] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    useEffect(() => {
        const fetchGeriatricosInactivos = async () => {
            try {
                const result = await obtenerGeriatricosInactivos();
                if (result.success && Array.isArray(result.geriatricos)) {
                    setGeriatricoInactive(result.geriatricos);
                } else {
                    setError(result.message || "Error desconocido al obtener los datos");
                }
            } catch (error) {
                setError("Error al obtener los geriátricos inactivos");
            } finally {
                setLoading(false);
            }
        };
        fetchGeriatricosInactivos();
    }, []);

    const handleReactivarGeriatrico = async (ge_id) => {
        const confirm = await Swal.fire({
            title: "¿Reactivar Geriátrico?",
            text: "¿Estás seguro de que deseas reactivar este geriátrico?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sí, reactivar",
            cancelButtonText: "Cancelar"
        });

        if (confirm.isConfirmed) {
            const result = await reactivarGeriatrico(ge_id);

            if (result.success) {
                Swal.fire("Reactivado", "El geriátrico ha sido reactivado correctamente.", "success");
                setGeriatricoInactive((prev) => prev.filter(g => g.ge_id !== ge_id)); // Remueve el geriátrico de la lista
            } else {
                Swal.fire("Error", result.message, "error");
            }
        }
    };

    if (loading) return <CargandoComponent />;
    if (error) return <p className="error">{error}</p>;

    return (
        <div className="container-geriatrico">
            <GoBackButton />
            <h1 className="title">Geriátricos Inactivos</h1>
            <div className="grid">
                {geriatricoInactive.length > 0 ? (
                    geriatricoInactive.map((geriatrico) => (
                        <div key={geriatrico.ge_id} className="card">
                            <div className="card-content">
                                <h2 className="geriatrico-name">{geriatrico.ge_nombre}</h2>
                                <div className="actions">
                                    <button
                                        className={`toggle-button ${geriatrico.ge_activo ? 'active' : 'inactive'}`}
                                        onClick={() => handleReactivarGeriatrico(geriatrico.ge_id)}>
                                        <i className={`fas ${geriatrico.ge_activo ? 'fa-toggle-on' : 'fa-toggle-off'}`} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    
                    <p className="no-results">No hay geriátricos inactivos</p>
                )}
            </div>
            <ModalEditarGeriatrico
                geriatrico={selectedGeriatrico}
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
            />
        </div>
    );
};
