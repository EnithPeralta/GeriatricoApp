import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import "../../css/sedes.css";
import { useSede } from "../../hooks/useSede";
import { GoBackButton } from "../components";

export const SedesPage = () => {
    const { obtenerSedesGeriatrico } = useSede();
    const [sedes, setSedes] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const rolSeleccionado = useSelector((state) => state.roles?.rolSeleccionado ?? null);

    useEffect(() => {
        if (!rolSeleccionado) return; // No hacer nada si no hay rol seleccionado
        const fetchData = async () => {

            const response = await obtenerSedesGeriatrico(rolSeleccionado.rol_id); // Pasar rol_id

            if (response.success) {
                setSedes(response.sedes);
            } else {
                setError(response.message);
            }
        };

        fetchData();
    }, [rolSeleccionado, obtenerSedesGeriatrico]);

    return (
        <div className="bodySedes">
            <GoBackButton />
            <div className="background-circle circle-left"></div>
            <div className="background-circle circle-right"></div>
            <div className="header">
                <div className="app-name">Geriátrico App</div>
                <div className="logo">LOGO</div>
            </div>

            <div className="container">
                <div className="cont">
                    <h1>Sedes</h1>
                    {sedes.length > 0 ? (
                        sedes.map((sede) => (
                            <div key={sede.se_id} className="sede-card">
                                <div className="sede-icon">
                                    {sede.se_foto ? (
                                        <img src={sede.se_foto} alt={`Foto de la sede ${sede.nombre}`} />
                                    ) : (
                                        <i className="fa-solid fa-hospital"></i> // Icono por defecto si no hay foto
                                    )}
                                </div>
                                <div className="sede-info">
                                    <div className="sede-name">{sede.se_nombre}</div>
                                    <div className="pacientes">{sede.se_direccion}</div>
                                </div>
                                <div className="status-icon">
                                    <i className="fa-solid fa-sun"></i>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>No hay sedes registradas</p>
                    )}
                    {/* <div className="sede-card active">
                        <div className="sede-icon">
                            <i className="fa-solid fa-hospital"></i>
                        </div>
                        <div className="sede-info">
                            <div className="sede-name">SEDE AVE MARÍA</div>
                            <div className="pacientes">12 PACIENTES</div>
                        </div>
                        <div className="status-icon">
                            <i className="fa-solid fa-water"></i>
                        </div>
                    </div>

                    <div className="sede-card">
                        <div className="sede-icon">
                            <i className="fa-solid fa-hospital"></i>
                        </div>
                        <div className="sede-info">
                            <div className="sede-name">SEDE XXXXXXX</div>
                            <div className="pacientes">4 PACIENTES</div>
                        </div>
                        <div className="status-icon">
                            <i className="fa-solid fa-sun"></i>
                        </div>
                    </div> */}
                    {/* 
                    <div className="sede-card">
                        <div className="sede-icon">
                            <i className="fa-solid fa-hospital"></i>
                        </div>
                        <div className="sede-info">
                            <div className="sede-name">SEDE XXXXXXX</div>
                            <div className="pacientes">6 PACIENTES</div>
                        </div>
                        <div className="status-icon">
                            <i className="fa-solid fa-sunrise"></i>
                        </div>
                    </div> */}

                    <button className="add-button-sedes">
                        <i className="fa-solid fa-plus"></i>
                    </button>
                </div>
            </div>
        </div>
    );
};
