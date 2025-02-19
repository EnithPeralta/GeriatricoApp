import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { SelectRol } from "../components/SelectRol/SelectRol";
import { usePersona } from "../../hooks/usePersona";
import { useAuthStore, useRoles } from "../../hooks";
import "../../css/home.css";

export const HomePage = () => {
    const { getAuthenticatedPersona } = usePersona();
    const { startLogout } = useAuthStore();
    const [persona, setPersona] = useState(null);

    const navigate = useNavigate();
    const { seleccionarRol } = useRoles();

    // Obtiene el rol seleccionado desde Redux
    const rolSeleccionado = useSelector((state) => state.roles?.rolSeleccionado ?? null);

    useEffect(() => {
        const fetchPersona = async () => {
            if (!persona) {  // Solo obtener la persona si no está cargada
                try {
                    const result = await getAuthenticatedPersona();
                    if (result.success) {
                        setPersona(result.persona);
                    } else {
                        console.error("Error al obtener persona:", result.message);
                        setPersona(null);
                    }
                } catch (error) {
                    console.error("Error en la solicitud:", error.message);
                    setPersona(null);
                }
            }
        };
        fetchPersona();
    }, [getAuthenticatedPersona, persona]);  // Dependemos de persona para evitar recargar

    useEffect(() => {
        // Solo redirige si el rolSeleccionado tiene el valor esperado
        if (rolSeleccionado) {
            console.log("🎯 Redirigiendo según el rol...");
            if (rolSeleccionado.rol_id === 2) {
                navigate(`/geriatrico/sedes`);
            }
        }
    }, [rolSeleccionado, navigate]); // Redirige solo si el rol cambia

    const handleRolChange = async (event) => {
        const selectedOption = event.target.selectedOptions[0];
        const rolId = selectedOption.value;
        const geId = selectedOption.getAttribute("data-ge_id");

        console.log("Rol seleccionado:", rolId, geId);

        // Solo hacer el dispatch si el rol realmente cambió
        if (rolId && rolSeleccionado?.rol_id !== rolId) {
            await seleccionarRol({ rol_id: rolId, ge_id: geId });
        }
    };

    return (
        <div>
            <nav className="navbar" id='Inicio'>
                <h1 className="logo-home">Bienvenido {persona?.nombre}</h1>
                <ul className="nav-links">
                    <div className='user-home' onClick={() => navigate("/geriatrico/profile")}>
                        <div className="picture">
                            {persona?.foto ? (
                                <img src={persona.foto} alt="Foto Del Admin" className="admin-img" />
                            ) : (
                                <i className="fas fa-user-circle"></i>
                            )}
                        </div>
                    </div>
                    <div className="change-password" onClick={() => navigate("/forgotPassword")}>
                        <i className="fa-solid fa-lock" />
                        <p className="change-password-text">Cambiar clave</p>
                    </div>
                    <button onClick={startLogout} className='btn-logout'>
                        <i className="fa-solid fa-right-from-bracket" />
                    </button>
                </ul>
            </nav>         
            <aside className="sidebar">
                <SelectRol 
                    label="Rol" 
                    name="rol_id" 
                    value={rolSeleccionado?.rol_id} 
                    onChange={handleRolChange} 
                />
            </aside>
        </div>
    );
};
