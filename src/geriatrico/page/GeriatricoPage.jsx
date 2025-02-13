import { useEffect, useState } from "react";
import { useGeriatrico } from "../../hooks/useGeriatrico";
import { CargandoComponent, ModalCrearGeriatrico, ModalEditarGeriatrico, ModalGeriatrico } from "../components";
import { GoBackButton } from "../components/GoBackButton";
import '../../css/geriatrico.css';

export const GeriatricosPage = () => {
    const { obtenerGeriatricos, crearGeriatrico, actualizarGeriatrico } = useGeriatrico();
    const [geriatricos, setGeriatricos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedGeriatrico, setSelectedGeriatrico] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    useEffect(() => {
        const fetchGeriatricos = async () => {
            try {
                const result = await obtenerGeriatricos();
                if (result.success) {
                    setGeriatricos(result.geriatricos);
                } else {
                    setError(result.message);
                }
            } catch (error) {
                setError("Error al obtener los geriátricos",error);
            } finally {
                setLoading(false);
            }
        };
        fetchGeriatricos();
    }, []);

    const handleViewDetails = (geriatrico) => {
        setSelectedGeriatrico(geriatrico);
        setIsModalOpen(true);
    };

    const handleEditGeriatrico = (geriatrico) => {
        console.log("Editando geriátrico:", geriatrico); // Depuración

        if (!geriatrico || !geriatrico.ge_id) {
            console.error("No se encontró el ID del geriátrico al editar:", geriatrico);
            return;
        }

        setSelectedGeriatrico(geriatrico);
        setIsEditModalOpen(true);
    };


    const handleSaveGeriatrico = async (nuevoGeriatrico) => {
        const result = await crearGeriatrico(nuevoGeriatrico);
        if (result.success) {
            setGeriatricos([...geriatricos, result.geriatrico]);
        }
        return result;
    };

    const handleUpdateGeriatrico = async (ge_id, datosActualizados) => {
        console.log("Datos recibidos en handleUpdateGeriatrico -> ID:", ge_id, "Datos:", datosActualizados);

        if (!ge_id) {
            console.error("ID del geriátrico no válido:", ge_id);
            return;
        }

        const result = await actualizarGeriatrico(ge_id, datosActualizados);

        if (result.success) {
            setGeriatricos((prevGeriatricos) =>
                prevGeriatricos.map((g) => (g.ge_id === ge_id ? result.geriatrico : g))
            );
            setSelectedGeriatrico(result.geriatrico);
            setIsEditModalOpen(false);
        } else {
            console.error(result.message);
        }
    };


    if (loading) return <CargandoComponent />;
    if (error) return <p className="error">{error}</p>;

    const filteredGeriatricos = geriatricos.filter((geriatrico) =>
        geriatrico.ge_nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        geriatrico.ge_nit.toString().includes(searchTerm)
    );

    return (
        <div className="container-geriatrico">
            <GoBackButton />
            <div className="content-geriatrico">
                <div className="title-input">
                    <h1 className="title">Lista de Geriátricos</h1>
                    <input
                        type="text"
                        placeholder="Buscar por nombre o NIT..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />
                </div>
                <div className="grid">
                    {filteredGeriatricos.length > 0 ? (
                        filteredGeriatricos.map((geriatrico) => (
                            <div key={geriatrico.ge_nit} className="card">
                                <div className="card-content">
                                    <h2 className="geriatrico-name">{geriatrico.ge_nombre}</h2>
                                    <p className="geriatrico-nit">NIT: {geriatrico.ge_nit}</p>
                                    <div className="color-boxes">
                                        <span className="color-box" style={{ backgroundColor: geriatrico.ge_color_principal }}></span>
                                        <span className="color-box" style={{ backgroundColor: geriatrico.ge_color_secundario }}></span>
                                        <span className="color-box" style={{ backgroundColor: geriatrico.ge_color_terciario }}></span>
                                    </div>
                                    <img src={geriatrico.ge_logo} alt="Logo" className="geriatrico-logo" />
                                    <button className="details-button" onClick={() => handleViewDetails(geriatrico)}>Ver Detalles</button>
                                    <div className="actions">
                                        <button className="delete-button">
                                            <i className="fas fa-trash-alt" />
                                        </button>
                                        <button className="edit-button" onClick={() => handleEditGeriatrico(geriatrico)}>
                                            <i className="fas fa-edit" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="no-results">No se encontraron resultados</p>
                    )}
                    <div className="card" onClick={() => setIsCreateModalOpen(true)}>
                        <div className="card-content-i">
                                <i className="fas fa-plus" />
                            <p>Crear Geriatrico</p>
                        </div>
                    </div>
                </div>
            </div>

            <ModalGeriatrico
                geriatrico={selectedGeriatrico}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />

            <ModalCrearGeriatrico
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSave={handleSaveGeriatrico}
            />

            <ModalEditarGeriatrico
                geriatrico={selectedGeriatrico}
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                onUpdate={handleUpdateGeriatrico}
            />
        </div>
    );
};
