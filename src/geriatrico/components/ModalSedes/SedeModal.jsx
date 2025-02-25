import { useState, useEffect } from "react"; 
import "../../../css/sedes.css";
import { useSede } from "../../../hooks/useSede";
import { useSelector } from "react-redux";

export const SedeModal = ({ isOpen, onClose, onSave, sede }) => {
    const [formData, setFormData] = useState({
        se_nombre: "",
        se_telefono: "",
        se_direccion: "",
        cupos_totales: "",
        cupos_ocupados: "",
        se_foto: null,
        rol_id: null, // Agregamos rol_id
        ge_id: null,  // Agregamos ge_id
    });
    const [previewImage, setPreviewImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const { createSede, actualizarSede } = useSede();
    
    // Obtenemos los datos desde Redux
    const rolSeleccionado = useSelector((state) => state.roles?.rolSeleccionado ?? null);

    useEffect(() => {
        const storedRolId = localStorage.getItem("rol_id");
        const storedGeId = localStorage.getItem("ge_id");

        setFormData((prev) => ({
            ...prev,
            rol_id: rolSeleccionado?.rol_id || (storedRolId ? Number(storedRolId) : null),
            ge_id: rolSeleccionado?.ge_id || (storedGeId ? Number(storedGeId) : null),
        }));

        if (sede) {
            setFormData((prev) => ({
                ...prev,
                se_nombre: sede.se_nombre || "",
                se_telefono: sede.se_telefono || "",
                se_direccion: sede.se_direccion || "",
                cupos_totales: sede.cupos_totales || "",
                cupos_ocupados: sede.cupos_ocupados || 0,
                se_foto: null,
            }));
            setPreviewImage(sede.se_foto || null);
        } else {
            setPreviewImage(null);
        }
    }, [sede, rolSeleccionado]);

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
                    se_foto: reader.result, // Guardamos la imagen en base64
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        let result;
        if (sede) {
            result = await actualizarSede(sede.se_id, formData);
        } else {
            result = await createSede(formData);
        }

        if (result.success) {
            onSave(result.sede);
            onClose();
        } else {
            alert(result.message);
        }

        setLoading(false);
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-container" onClick={(e) => e.stopPropagation()}>
                <h2 className="modal-title">{sede ? "Editar Sede" : "Agregar Nueva Sede"}</h2>

                <form onSubmit={handleSubmit}>
                    <input className="input" type="text" name="se_nombre" placeholder="Nombre de la sede" value={formData.se_nombre} onChange={handleChange} required />

                    <input className="input" type="text" name="se_telefono" placeholder="Teléfono" value={formData.se_telefono} onChange={handleChange} required />

                    <input className="input" type="text" name="se_direccion" placeholder="Dirección" value={formData.se_direccion} onChange={handleChange} required />

                    <input className="input" type="number" name="cupos_totales" placeholder="Cupos Totales" value={formData.cupos_totales} onChange={handleChange} required />

                    <input className="input" type="number" name="cupos_ocupados" placeholder="Cupos Ocupados" value={formData.cupos_ocupados} onChange={handleChange} required />

                    <input className="input" type="file" accept="image/*" onChange={handleFileChange} required={!sede} />

                    {previewImage && <img src={previewImage} alt="Vista previa" className="preview-image" />}

                    <div className="modal-buttons">
                        <button type="button" onClick={onClose} className="cancel-btn" disabled={loading}>Cancelar</button>
                        <button type="submit" className="save-btn" disabled={loading}>
                            {loading ? "Guardando..." : sede ? "Actualizar" : "Guardar"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
