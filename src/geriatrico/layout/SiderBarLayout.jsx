import React, { useState } from 'react';
import "../../css/siderbar.css";

export const SiderBarLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [subMenuOpen, setSubMenuOpen] = useState({});

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const toggleSubMenu = (buttonId) => {
        if (!subMenuOpen[buttonId]) {
            closeAllSubMenus();
        }
        setSubMenuOpen((prev) => ({ ...prev, [buttonId]: !prev[buttonId] }));
        if (!sidebarOpen) {
            setSidebarOpen(true);
        }
    };

    const closeAllSubMenus = () => {
        setSubMenuOpen({});
    };

    return (
        <div className="container">
            <nav id="sidebar" className={sidebarOpen ? '' : 'close'}>
                <ul>
                    <li>
                        <span className="logo">Logo</span>
                        <button onClick={toggleSidebar} id="toggle-btn" className={sidebarOpen ? '' : 'rotate'}>
                            <i className="fas fa-angle-double-left"></i>
                        </button>
                    </li>
                    <li>
                        <button 
                            onClick={() => toggleSubMenu('perfil')} 
                            className={`dropdown-btn ${subMenuOpen['perfil'] ? 'rotate' : ''}`}
                        >
                            <i className="fas fa-user"></i>
                            <span>Perfil</span>
                            <i className="fas fa-chevron-down"></i>
                        </button>
                        <ul className={`sub-menu ${subMenuOpen['perfil'] ? 'show' : ''}`}>
                            <li><a href="#">Inventario</a></li>
                        </ul>
                    </li>
                    <li>
                        <a href="#">
                            <i className="fas fa-stethoscope"></i>
                            <span>Diagnóstico</span>
                        </a>
                    </li>
                    <li>
                        <a href="#">
                            <i className="fas fa-chart-line"></i>
                            <span>Recomendaciones</span>
                        </a>
                    </li>
                    <li>
                        <button 
                            onClick={() => toggleSubMenu('informes')} 
                            className={`dropdown-btn ${subMenuOpen['informes'] ? 'rotate' : ''}`}
                        >
                            <i className="fas fa-notes-medical"></i>
                            <span>Informes de Enfermería</span>
                            <i className="fas fa-chevron-down"></i>
                        </button>
                        <ul className={`sub-menu ${subMenuOpen['informes'] ? 'show' : ''}`}>
                            <li><a href="#">Informes de Psicología</a></li>
                            <li><a href="#">Informe de médico</a></li>
                        </ul>
                    </li>
                    <li>
                        <button 
                            onClick={() => toggleSubMenu('medicamentos')} 
                            className={`dropdown-btn ${subMenuOpen['medicamentos'] ? 'rotate' : ''}`}
                        >
                            <i className="fas fa-pills"></i>
                            <span>Medicamentos y horarios</span>
                            <i className="fas fa-chevron-down"></i>
                        </button>
                        <ul className={`sub-menu ${subMenuOpen['medicamentos'] ? 'show' : ''}`}>
                            <li><a href="#">Medicamentos Suministrados</a></li>
                        </ul>
                    </li>
                    <li>
                        <a href="#">
                            <i className="fas fa-hand-holding-heart"></i>
                            <span>Cuidados</span>
                        </a>
                    </li>
                </ul>
            </nav>
        </div>
    );
};
