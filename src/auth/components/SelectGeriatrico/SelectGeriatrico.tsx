import React, { useEffect, useState } from 'react';
import { SelectGeriatricoProps } from './types';
import { useGeriatrico } from '../../../hooks/useGeriatrico';

export const SelectGeriatrico = ({ label, ...props }: SelectGeriatricoProps) => {
    const { obtenerGeriatricos } = useGeriatrico();
    const [geriatricos, setGeriatricos] = useState<Array<{ value: string; label: string }>>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchGeriatricos = async () => {
            try {
                const result = await obtenerGeriatricos();
                if (result.success) {
                    const opciones = result.geriatricos.map((geriatrico) => ({
                        value: geriatrico.ge_id,
                        label: geriatrico.ge_nombre
                    }));
                    setGeriatricos(opciones);
                } else {
                    setError(result.message);
                }
            } catch (error) {
                setError('Error al obtener los geriátricos');
            }
        };

        fetchGeriatricos();
    }, [obtenerGeriatricos]);

    return (
        <div className="input-container-register">
            <label>{label}</label>
            <select
                className="custom-select-container"
                name={props.name}
                value={props.value || ""}
                onChange={props.onChange}
            >
                <option value="">Seleccione Geriátrico</option>
                {error ? (
                    <option value="" disabled>{`Error: ${error}`}</option>
                ) : (
                    geriatricos.map((geriatrico) => (
                        <option key={geriatrico.value} value={geriatrico.value}>
                            {geriatrico.label}
                        </option>
                    ))
                )}
            </select>
        </div>
    );
};
