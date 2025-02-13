import { useState } from "react";
import '../../../css/geriatrico.css'

export const ModalCrearGeriatrico = ({ isOpen, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        ge_nombre: "",
        ge_nit: "",
        ge_color_principal: "",
        ge_color_secundario: "",
        ge_color_terciario: "",
        ge_logo: null
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (e) => {
        setFormData({ ...formData, ge_logo: e.target.files[0] });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);

        const result = await onSave(formData);

        if (result.success) {
            setSuccess(result.message);
            setFormData({
                ge_nombre: "",
                ge_nit: "",
                ge_color_principal: "",
                ge_color_secundario: "",
                ge_color_terciario: "",
                ge_logo: null
            });
            setTimeout(() => onClose(), 1500);
        } else {
            setError(result.message);
        }

        setLoading(false);
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div onClick={(e) => e.stopPropagation()}>
                <form onSubmit={handleSubmit} className="geriatrico-form">
                    <h2 className="geriatrico-name">Crear Geriátrico</h2>
                    <input type="text" className="geriatrico-input" name="ge_nombre" placeholder="Nombre" value={formData.ge_nombre} onChange={handleChange} required />
                    <input type="text" className="geriatrico-input" name="ge_nit" placeholder="NIT" value={formData.ge_nit} onChange={handleChange} required />
                    <div className="color-boxes">
                        <input type="color" className="box-input" name="ge_color_principal" value={formData.ge_color_principal} onChange={handleChange} required />
                        <input type="color" className="box-input" name="ge_color_secundario" value={formData.ge_color_secundario} onChange={handleChange} required />
                        <input type="color" className="box-input" name="ge_color_terciario" value={formData.ge_color_terciario} onChange={handleChange} required />
                    </div>
                    <input type="file" className="modal-logo" name="ge_logo" accept="image/*" onChange={handleFileChange} required />

                    {error && <p className="error-message">{error}</p>}
                    {success && <p className="success-message">{success}</p>}
                    <div className="buttons">
                        <button type="submit" disabled={loading}>
                            {loading ? "Guardando..." : "Crear"}
                        </button>
                        <button type="button" onClick={onClose} className="cancel-button">
                            Cancelar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
