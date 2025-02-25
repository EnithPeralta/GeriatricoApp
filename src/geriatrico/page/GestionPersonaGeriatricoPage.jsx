import { useEffect, useState } from "react";
import { useGeriatricoPersona } from "../../hooks/useGeriatricoPersona";
import { usePersona, useSedesRol } from "../../hooks";
import { GoBackButton } from "../components/GoBackButton";
import Swal from "sweetalert2";
import { SelectField } from "../../auth/components/SelectField/SelectField";
import { SelectSede } from "../components/SelectSede/SelectSede";

export const GestionPersonaGeriatricoPage = () => {
    const [personas, setPersonas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const { personasVinculadasActivasMiGeriatrico } = useGeriatricoPersona();
    const { updatePerson } = usePersona();
    const { asignarRolAdminSede } = useSedesRol();
    const [activeCard, setActiveCard] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedPersona, setSelectedPersona] = useState(null);
    const [showAssignCard, setShowAssignCard] = useState(false);
    const [fechaInicio, setFechaInicio] = useState("");
    const [fechaFin, setFechaFin] = useState("");
    const [assigning, setAssigning] = useState(false);
    const [selectedRoles, setSelectedRoles] = useState([]);
    const [selectedSedes, setSelectedSedes] = useState("");
    const [editedPersona, setEditedPersona] = useState({
        usuario: "",
        nombre: "",
        correo: "",
        telefono: "",
        genero: "",
        password: "",
        per_foto: "",
    });
    const [roles, setRoles] = useState({ rolesGeriatrico: [], rolesSede: [] });

    useEffect(() => {
        const fetchPersonas = async () => {
            setLoading(true);
            try {
                const response = await personasVinculadasActivasMiGeriatrico();
                if (response.success) {
                    setPersonas(response.personas);
                } else {
                    setError(response.message);
                }
            } catch (err) {
                setError("Error al obtener los datos.");
            } finally {
                setLoading(false);
            }
        };
        fetchPersonas();
    }, []);

    // Filtrar personas por nombre o documento
    const personasFiltradas = personas.filter(persona =>
        persona?.per_nombre?.toLowerCase()?.includes(search.toLowerCase()) ||
        persona?.per_documento?.includes(search)
    );

    const handleCardClick = async (persona) => {
        console.log("Persona seleccionada:", persona);
    
        const isActive = activeCard === persona.per_id ? null : persona.per_id;
        setActiveCard(isActive);
    
        if (isActive) {
            try {
                const response = await personasVinculadasActivasMiGeriatrico({ per_id: persona.per_id });
                console.log("Respuesta de la API:", response);
    
                if (!response.personas) {
                    console.warn("⚠️ La API no devolvió personas.");
                    return;
                }
    
                let personaData;
                if (Array.isArray(response.personas)) {
                    // Si es un array, buscamos la persona correcta
                    personaData = response.personas.find(p => p.per_id === persona.per_id);
                } else {
                    // Si es un objeto, accedemos por ID
                    personaData = response.personas[persona.per_id];
                }
    
                if (!personaData) {
                    console.warn(`⚠️ No se encontraron datos para persona con ID ${persona.per_id}`);
                    return;
                }
    
                console.log("Datos de la persona:", personaData);
    
                setRoles({
                    rolesGeriatrico: personaData.rolesGeriatrico || [],
                    rolesSede: personaData.rolesSede || []
                });
    
            } catch (error) {
                console.error("Error al obtener roles:", error);
            }
        }
    };
    
    const openAssignCard = (persona) => {
        setShowAssignCard(true);
        setSelectedPersona(persona);
    };

    const handleAssignRole = async () => {
        if (!selectedPersona || selectedSedes.length === 0 || selectedRoles.length === 0 || !fechaInicio) {
            console.log("Validación fallida: ", selectedRoles, selectedSedes, selectedPersona, fechaInicio, fechaFin);
            Swal.fire({
                icon: "error",
                text: "Debe seleccionar al menos una sede y un rol, y definir la fecha de inicio.",
            });
            return;
        }
        setAssigning(true);
        try {
            for (let rol_id of selectedRoles) {
                const response = await asignarRolAdminSede({
                    per_id: selectedPersona.per_id,
                    se_id: Number(selectedSedes),
                    rol_id: rol_id,
                    sp_fecha_inicio: fechaInicio,
                    sp_fecha_fin: fechaFin || null,
                });
                console.log("Respuesta del servidor:", response);
                if (!response.success) {
                    throw new Error(response.message);
                }
            }
            Swal.fire({
                icon: "success",
                title: "Rol asignado exitosamente",
            });
            resetForm();
        } catch (error) {
            console.error("Error al asignar rol:", error);
            Swal.fire({
                icon: "error",
                text: error.message || "Error al asignar rol",
            });
        } finally {
            setAssigning(false);
        }
    };

    const resetForm = () => {
        setShowAssignCard(false);
        setSelectedPersona(null);
        setSelectedRoles([]);
        setSelectedSedes("");
        setFechaInicio("");
        setFechaFin("");
    };

    const openEditModal = (persona) => {
        setEditedPersona({
            id: persona.per_id,
            usuario: persona.per_usuario || "",
            nombre: persona.per_nombre || "",
            correo: persona.per_correo || "",
            telefono: persona.per_telefono || "",
            genero: persona.per_genero || "",
            password: "", // No se debe prellenar la contraseña por seguridad
            per_foto: persona.per_foto || "",
        });
        setShowEditModal(true);
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditedPersona(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setEditedPersona(prev => ({ ...prev, per_foto: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();

        if (!editedPersona) return;

        const personaActualizada = {
            per_id: editedPersona.id,
            per_usuario: editedPersona.usuario,
            per_nombre_completo: editedPersona.nombre,
            per_correo: editedPersona.correo,
            per_telefono: editedPersona.telefono,
            per_genero: editedPersona.genero,
            per_password: editedPersona.password,
            per_foto: editedPersona.per_foto
        };

        console.log("Datos enviados corregidos:", personaActualizada);

        const result = await updatePerson(personaActualizada.per_id, personaActualizada);

        console.log("Respuesta del servidor:", result);

        if (result.success) {
            setPersonas(prev => prev.map(p => (p.per_id === result.persona.per_id ? result.persona : p)));
            setShowEditModal(false);
            Swal.fire({
                icon: 'success',
                text: 'Persona actualizada exitosamente',
            });
        } else {
            console.error(result.message);
            Swal.fire({
                icon: 'error',
                text: result.message,
            });
        }
    };

    return (
        <div className="bodyAsignar">
            <GoBackButton />
            <div className="container-asignar">
                <div className="layout-asignar">
                    <div className="content-asignar">
                        <h2 className="title-asignar">Personas Vinculadas</h2>
                        <div className="search-bar-asignar">
                            <input
                                type="text"
                                className="search-input-asignar"
                                placeholder="Buscar por nombre o documento..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        {loading ? (
                            <div className="loader"></div>
                        ) : error ? (
                            <div className="error">{error}</div>
                        ) : (
                            <div className="">
                                {personasFiltradas.map(persona => (
                                    <div
                                        key={persona.per_id}
                                        className={`sede-card-asignar ${activeCard === persona.per_id ? "active" : ""}`}
                                        onClick={() => handleCardClick(persona)}>
                                        <div className="sede-info">
                                            <div className="full-name">{persona.per_nombre}</div>
                                            <div className="CC">{persona.per_usuario}</div>
                                            <div className="CC">{persona.per_documento}</div>
                                            <div className="CC">{persona.gp_fecha_vinculacion}</div>
                                        </div>

                                        <button className="inactive-button-asignar"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                            }}>
                                            <i className="fa-solid fa-user-slash" />
                                        </button>

                                        <button
                                            className="edit-button-asignar"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                openEditModal(persona);
                                            }}
                                        >
                                            <i className="fa-solid fa-user-pen i-asignar"></i>
                                        </button>

                                        <button
                                            className="add-button-asignar"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                openAssignCard(persona);
                                            }}
                                        >
                                            <i className="fas fa-arrow-up i-asignar"></i>
                                        </button>
                                    </div>
                                ))}

                                {activeCard && (
                                    <div className="sede-card-asignar">
                                        {roles.rolesGeriatrico.length > 0 || roles.rolesSede.length > 0 ? (
                                            <>
                                                {roles.rolesGeriatrico.length > 0 && (
                                                    <div className="sede-info">
                                                        {roles.rolesGeriatrico.map((rol, index) => (
                                                            <div key={index}>
                                                                <div className="full-name">{rol.nombre}</div>
                                                                <div className="CC">{rol.geriatrico.nit}</div>
                                                                <div className="CC">{rol.geriatrico.nombre}</div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                                {roles.rolesSede.length > 0 && (
                                                    <div>
                                                        {roles.rolesSede.map((rol, index) => (
                                                            <div key={index}>
                                                                <div className="full-name">{rol.fechaInicio}</div>
                                                                <div className="CC">{rol.sede?.nombre}</div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </>
                                        ) : (
                                            <div className="no-roles">⚠️ No tiene roles asignados.</div>
                                        )}
                                    </div>
                                )}

                                {showAssignCard && selectedPersona?.per_id && (
                                    <div className="sede-card-asignar">
                                        <SelectField name="rol_id" value={selectedRoles} onChange={(roles) => setSelectedRoles(roles.map(Number))} />
                                        <SelectSede name="se_id" value={selectedSedes} onChange={(e)=> setSelectedSedes(Number(e.target.value))} />
                                        <div className="form-group">
                                            <label>Fecha de Inicio:</label>
                                            <input
                                                type="date"
                                                value={fechaInicio}
                                                className="date-input"
                                                onChange={(e) => setFechaInicio(e.target.value)}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Fecha de Fin (opcional):</label>
                                            <input
                                                type="date"
                                                className="date-input"
                                                value={fechaFin}
                                                onChange={(e) => setFechaFin(e.target.value)}
                                            />
                                        </div>
                                        <button className="asignar-button" onClick={handleAssignRole} disabled={assigning}>
                                            {assigning ? "Asignando..." : "Asignar"}
                                        </button>
                                    </div>
                                )}

                                {showEditModal && editedPersona && (
                                    <div className="modal">
                                        <div className="modal-content">
                                            <h3>Editar Persona</h3>
                                            <form onSubmit={handleEditSubmit}>
                                                <div className="modal-picture">
                                                    {editedPersona.per_foto ? (
                                                        <img src={editedPersona.per_foto} alt="Foto de perfil" className="modal-img" />
                                                    ) : (
                                                        <i className="fas fa-user-circle"></i>
                                                    )}
                                                </div>

                                                <label className="modal-label">Cambiar foto:</label>
                                                <input className="modal-input" type="file" name="foto" accept="image/*" onChange={handleFileChange} />

                                                <label className="modal-label">Usuario:</label>
                                                <input className="modal-input" type="text" name="usuario" value={editedPersona.usuario} onChange={handleEditChange} required />

                                                <label className="modal-label">Nombre Completo:</label>
                                                <input className="modal-input" type="text" name="nombre" value={editedPersona.nombre} onChange={handleEditChange} required />

                                                <label className="modal-label">Correo:</label>
                                                <input className="modal-input" type="email" name="correo" value={editedPersona.correo} onChange={handleEditChange} required />

                                                <label className="modal-label">Teléfono:</label>
                                                <input className="modal-input" type="text" name="telefono" value={editedPersona.telefono} onChange={handleEditChange} required />

                                                <label className="modal-label">Género:</label>
                                                <input className="modal-input" type="text" name="genero" value={editedPersona.genero} onChange={handleEditChange} required />

                                                <label className="modal-label">Contraseña:</label>
                                                <input className="modal-input" type="password" name="password" value={editedPersona.password} onChange={handleEditChange} required />

                                                <div className="modal-buttons">
                                                    <button type="submit" className="btn-save">Guardar</button>
                                                    <button type="button" className="btn-cancel" onClick={() => setShowEditModal(false)}>Cancelar</button>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};