import React from 'react';
import { SelectField } from "../../../auth/components/SelectField/SelectField";
import { SelectGeriatrico } from '../../../auth/components/SelectGeriatrico/SelectGeriatrico';

export const AssignCardGestionar = ({ selectedGeriatrico, setSelectedGeriatrico, selectedRoles, setSelectedRoles, fechaInicio, setFechaInicio, fechaFin, setFechaFin, assigning, handleAssignRole }) => {
    return (
        <div className="sede-card-asignar">

            <SelectGeriatrico
                name="ge_id"
                value={selectedGeriatrico}
                onChange={(e) => setSelectedGeriatrico(Number(e.target.value))}
            />
            <SelectField
                name="rol_id"
                value={selectedRoles}
                onChange={(roles) => setSelectedRoles(roles.map(Number))}
            />

            <div className="form-group">
                <label>Fecha de Inicio:</label>
                <input
                    type="date"
                    value={fechaInicio}
                    className="date-input"
                    onChange={(e) => setFechaInicio(e.target.value)}
                />
            </div>
            <div className="form-group">
                <label>Fecha de Fin (opcional):</label>
                <input
                    type="date"
                    className="date-input"
                    value={fechaFin}
                    onChange={(e) => setFechaFin(e.target.value)}
                />
            </div>
            <button
                className="asignar-button"
                onClick={handleAssignRole}
                disabled={assigning}
            >
                {assigning ? "Asignando..." : "Asignar"}
            </button>
        </div>
    );
};