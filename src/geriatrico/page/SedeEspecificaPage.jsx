import { useEffect, useState } from "react";
import "../../css/sedeEspecifica.css";
import { useSede } from "../../hooks/useSede";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../hooks";
import { CargandoComponent } from "../components/CargandoComponent";

export const SedeEspecificaPage = () => {
    const { obtenerSedesHome } = useSede();
    const { startLogout } = useAuthStore();
    const [sede, setSede] = useState(null);
    const [geriatrico, setGeriatrico] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSede = async () => {
            try {
                setLoading(true);
                setError(null);

                const result = await obtenerSedesHome();
                console.log("📡 Respuesta de la API:", result);

                if (result.success && result.sede && result.geriatrico) {
                    setSede(result.sede);  // Aseguramos que `sede` es un objeto válido
                    setGeriatrico(result.geriatrico);
                } else {
                    setError("No se encontraron datos de la sede.");
                }
            } catch (err) {
                setError("Error al obtener los datos.");
            } finally {
                setLoading(false);
            }
        };

        fetchSede();
    }, []);

    if (loading) {
        return <CargandoComponent />;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }

    if (!sede) {
        return <p>No se encontraron datos de la sede.</p>;
    }

    return (
        <div className="flex" style={{ backgroundColor: geriatrico.colores.principal }}>
            <div className="sidebar" style={{ backgroundColor: geriatrico.colores.secundario }}>
                <img className="logo" src={sede.se_foto} height={100} />
                <div className="icons">
                    <div className="icon" onClick={() => navigate("/geriatrico/home")}>
                        <i className="fa-solid fa-house-user" />
                        <span className="icon-text">Inicio</span>
                    </div>
                    <div className="icon" >
                        <i className="fa-solid fa-building" />
                        <span className="icon-text">Inventario</span>
                    </div>
                    <div className="icon" onClick={() => navigate("/geriatrico/gestionarPersonas")}>
                        <i className="fa-solid fa-users" />
                        <span className="icon-text">Gestionar Personas</span>
                    </div>
                    <div className="icon" onClick={() => navigate("/register")}>
                        <i className="fa-solid fa-user-plus" />
                        <span>Registrar</span>
                    </div>
                    <div className="icon" onClick={() => navigate("/geriatrico/profile")}>
                        <i className="fa-solid fa-user" />
                        <span className="icon-text">Perfil</span>
                    </div>
                    <div className="icon" onClick={startLogout}  >
                        <i className="fa-solid fa-right-from-bracket" />
                        <span className="icon-text">Salir</span>
                    </div>
                </div>
            </div>
            <div className="main-content">
                <div className="">
                    <div className="">
                        <span>{sede.se_nombre}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};
