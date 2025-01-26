import '../../css/sedeEspecifica.css'

export const SedeEspecificaPage = () => {
    return (
        <div className="bodySedeEspecifica">
            <div className="background-circle-sedEspe circle-left-sedEspe"></div>
            <div className="background-circle-sedEspe circle-right-sedEspe"></div>

            <div className="header-sedEspe">
                <div className="app-name">Geriátrico App</div>
                <div className="logo">LOGO</div>
            </div>

            <div className="container">
                <div className="cont">
                    <h1>Sede Ave María</h1>
                    <div className="sede-card active">
                        <div className="sede-icon">
                            <i className="fas fa-user-injured"></i>
                        </div>
                        <div className="sede-info">
                            <div className="pacientes">PACIENTES</div>
                        </div>

                    </div>

                    <div className="sede-card">
                        <div className="sede-icon">
                            <i className="fas fa-user-nurse"></i>
                        </div>
                        <div className="sede-info">
                            <div className="pacientes">ENFERMEROS</div>
                        </div>
                    </div>

                    <div className="sede-card">
                        <div className="sede-icon">
                            <i className="fas fa-users"></i>
                        </div>
                        <div className="sede-info">
                            <div className="pacientes">COLABORADORES</div>
                        </div>


                    </div>
                    <div className="sede-card active">
                        <div className="sede-icon">
                            <i className="fas fa-clipboard-list"></i>
                        </div>
                        <div className="sede-info">
                            <div className="pacientes">INVENTARIO</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
