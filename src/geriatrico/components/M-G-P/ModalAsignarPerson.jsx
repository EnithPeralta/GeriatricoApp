import { useState } from "react";
import { useGeriatricoPersonaRol } from "../../../hooks/useGeriatricoPersonaRol";

export const ModalAsignarPerson = ({ isOpen, onClose }) => {
  const { asignarRolGeriatrico } = useGeriatricoPersonaRol();
  const [formData, setFormData] = useState({
    per_id: "",
    ge_id: "",
    rol_id: "",
    gp_fecha_inicio: "",
    gp_fecha_fin: "",
  });
  const [mensaje, setMensaje] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje("");

    const response = await asignarRolGeriatrico(formData);
    setMensaje(response.message);

    if (response.success) {
      setFormData({
        per_id: "",
        ge_id: "",
        rol_id: "",
        gp_fecha_inicio: "",
        gp_fecha_fin: "",
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()}>
        <h2>Asignar Rol</h2>
        <form onSubmit={handleSubmit} className="geriatrico-form">
          <label>Persona ID:</label>
          <input type="text" name="per_id" value={formData.per_id} onChange={handleChange} required />

          <label>Geriátrico ID:</label>
          <input type="text" name="ge_id" value={formData.ge_id} onChange={handleChange} required />

          <label>Rol ID:</label>
          <input type="text" name="rol_id" value={formData.rol_id} onChange={handleChange} required />

          <label>Fecha Inicio:</label>
          <input type="date" name="gp_fecha_inicio" value={formData.gp_fecha_inicio} onChange={handleChange} required />

          <label>Fecha Fin:</label>
          <input type="date" name="gp_fecha_fin" value={formData.gp_fecha_fin} onChange={handleChange} required />

          <button type="submit">Asignar</button>
          <button type="button" onClick={onClose}>Cerrar</button>
        </form>
        {mensaje && <p>{mensaje}</p>}
      </div>
    </div>
  );
};

