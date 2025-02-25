import { useState, useEffect } from "react";
import { useGeriatricoPersonaRol } from "../../../hooks/useGeriatricoPersonaRol";
import { SelectField } from "../../../auth/components/SelectField/SelectField";
import { SelectGeriatrico } from "../../../auth/components/SelectGeriatrico/SelectGeriatrico";

export const ModalAsignarPerson = ({ isOpen, onClose, persona }) => {
  const { asignarRolGeriatrico } = useGeriatricoPersonaRol();
  const [mensaje, setMensaje] = useState("");
  const [showExtraFields, setShowExtraFields] = useState(false);

  const [formData, setFormData] = useState({
    per_id: "",
    ge_id: "",
    rol_id: "",
    gp_fecha_inicio: "",
    gp_fecha_fin: "",
  });

  useEffect(() => {
    if (persona) {
      setFormData({
        per_id: persona.id,
        ge_id: persona.ge_id || "",
        rol_id: "",
        gp_fecha_inicio: "",
        gp_fecha_fin: "",
      });
    }
  }, [persona]);

  const handleChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value
    }));
  };

  const handleRoleChange = (event) => {
    const selectedRole = event.target.value;
    setFormData((prevState) => ({
      ...prevState,
      rol_id: selectedRole
    }));
    setShowExtraFields(selectedRole === "2"); // Compara con string si es de un select
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje("");

    try {
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
        onClose();
      }
    } catch (error) {
      console.error("Error en la asignación:", error);
      setMensaje("Error al asignar el rol.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-container" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()}>
        <form onSubmit={handleSubmit}>
          <SelectField label="Rol" name="rol_id" value={formData.rol_id} onChange={handleRoleChange} />
          <SelectGeriatrico label="Geriatrico" name="ge_id" value={formData.ge_id} onChange={handleChange} />
          
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
