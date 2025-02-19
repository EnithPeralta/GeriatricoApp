import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../css/admin.css';
import { usePersona } from '../../hooks/usePersona';

export const AdminPage = () => {
    const { getAuthenticatedPersona } = usePersona();
    const navigate = useNavigate();
    const [persona, setPersona] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPersona = async () => {
            try {
                const result = await getAuthenticatedPersona();
                if (result.success) {
                    setPersona(result.persona);
                } else {
                    console.error("Error al obtener persona:", result.message);
                }
            } catch (error) {
                console.error("Error en la solicitud:", error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchPersona();
    }, [getAuthenticatedPersona]);

    

    return (
        <div className="bodyAdmin">
            <div className="headerAdmin">
                <div className="logo">LOGO</div>
                <div className="action-buttons">
                    <button className="icon-button">
                        <i className="fa-solid fa-share-nodes"></i>
                    </button>
                    <button className="icon-button">
                        <i className="fa-solid fa-s"></i>
                    </button>
                </div>
            </div>

            <div className="content-grid">
                <div className="hero-text">
                    <h1>Lorem ipsum dolor sit amet.</h1>
                    <p>Lorem ipsum dolor sit amet consectetur. Sit morbi ansagt alistan dolor sit amet consectetu</p>
                </div>

                <div className="cards-section">
                    <div className="building-card">
                        <div className="building-content">
                            <h2 className="building-title">Lorem ipsum dolor sit amet.</h2>
                            <div className="buttons-group">
                                <button className="button button-outline" onClick={() => navigate("/geriatrico/geriatricoActive")}>
                                    <i className="fa-solid fa-plus"></i> Crear Geriatrico
                                </button>
                                <button className="button button-filled" onClick={() => navigate("/geriatrico/roles")}>
                                    <i className="fa-solid fa-plus"></i> Crear Roles
                                </button>
                            </div>
                        </div>
                        <img src="/Building.jpg" alt="Edificio" />
                    </div>

                    <div className="stat-card">
                        <div className="stat-info">
                            <h3>Personas Registradas</h3>
                                {/* <div className="stat-number">40+</div> */}
                        </div>
                        <button className="add-button" onClick={() => navigate("/register")}>
                            <i className="fa-solid fa-plus"></i> Agregar
                        </button>
                    </div>

                    <div className="stat2-card">
                        <div className="stat-info">
                            <h3>Gestiornar Personas</h3>
                        </div>
                        <div className="button-group">
                            <button className="add-button" onClick={() => navigate("/geriatrico/personas")}>
                            <i className="fa-solid fa-street-view"></i> Ver Personas
                            </button>
                        </div>
                    </div>

                    {/* <div className="stat3-card">
                        <div className="stat2-info">
                            <h3>Administradores</h3>
                            <div className="stat2-number">40+</div>
                        </div>
                        <button className="add2-button">
                            <i className="fa-solid fa-plus"></i> Delegar
                        </button>
                    </div>

                    <div className="stat4-card"></div> */}
                </div>
            </div>

            {/* ✅ Hacer que el perfil sea clickeable y estilizarlo */}
            <div 
                className="user-profile" 
                onClick={() => navigate("/geriatrico/profile")}>
                <div className="picture">
                    {persona?.foto ? (
                        <img src={persona.foto} alt="Foto Del Admin" className="admin-img" />
                    ) : (
                        <i className="fas fa-user-circle"></i>
                    )}
                </div>
                <span className="user-name">
                    {loading ? "Cargando..." : persona?.nombre || "Usuario desconocido"}
                </span>
            </div>
        </div>
    );
};
