import { useNavigate } from 'react-router-dom';
import { usePersona } from '../../hooks/usePersona';
import { AdminLayout } from '../layout/AdminLayout'

export const AdminGeriatrico = () => {
    
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
        <AdminLayout persona={persona} loading={loading}>
            {/* Hero Text */}
            <div className="hero-text">
                <h1>Lorem ipsum dolor sit amet.</h1>
                <p>Lorem ipsum dolor sit amet consectetur. Sit morbi ansagt alistan dolor sit amet consectetu</p>
            </div>

            {/* Cards Section */}
            <div className="cards-section">
                <div className="building-card">
                    <div className="building-content">
                        <h2 className="building-title">Lorem ipsum dolor sit amet.</h2>
                        <div className="buttons-group">
                            <button className="button button-outline" onClick={() => navigate("/geriatrico/geriatricoActive")}>
                                <i className="fa-solid fa-plus"></i> Crear Geriátrico
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
                    </div>
                    <button className="add-button" onClick={() => navigate("/register")}>
                        <i className="fa-solid fa-plus"></i> Agregar
                    </button>
                </div>

                <div className="stat2-card">
                    <div className="stat-info">
                        <h3>Gestioner Rol</h3>
                    </div>
                    <div className="button-group">
                        <button className="add-button" >
                            <i className="fa-solid fa-plus"></i> Agregar
                        </button>
                    </div>
                </div>
            </div>
        </AdminLayout>
    )
}
