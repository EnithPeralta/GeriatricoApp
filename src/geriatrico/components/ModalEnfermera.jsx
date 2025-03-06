import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';

export const ModalEnfermera = ({ datosInicial, onRegistrar, onClose, selectedRoles }) => {
    const [datosEnfermera, setDatosEnfermera] = useState({
        per_id: datosInicial?.per_id || '',
        enf_codigo: datosInicial?.enf_codigo || '',
        rol_id: datosInicial?.rol_id || null,
        sp_fecha_inicio: datosInicial?.sp_fecha_inicio || '',
        sp_fecha_fin: datosInicial?.sp_fecha_fin || ''
    });

    useEffect(() => {
        setDatosEnfermera((prev) => ({
            ...prev,
            ...datosInicial,
            rol_id: selectedRoles?.[0] || prev.rol_id
        }));
    }, [datosInicial, selectedRoles]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setDatosEnfermera((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = () => {
        if (!datosEnfermera.per_id) {
            Swal.fire({
                icon: 'warning',
                text: "⚠️ No se ha seleccionado una persona válida.",
            });
            return;
        }
        const datosCompletos = { ...datosEnfermera, rol_id: selectedRoles?.[0] || null };
        console.log("📤 Enviando datos de la enfermera:", datosCompletos);
        onRegistrar(datosCompletos);
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-content">
                    {/* <SelectField
                        name="rol_id"
                        value={selectedRoles}
                        onChange={(roles) => {
                            const rolesNumericos = roles.map(Number);
                            setSelectedRoles(rolesNumericos);
                        }}
                    /> */}

                    <div className="modal-field">
                        <label>Código</label>
                        <input
                            type="text"
                            name="enf_codigo"
                            className="modal-input"
                            value={datosEnfermera.enf_codigo}
                            onChange={handleChange}
                            placeholder="Ingrese el código de la enfermera"
                            required
                        />
                    </div>
                    <div className="modal-field">
                        <label>Fecha inicio</label>
                        <input
                            type="date"
                            name="sp_fecha_inicio"
                            className="modal-input"
                            value={datosEnfermera.sp_fecha_inicio}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="modal-field">
                        <label>Fecha fin</label>
                        <input
                            type="date"
                            name="sp_fecha_fin"
                            className="modal-input"
                            value={datosEnfermera.sp_fecha_fin}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <button type="button" className="create" onClick={handleSubmit}>
                        Registrar Enfermera
                    </button>
                    <button type="button" className="cancel" onClick={onClose}>
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    );
};
