import React, { useState } from "react";
export const AsignarRol = () => {
    const [activeCard, setActiveCard] = useState(null);
    const [showRoles, setShowRoles] = useState(false);
    const [selectedRoles, setSelectedRoles] = useState([]);
    const [modals, setModals] = useState({ delete: false, admin: false });

    const toggleSedes = (index) => {
        setActiveCard(activeCard === index ? null : index);
    };

    const toggleRoles = () => {
        setShowRoles(!showRoles);
    };

    const handleRoleSelection = (role) => {
        setSelectedRoles((prev) =>
            prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role]
        );
    };

    const openModal = (type) => {
        setModals({ ...modals, [type]: true });
    };

    const closeModal = (type) => {
        setModals({ ...modals, [type]: false });
    };

    return (
        <div>
            <div className="container">
                <div className="layout">
                    <div className="content">
                        <div className="cont">
                            <h1>Gestionar Usuarios</h1>
                            <div className="search-bar">
                                <input type="text" className="search-input" placeholder="Buscar Usuario..." />
                                <button className="search-button">
                                    <FontAwesomeIcon icon={faSearch} /> Buscar
                                </button>
                            </div>

                            <div
                                className={`sede-card ${activeCard === 1 ? "active" : ""}`}
                                onClick={() => toggleSedes(1)}
                            >
                                <div className="sede-icon">
                                    <FontAwesomeIcon icon={faUser} />
                                </div>
                                <div className="sede-info">
                                    <div className="full-name">Juan Andres Gomez Ruiz</div>
                                    <div className="CC">CC: 1061699218</div>
                                </div>
                                <div className="button-container">
                                    <button className="delete-button" onClick={() => openModal("delete")}>
                                        <FontAwesomeIcon icon={faTrash} />
                                    </button>
                                    <button className="add-button" onClick={() => openModal("admin")}>
                                        <FontAwesomeIcon icon={faArrowUp} />
                                    </button>
                                </div>

                                <div className="sedes-dropdown">
                                    <button onClick={toggleRoles}>Sede A</button>
                                    <button onClick={toggleRoles}>Sede B</button>
                                </div>

                                {showRoles && (
                                    <div className={`roles-list ${showRoles ? 'show' : ''}`}>
                                        {["Administrador", "Enfermero", "Paciente", "Colaborador"].map((role) => (
                                            <label key={role}>
                                                <input
                                                    type="checkbox"
                                                    value={role}
                                                    checked={selectedRoles.includes(role)}
                                                    onChange={() => handleRoleSelection(role)}
                                                />
                                                {role}
                                            </label>
                                        ))}
                                        <div className="roles-actions">
                                            <button className="cancel-button" onClick={toggleRoles}>
                                                Cancelar
                                            </button>
                                            <button
                                                className="accept-button"
                                                onClick={() => {
                                                    alert(`Roles seleccionados: ${selectedRoles.join(", ")}`);
                                                    toggleRoles();
                                                }}
                                            >
                                                Aceptar
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {modals.delete && (
                    <div className="modal">
                        <div className="modal-content">
                            <p>¿Deseas eliminar este usuario?</p>
                            <div className="modal-buttons">
                                <button className="confirm" onClick={() => closeModal("delete")}>
                                    Sí
                                </button>
                                <button className="cancel" onClick={() => closeModal("delete")}>
                                    No
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {modals.admin && (
                    <div className="modal">
                        <div className="modal-content">
                            <p>¿Quieres delegar a administrador de sede a este usuario?</p>
                            <div className="modal-buttons">
                                <button className="confirm" onClick={() => closeModal("admin")}>
                                    Sí
                                </button>
                                <button className="cancel" onClick={() => closeModal("admin")}>
                                    No
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

