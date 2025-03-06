import React, { useState, useEffect } from "react";

export const ModalEditPerson = ({ editedPersona, onSubmit, onClose }) => {

    const [personaEditada, setPersonaEditada] = useState(editedPersona || {});

    console.log(personaEditada);

    useEffect(() => {
        setPersonaEditada(editedPersona || {});
    }, [editedPersona]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPersonaEditada(prev => ({ ...prev, per_foto: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setPersonaEditada(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(e, personaEditada);
        console.log(personaEditada);
    };
    
    return (
        <div className="modal-overlay">
            <div className="modal">
                <div className="modal-content">
                    <form onSubmit={handleSubmit}>
                        <div className="modal-img">
                            {personaEditada.per_foto ? (
                                <img
                                    src={personaEditada.per_foto}
                                    alt="Foto de perfil"
                                    height={100}
                                    width={100}
                                />
                            ) : (
                                <i className="fas fa-user-circle icon-edit-user"></i>
                            )}
                        </div>
                        <div className="modal-field">
                            <label>Cambiar foto:</label>
                            <input
                                className="modal-input"
                                type="file"
                                name="foto"
                                accept="image/*"
                                onChange={handleFileChange}
                            />
                        </div>
                        {/* <div className="modal-field">
                            <label>Usuario:</label>
                            <input
                                className="modal-input"
                                type="text"
                                name="usuario"
                                value={personaEditada.usuario || ""}
                                onChange={handleEditChange}
                                required
                            />
                        </div> */}
                        <div className="modal-field">
                            <label>Nombre Completo:</label>
                            <input
                                className="modal-input"
                                type="text"
                                name="nombre"
                                value={personaEditada.nombre || ""}
                                onChange={handleEditChange}
                                required
                            />
                        </div>
                        <div className="modal-field">
                            <label>Documento:</label>
                            <input
                                className="modal-input"
                                type="text"
                                name="documento"
                                value={personaEditada.documento || ""}
                                onChange={handleEditChange}
                                required
                            />
                        </div>
                        <div className="modal-field">
                            <label>Correo:</label>
                            <input
                                className="modal-input"
                                type="email"
                                name="correo"
                                value={personaEditada.correo || ""}
                                onChange={handleEditChange}
                                required
                            />
                        </div>
                        <div className="modal-field">
                            <label>Teléfono:</label>
                            <input
                                className="modal-input"
                                type="text"
                                name="telefono"
                                value={personaEditada.telefono || ""}
                                onChange={handleEditChange}
                                required
                            />
                        </div>
                        <div className="modal-field">
                            <label>Género:</label>
                            <input
                                className="modal-input"
                                type="text"
                                name="genero"
                                value={personaEditada.genero || ""}
                                onChange={handleEditChange}
                                required
                            />
                        </div>
                        {/* <div className="modal-field">
                            <label>Contrasena:</label>
                            <input
                                className="modal-input"
                                type="password"
                                name="password"
                                value={personaEditada.password || ""}
                                onChange={handleEditChange}
                                required
                            />
                        </div> */}

                        <div className="modal-buttons">
                            <button type="submit" className="create">
                                Guardar
                            </button>
                            <button type="button" className="cancel" onClick={onClose}>
                                Cancelar
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};
