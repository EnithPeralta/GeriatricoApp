import { useState } from "react";
import '../../../css/modal.css';

export const ModalUpdatePerson = ({ persona, updatePersona, setPersona, showModal, setShowModal }) => {
    const [editedPersona, setEditedPersona] = useState({
        per_usuario: persona?.usuario || "",
        per_correo: persona?.correo || "",
        per_telefono: persona?.telefono || "",
        per_foto: persona?.foto || "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditedPersona((prev) => ({ ...prev, [name]: value }));
    };
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setEditedPersona((prev) => ({
                    ...prev,
                    per_foto: reader.result, // Guardamos la imagen en base64
                }));
            };
            reader.readAsDataURL(file);
        }
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Datos a enviar desde el modal:", editedPersona);

        const result = await updatePersona(editedPersona); // Se envía como JSON
        console.log("Respuesta del servidor:", result);
        if (result.success) {
            setPersona(result.persona);
            setShowModal(false);
        } else {
            console.error(result.message);
        }
    };

    return showModal ? (
        <div className="modal-overlay">
            <div className="modal">
                <div className="modal-content">

                    <p className="">Editar Perfil</p>
                    <form onSubmit={handleSubmit}>
                        <div className="modal-picture">
                            {editedPersona.per_foto ? (
                                <img src={editedPersona.per_foto} alt="Foto de perfil" className="modal-img" />
                            ) : (
                                <i className="fas fa-user-circle"></i>
                            )}
                        </div>
                        <div className="modal-field">
                            <label className="modal-label">Cambiar foto:</label>
                            <input className="modal-input" type="file" accept="image/*" onChange={handleFileChange} />
                        </div>
                        <div className="modal-field">
                            <label className="modal-label">Usuario:</label>
                            <input className="modal-input" type="text" name="per_usuario" value={editedPersona.per_usuario} onChange={handleChange} required />
                        </div>
                        <div className="modal-field">
                            <label className="modal-label">Correo:</label>
                            <input className="modal-input" type="email" name="per_correo" value={editedPersona.per_correo} onChange={handleChange} required />
                        </div>
                        <div className="modal-field">
                            <label className="modal-label">Teléfono:</label>
                            <input className="modal-input" type="text" name="per_telefono" value={editedPersona.per_telefono} onChange={handleChange} required />
                        </div>
                        <div className="modal-buttons">
                            <button type="submit" className="create">Guardar</button>
                            <button type="button" className="cancel" onClick={() => setShowModal(false)}>Cancelar</button>
                        </div>
                    </form>

                </div>
            </div>
        </div>
    ) : null;
};
