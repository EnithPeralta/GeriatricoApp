import '../../css/admin.css'
export const AdminPage = () => {
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
                            <h2 className='building-title'>Lorem ipsum dolor sit amet.</h2>
                            <div className="buttons-group">
                                <button className="button button-outline">
                                    <i className="fa-solid fa-plus"></i> Crear Sede
                                </button>
                                <button className="button button-filled">
                                    <i className="fa-solid fa-link"></i> Vincular Sede
                                </button>
                            </div>
                        </div>
                        <img src="../../../public/Building.jpg" alt="" />
                    </div>

                    <div className="stat-card">
                        <div className="stat-info">
                            <h3>Personal médico</h3>
                            <div className="stat-number">40+</div>
                        </div>
                        <button className="add-button">
                            <i className="fa-solid fa-plus"></i> Agregar
                        </button>
                    </div>

                    <div className="stat2-card">
                        <div className="stat-info">
                            <h3>Pacientes</h3>
                            <div className="stat-number">240+</div>
                        </div>
                        <button className="add-button">
                            <i className="fa-solid fa-plus"></i> Agregar
                        </button>
                    </div>

                    <div className="stat3-card">
                        <div className="stat2-info">
                            <h3>Administadores</h3>
                            <div className="stat2-number">40+</div>
                        </div>
                        <button className="add2-button">
                            <i className="fa-solid fa-plus"></i> Delegar
                        </button>
                    </div>
                    <div className="stat4-card"></div>
                </div>
            </div>
            <div className="user-profile">
                <i className="fa-solid fa-user user-avatar"></i>
                <span className="user-name">Juan Ruiz</span>
            </div>
        </div>
    )
}
