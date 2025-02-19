import { useState, useEffect } from "react";
import '../../../css/geriatrico.css';

export const ModalEditarGeriatrico = ({ geriatrico, isOpen, onClose, onUpdate, updateEdit }) => {
    const [formData, setFormData] = useState({
        ge_nombre: "",
        ge_nit: "",
        ge_logo: "",
        ge_color_principal: "#ffffff",
        ge_color_secundario: "#ffffff",
        ge_color_terciario: "#ffffff"
    });

    useEffect(() => {
        if (geriatrico) {
            setFormData({
                ge_nombre: geriatrico.ge_nombre || "",
                ge_nit: geriatrico.ge_nit || "",
                ge_logo: geriatrico.ge_logo || "",
                ge_color_principal: geriatrico.ge_color_principal || "#ffffff",
                ge_color_secundario: geriatrico.ge_color_secundario || "#ffffff",
                ge_color_terciario: geriatrico.ge_color_terciario || "#ffffff"
            });
        }
    }, [geriatrico]);

    if (!isOpen || !geriatrico) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData((prev) => ({
                    ...prev,
                    ge_logo: reader.result
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!geriatrico?.ge_id) {
            console.error("No se encontró el ID del geriátrico", geriatrico);
            return;
        }
        onUpdate(geriatrico.ge_id, { ...formData, ge_logo: formData.ge_logo || geriatrico.ge_logo });
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
                    <label>Logo</label>
                    <input
                        type="file"
                        name="ge_logo"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="geriatrico-input"
                    />
                    {formData.ge_logo && <img src={formData.ge_logo} alt="Logo" className="logo-preview" />}
                    <div className="color-boxes-input">
                        {["ge_color_principal", "ge_color_secundario", "ge_color_terciario"].map(color => (
                            <input
                                key={color}
                                type="color"
                                name={color}
                                value={formData[color]}
                                onChange={handleChange}
                                className="color-box"
                            />
                        ))}
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
