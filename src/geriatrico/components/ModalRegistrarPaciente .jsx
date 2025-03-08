import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { usePaciente } from "../../hooks/usePaciente"; // Hook con funciones de pacientes

export const ModalRegistrarPaciente = ({ datosIniciales, onClose, selectedRoles }) => {
    const { obtenerDetallePacienteSede, registrarPaciente, actualizarDetallePaciente } = usePaciente();
    const [esActualizacion, setEsActualizacion] = useState(false);
    const [datosPaciente, setDatosPaciente] = useState({
        per_id: datosIniciales?.per_id || "",
        pac_edad: "",
        pac_peso: "",
        pac_talla: "",
        pac_regimen_eps: "",
        pac_nombre_eps: "",
        pac_rh_grupo_sanguineo: "",
        pac_talla_camisa: "",
        pac_talla_pantalon: "",
        rol_id: selectedRoles?.[0] || null,
        sp_fecha_inicio: "",
        sp_fecha_fin: "",
    });

    // 🔍 Cuando se abre el modal, buscamos si el paciente ya tenía datos previos
    useEffect(() => {
        if (datosIniciales?.per_id) {
            obtenerDetallePacienteSede(datosIniciales.per_id).then((response) => {
                if (response.success && response.paciente) {
                    setDatosPaciente((prev) => ({
                        ...prev,
                        pac_edad: response.paciente.edad || "",
                        pac_peso: response.paciente.peso || "",
                        pac_talla: response.paciente.talla || "",
                        pac_regimen_eps: response.paciente.regimen_eps || "",
                        pac_nombre_eps: response.paciente.nombre_eps || "",
                        pac_rh_grupo_sanguineo: response.paciente.rh_grupo_sanguineo || "",
                        pac_talla_camisa: response.paciente.talla_camisa || "",
                        pac_talla_pantalon: response.paciente.talla_pantalon || "",
                        rol_id: selectedRoles?.[0] || prev.rol_id,
                        sp_fecha_inicio: response.paciente.sp_fecha_inicio || "",
                        sp_fecha_fin: response.paciente.sp_fecha_fin || "",
                    }));
    
                    // 🔹 Agregar la propiedad tieneDatos para saber si es una actualización
                    datosIniciales.tieneDatos = true;
    
                    Swal.fire({
                        icon: "info",
                        text: "Este paciente ya tenía datos registrados. Se han cargado sus datos anteriores.",
                        confirmButtonText: "OK",
                    });
                }
            });
        }
    }, [datosIniciales, selectedRoles]);
    


    const handleChange = (e) => {
        const { name, value } = e.target;
        setDatosPaciente((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async () => {
        if (!datosPaciente.per_id) {
            Swal.fire({
                icon: "warning",
                text: "⚠️ No se ha seleccionado una persona válida.",
            });
            return;
        }
    
        // Determinar si es un paciente nuevo o ya registrado
        const esActualizacion = Boolean(datosIniciales?.per_id && datosIniciales?.tieneDatos);
    
        if (esActualizacion) {
            console.log("🔄 Actualizando paciente:", datosPaciente);
            const response = await actualizarDetallePaciente(datosPaciente.per_id, datosPaciente);
            if (response.success) {
                Swal.fire({
                    icon: "success",
                    text: "✅ Paciente actualizado correctamente.",
                });
                onClose();
            } else {
                Swal.fire({
                    icon: "error",
                    text: `❌ Error al actualizar: ${response.message}`,
                });
            }
        } else {
            console.log("📤 Registrando nuevo paciente:", datosPaciente);
            const response = await registrarPaciente(datosPaciente);
    
            if (response.success) {
                Swal.fire({
                    icon: "success",
                    text: "✅ Paciente registrado correctamente.",
                });
                onClose();
            } else {
                Swal.fire({
                    icon: "error",
                    text: `❌ Error al registrar: ${response.message}`,
                });
            }
        }
    };
    

    return (
        <div className="modal-overlay">
            <div className="modal">
                <div className="modal-content">
                    <div className="modal-field">
                        <label>Edad:</label>
                        <input className="modal-input" type="text" name="pac_edad" value={datosPaciente.pac_edad} onChange={handleChange} required />
                    </div>
                    <div className="modal-field">
                        <label>Peso:</label>
                        <input className="modal-input" type="text" name="pac_peso" value={datosPaciente.pac_peso} onChange={handleChange} required />
                    </div>
                    <div className="modal-field">
                        <label>Estatura:</label>
                        <input className="modal-input" type="text" name="pac_talla" value={datosPaciente.pac_talla} onChange={handleChange} required />
                    </div>
                    <div className="modal-field">
                        <label>Régimen EPS:</label>
                        <input className="modal-input" type="text" name="pac_regimen_eps" value={datosPaciente.pac_regimen_eps} onChange={handleChange} required />
                    </div>
                    <div className="modal-field">
                        <label>EPS:</label>
                        <input className="modal-input" type="text" name="pac_nombre_eps" value={datosPaciente.pac_nombre_eps} onChange={handleChange} required />
                    </div>
                    <div className="modal-field">
                        <label>Grupo sanguíneo:</label>
                        <input className="modal-input" type="text" name="pac_rh_grupo_sanguineo" value={datosPaciente.pac_rh_grupo_sanguineo} onChange={handleChange} required />
                    </div>
                    <div className="modal-field">
                        <label>Talla de camisa:</label>
                        <input className="modal-input" type="text" name="pac_talla_camisa" value={datosPaciente.pac_talla_camisa} onChange={handleChange} required />
                    </div>
                    <div className="modal-field">
                        <label>Talla de pantalón:</label>
                        <input className="modal-input" type="text" name="pac_talla_pantalon" value={datosPaciente.pac_talla_pantalon} onChange={handleChange} required />
                    </div>
                    <div className="modal-field">
                        <label>Fecha de inicio:</label>
                        <input className="modal-input" type="date" name="sp_fecha_inicio" value={datosPaciente.sp_fecha_inicio} onChange={handleChange} required />
                    </div>
                    <div className="modal-field">
                        <label>Fecha de fin:</label>
                        <input className="modal-input" type="date" name="sp_fecha_fin" value={datosPaciente.sp_fecha_fin} onChange={handleChange} />
                    </div>
                    <button type="button" className="create" onClick={handleSubmit}>
                        {esActualizacion ? "Actualizar Paciente" : "Registrar Paciente"}
                    </button>

                    <button type="button" className="cancel" onClick={onClose}>
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    );
};
