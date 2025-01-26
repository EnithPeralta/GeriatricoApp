import '../../css/pacientes.css'
export const PacientesPage = () => {
    return (
        <div className="bodyPaciente">
            <div className=".background-circle-pacientes circle-left-pacientes"></div>
            <div className=".background-circle-pacientes circle-right-pacientes"></div>

            <div className="header-pacientes">
                <div className="app-name">Geriátrico App</div>
                <div className="logo">LOGO</div>
            </div>

            <div className="container">
                <div className="cont">
                    <h1>Pacientes</h1>

                    <div className="sede-card active">
                        <div className="sede-icon">
                            <i className="fas fa-user"></i>
                        </div>
                        <div className="sede-info">
                            <div className="full-name">Juan Andres Gomez Ruiz</div>
                            <div className="age">68 años de edad</div>
                            <div className="condition">Pacientes cardiovascular</div>
                        </div>
                        <div className="status-icon">
                            <i className="fas fa-bars"></i>
                        </div>
                    </div>

                    <div className="sede-card active">
                        <div className="sede-icon">
                            <i className="fas fa-user"></i>
                        </div>
                        <div className="sede-info">
                            <div className="full-name">Juan Andres Gomez Ruiz</div>
                            <div className="age">68 años de edad</div>
                            <div className="condition">Pacientes cardiovascular</div>
                        </div>
                        <div className="status-icon">
                            <i className="fas fa-bars"></i>
                        </div>
                    </div>

                    <div className="sede-card active">
                        <div className="sede-icon">
                            <i className="fas fa-user"></i>
                        </div>
                        <div className="sede-info">
                            <div className="full-name">Juan Andres Gomez Ruiz</div>
                            <div className="age">68 años de edad</div>
                            <div className="condition">Pacientes cardiovascular</div>
                        </div>
                        <div className="status-icon">
                            <i className="fas fa-bars"></i>
                        </div>
                    </div>

                    <div className="sede-card active">
                        <div className="sede-icon">
                            <i className="fas fa-user"></i>
                        </div>
                        <div className="sede-info">
                            <div className="full-name">Juan Andres Gomez Ruiz</div>
                            <div className="age">68 años de edad</div>
                            <div className="condition">Pacientes cardiovascular</div>
                        </div>
                        <div className="status-icon">
                            <i className="fas fa-bars"></i>
                        </div>
                    </div>

                    <button className="add-button-paciente">
                        <i className="fa-solid fa-plus"></i>
                    </button>
                </div>
            </div>
        </div>
    )
}
