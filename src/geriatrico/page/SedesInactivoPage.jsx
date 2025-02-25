import '../../css/geriatrico.css';
import { useEffect, useState } from "react";
import { CargandoComponent, ModalEditarGeriatrico } from "../components";
import { GoBackButton } from "../components/GoBackButton";
import Swal from "sweetalert2"; 
import { useSede } from '../../hooks/useSede';

export const SedesInactivoPage = () => {
    const { obtenerSedesInactive, reactivarSedes} = useSede();
    const [sedesInactive, setSedesInactive] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedSedes, setSelectedSedes] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

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
                Swal.fire("Reactivado", "La sede ha sido reactivado correctamente.", "success");
                setSedesInactive((prev) => prev.filter(s => s.se_id !== se_id)); // Remueve el geriátrico de la lista
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
                {sedesInactive.length > 0 ? (
                    sedesInactive.map((sede) => (
                        <div key={sede.se_id} className="card">
                            <div className="card-content">
                                <h2 className="geriatrico-name">{sede.se_nombre}</h2>
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
                    
                    <p className="no-results">No hay sedes inactivos</p>
                )}
            </div>
            <ModalEditarGeriatrico
                geriatrico={selectedSedes}
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
            />
        </div>
    );
};
