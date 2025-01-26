import '../../css/sedes.css'
export const SedesPage = () => {
    return (
        <div className="bodySedes">
            <div className="background-circle circle-left"></div>
            <div className="background-circle circle-right"></div>
            <div className="header">
                <div className="app-name">Geriátrico App</div>
                <div className="logo">LOGO</div>
            </div>

            <div className="container">
                <div className="cont">
                    <h1>Sedes</h1>

                    <div className="sede-card active">
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
                    </div>

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
                    </div>

                    <button className="add-button-sedes">
                        <i className="fa-solid fa-plus"></i>
                    </button>
                </div>
            </div>

        </div>
    )
}
