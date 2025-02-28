import { useEffect, useState } from "react";
import { useGeriatricoPersona } from "../../hooks/useGeriatricoPersona";
import { usePersona, useSedesRol } from "../../hooks";
import { GoBackButton } from "../components/GoBackButton";
import Swal from "sweetalert2";
import { SelectField } from "../../auth/components/SelectField/SelectField";
import { SelectSede } from "../components/SelectSede/SelectSede";
import { useGeriatrico } from "../../hooks/useGeriatrico";

export const GestionPersonaGeriatricoPage = () => {
    const [personas, setPersonas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const { homeMiGeriatrico } = useGeriatrico();
    const { obtenerPersonaRolesMiGeriatricoSede, personasVinculadasMiGeriatrico, inactivarVinculacionGeriatrico, reactivarVinculacionGeriatrico } = useGeriatricoPersona();
    const { updatePerson } = usePersona();
    const { asignarRolAdminSede, inactivarRolAdminSede } = useSedesRol();
    const [activeCard, setActiveCard] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedPersona, setSelectedPersona] = useState(null);
    const [showAssignCard, setShowAssignCard] = useState(false);
    const [fechaInicio, setFechaInicio] = useState("");
    const [geriatrico, setGeriatrico] = useState(null);
    const [fechaFin, setFechaFin] = useState("");
    const [assigning, setAssigning] = useState(false);
    const [selectedRoles, setSelectedRoles] = useState([]);
    const [selectedSedes, setSelectedSedes] = useState("");
    const [editedPersona, setEditedPersona] = useState({
        usuario: "",
        nombre: "",
        documento: "",
        correo: "",
        telefono: "",
        genero: "",
        password: "",
        foto: "",
    });
    const [roles, setRoles] = useState({ rolesGeriatrico: [], rolesSede: [] });

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
        const fetchPersonas = async () => {
            setLoading(true);
            try {
                const response = await personasVinculadasMiGeriatrico();
                console.log("Respuesta de la API:", response);
                if (response && response.success && response.personas && response.personas.data) {
                    setPersonas(response.personas.data);
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
    const personasEncontradas = personas.find(personas =>
        personas?.per_nombre?.toLowerCase()?.includes(search.toLowerCase()) ||
        personas?.per_documento?.includes(search)
    );

    const personasFiltradas = personasEncontradas ? [personasEncontradas] : [];

    const handleCardClick = async (persona) => {
        console.log("Persona seleccionada:", persona);

        const isActive = activeCard === persona.per_id ? null : persona.per_id;
        setActiveCard(isActive);

        if (isActive) {
            try {
                const response = await obtenerPersonaRolesMiGeriatricoSede(persona.per_id);
                console.log("Respuesta de la API:", response);

                if (response.success) {
                    // Assuming the response contains the persona object
                    const { rolesGeriatrico, rolesSede } = response.persona; // Destructure roles from persona
                    setRoles({
                        rolesGeriatrico: rolesGeriatrico || [],
                        rolesSede: rolesSede || []
                    });
                } else {
                    throw new Error(response.message || "Error al obtener los roles.");
                }
            } catch (error) {
                console.error("Error al obtener roles:", error);
                Swal.fire({
                    icon: "error",
                    text: error.message || "Error al obtener los roles."
                });
            }
        }
    };

    const openAssignCard = (persona) => {
        setShowAssignCard(true);
        setSelectedPersona(persona);
    };

    const handleInactivarRolAdminSede = async (persona) => {
        console.log("Persona seleccionada para inactivar:", persona);

        if (!persona || !persona.per_id) {
            console.warn("⚠️ Información incompleta para inactivar el rol: falta per_id.");
            return;
        }

        if (!persona.rolesSede?.length) {
            Swal.fire({
                icon: "warning",
                text: " La persona no tiene roles en una sede.",
            });
            console.warn("⚠️ La persona no tiene roles en una sede.");
            return;
        }

        const rolSede = persona.rolesSede[0];
        console.log("Rol de sede seleccionado:", rolSede);

        if (!rolSede.sede?.id || !rolSede.rol_id) {
            console.warn("⚠️ Información incompleta: falta sede ID o rol ID.");
            return;
        }

        // Convertir valores a números válidos antes de enviarlos
        const per_id = Number(persona.per_id);
        const se_id = Number(rolSede.sede.id);
        const rol_id = Number(rolSede.rol_id);

        if (isNaN(per_id) || isNaN(se_id) || isNaN(rol_id) || per_id <= 0 || se_id <= 0 || rol_id <= 0) {
            console.error("❌ Error: Uno o más valores no son números válidos:", { per_id, se_id, rol_id });
            return;
        }

        const confirmacion = await Swal.fire({
            text: "Esta acción inactivará el rol de la persona en la sede.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sí, inactivar",
            cancelButtonText: "Cancelar"
        });

        if (!confirmacion.isConfirmed) return;

        const resultado = await inactivarRolAdminSede({ per_id, se_id, rol_id });

        if (resultado.success) {
            Swal.fire({
                icon: "success",
                text: resultado.message || "Rol inactivado exitosamente"
            });
        } else {
            Swal.fire({
                icon: "error",
                text: resultado.message || "No se pudo inactivar el rol"
            });
        }
    };

    const handleInactivarVinculacion = async (persona) => {
        console.log("Persona seleccionada para inactivar:", persona);

        if (!persona || !persona.per_id) {
            console.warn("⚠️ Información incompleta para inactivar el rol: falta per_id.");
            return;
        }

        const confirmacion = await Swal.fire({
            text: "Deseas inactivará la vinculación de la persona al geriatrico.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sí, inactivar",
            cancelButtonText: "Cancelar"
        });

        if (!confirmacion.isConfirmed) return;

        const resultado = await inactivarVinculacionGeriatrico(persona.per_id);

        if (resultado.success) {
            Swal.fire({
                icon: "success",
                text: resultado.message || "Vinculación inactivada exitosamente"
            });
        } else {
            Swal.fire({
                icon: "error",
                text: resultado.message || "No se pudo inactivar la vinculación"
            });
        }

    }

    const handleReactivarVinculacion = async (persona) => {
        console.log("Persona seleccionada para reactivar:", persona);

        if (!persona || !persona.per_id) {
            console.warn("⚠️ Información incompleta para reactivar el rol: falta per_id.");
            return;
        }

        const confirmacion = await Swal.fire({
            text: "Deseas reactivará la vinculación de la persona al geriatrico.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sí, reactivar",
            cancelButtonText: "Cancelar"
        });

        if (!confirmacion.isConfirmed) return;

        const resultado = await reactivarVinculacionGeriatrico(persona.per_id);

        if (resultado.success) {
            Swal.fire({
                icon: "success",
                text: resultado.message || "Vinculación reactivada exitosamente"
            });
            resetForm();
        } else {
            Swal.fire({
                icon: "error",
                text: resultado.message || "No se pudo reactivar la vinculación"
            });
        }

    }


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
                text: "Rol asignado exitosamente",
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
            documento: persona.per_documento || "",
            correo: persona.per_correo || "",
            telefono: persona.per_telefono || "",
            genero: persona.per_genero || "",
            password: "", // No se debe prellenar la contraseña por seguridad
            foto: persona.per_foto || "",
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
            per_documento: editedPersona.documento,
            per_correo: editedPersona.correo,
            per_telefono: editedPersona.telefono,
            per_genero: editedPersona.genero,
            per_password: editedPersona.password,
            per_foto: editedPersona.foto
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
        <div className="bodyAsignar" style={{  backgroundColor: geriatrico?.color_principal }}>
            <GoBackButton />
            <div className="container-asignar" >
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
                            <div className="container-cards">
                                {personasFiltradas.map(persona => (
                                    <div
                                        key={persona.per_id}
                                        className={`sede-card-asignar ${activeCard === persona.per_id ? "active" : ""} ${persona.ge_active === false ? "inactive" : ""}`}
                                        onClick={() => handleCardClick(persona)}>
                                        <div className="sede-info">
                                            <div className="full-name">{persona.per_nombre}</div>
                                            <div className="CC">{persona.per_usuario}</div>
                                            <div className="CC">{persona.per_documento}</div>
                                            <div className="CC">{persona.gp_fecha_vinculacion}</div>
                                        </div>
                                        <div className="status-icon-active">
                                            {persona.gp_activo ? (
                                                <i className="fa-solid fa-circle-check activo"></i>
                                            ) : (
                                                <i className="fa-solid fa-circle-xmark inactivo"></i>
                                            )}
                                        </div>

                                        <div className="buttons-asignar">
                                            <button className="active-button-asignar"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleReactivarVinculacion(persona);
                                                }}>
                                                <i className="fa-solid fa-user-gear" />
                                            </button>

                                            <button
                                                className="inactive-button-asignar"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleInactivarVinculacion(persona);
                                                }}
                                            >
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

                                            <button className="inactive-button-fa "
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleInactivarRolAdminSede(persona);
                                                }}
                                            >
                                                <i className="fa-solid fa-building" />
                                            </button>
                                        </div>
                                    </div>
                                ))}

                                {activeCard && (() => {
                                    if (roles.rolesGeriatrico.length === 0 && roles.rolesSede.length === 0) {
                                        console.log(roles);
                                        return null;
                                    }
                                    return (
                                        <>
                                            <div className="">
                                                {roles.rolesGeriatrico.length > 0 && (
                                                    <div className="sede-card-asignar">
                                                        {roles.rolesGeriatrico.map((rol, index) => (
                                                            <div key={index} className="sede-info">
                                                                <span className="full-name">{rol.nombre}</span>
                                                                <span className="CC">{rol.fechaInicio} - {rol.fechaFin}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>

                                            <div className="sede-card-asignar">
                                                {roles.rolesSede.length > 0 && (
                                                    <div className="">
                                                        {roles.rolesSede.map((rol, index) => (
                                                            <div key={index} className="">
                                                                <div className="status-icon-active-sede">
                                                                    {rol.activo ? (
                                                                        <i className="fa-solid fa-circle-check activo"></i>
                                                                    ) : (
                                                                        <i className="fa-solid fa-circle-xmark inactivo"></i>
                                                                    )}
                                                                </div>
                                                                <div className="sede-info">
                                                                    <span className="full-name">{rol.rol_nombre}</span>
                                                                    <span className="CC">{rol.se_nombre}</span>
                                                                    <span className="CC">{rol.fechaInicio} - {rol.fechaFin ? rol.fechaFin : "Indefinido"}</span>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </>
                                    );
                                })()}

                                {showAssignCard && selectedPersona?.per_id && (
                                    <div className="sede-card-asignar">
                                        <SelectField name="rol_id" value={selectedRoles} onChange={(roles) => setSelectedRoles(roles.map(Number))} />
                                        {
                                            selectedRoles.includes(3) && (
                                                <SelectSede name="se_id" value={selectedSedes} onChange={(e) => setSelectedSedes(Number(e.target.value))} />
                                            )
                                        }
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
                                    <div className="modal-overlay">
                                        <div className="modal">
                                            <div className="modal-content">
                                                <form onSubmit={handleEditSubmit}>
                                                    <div className="modal-picture">
                                                        {editedPersona.foto ? (
                                                            <img src={editedPersona.foto} alt="Foto de perfil" className="" />
                                                        ) : (
                                                            <i className="fas fa-user-circle icon-edit-user" ></i>
                                                        )}
                                                    </div>
                                                    <div className="modal-field">
                                                        <label >Cambiar foto:</label>
                                                        <input className="modal-input" type="file" name="foto" accept="image/*" onChange={handleFileChange} />
                                                    </div>
                                                    <div className="modal-field">
                                                        <label >Usuario:</label>
                                                        <input className="modal-input" type="text" name="usuario" value={editedPersona.usuario} onChange={handleEditChange} required />
                                                    </div>
                                                    <div className="modal-field">
                                                        <label >Nombre Completo:</label>
                                                        <input className="modal-input" type="text" name="nombre" value={editedPersona.nombre} onChange={handleEditChange} required />
                                                    </div>
                                                    <div className="modal-field">
                                                        <label >Documento:</label>
                                                        <input className="modal-input" type="text" name="documento" value={editedPersona.documento} onChange={handleEditChange} required />
                                                    </div>
                                                    <div className="modal-field">
                                                        <label >Correo:</label>
                                                        <input className="modal-input" type="email" name="correo" value={editedPersona.correo} onChange={handleEditChange} required />
                                                    </div>
                                                    <div className="modal-field">
                                                        <label >Teléfono:</label>
                                                        <input className="modal-input" type="text" name="telefono" value={editedPersona.telefono} onChange={handleEditChange} required />
                                                    </div>
                                                    <div className="modal-field">

                                                        <label >Género:</label>
                                                        <input className="modal-input" type="text" name="genero" value={editedPersona.genero} onChange={handleEditChange} required />
                                                    </div>
                                                    <div className="modal-field">
                                                        <label >Contraseña:</label>
                                                        <input className="modal-input" type="password" name="password" value={editedPersona.password} onChange={handleEditChange} required />
                                                    </div>
                                                    <div className="modal-buttons">
                                                        <button type="submit" className="create">Guardar</button>
                                                        <button type="button" className="cancel" onClick={() => setShowEditModal(false)}>Cancelar</button>
                                                    </div>
                                                </form>
                                            </div>
                                        </div>

                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div >
    );
};