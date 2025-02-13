import { useState, useEffect } from "react";
import '../../../css/geriatrico.css';

export const ModalEditarGeriatrico = ({ geriatrico, isOpen, onClose, onUpdate }) => {
    const [formData, setFormData] = useState({
        ge_nombre: "",
        ge_nit: "",
        ge_color_principal: "#ffffff",
        ge_color_secundario: "#ffffff",
        ge_color_terciario: "#ffffff"
    });

    useEffect(() => {
        if (geriatrico) {
            setFormData({
                ge_nombre: geriatrico.ge_nombre || "",
                ge_nit: geriatrico.ge_nit || "",
                ge_color_principal: geriatrico.ge_color_principal || "#ffffff",
                ge_color_secundario: geriatrico.ge_color_secundario || "#ffffff",
                ge_color_terciario: geriatrico.ge_color_terciario || "#ffffff"
            });
        }
    }, [geriatrico]);

    if (!isOpen || !geriatrico) return null;

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!geriatrico?.ge_id) {
            console.error("No se encontró el ID del geriátrico", geriatrico);
            return;
        }
        
        onUpdate(geriatrico.ge_id, formData);
        onClose();
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <form onSubmit={handleSubmit} className="geriatrico-form-edit">
                    <h2 className="geriatrico-name">Editar Geriátrico</h2>
                    <label>Nombre</label>
                    <input
                        type="text"
                        name="ge_nombre"
                        value={formData.ge_nombre}
                        onChange={handleChange}
                        className="geriatrico-input"
                    />

                    <label>NIT</label>
                    <input
                        type="text"
                        name="ge_nit"
                        value={formData.ge_nit}
                        onChange={handleChange}
                        className="geriatrico-input"
                    />

                    <div className="color-boxes-input">
                        <input
                            type="color"
                            name="ge_color_principal"
                            value={formData.ge_color_principal}
                            onChange={handleChange}
                            className="color-box"
                        />
                        <input
                            type="color"
                            name="ge_color_secundario"
                            value={formData.ge_color_secundario}
                            onChange={handleChange}
                            className="color-box"
                        />
                        <input
                            type="color"
                            name="ge_color_terciario"
                            value={formData.ge_color_terciario}
                            onChange={handleChange}
                            className="color-box"
                        />
                    </div>
                    <div className="modal-buttons">
                        <button type="submit" className="save-button">Guardar</button>
                        <button type="button" onClick={onClose} className="cancel-button">Cancelar</button>
                    </div>
                </form>
            </div>
        </div>
    );
};
