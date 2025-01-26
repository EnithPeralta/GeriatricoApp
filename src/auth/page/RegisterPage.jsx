import { FaCircle } from 'react-icons/fa';
import "../../css/register.css";

export const RegisterPage = () => {
    return (
        <>
            <div className="cuadrado-register"></div>
            <div className="circle-1"></div>
            <div className="circle-2"></div>
            <div className='content-wrapper'>
                <div className="register">
                    <FaCircle className="circle"/>
                    <span className="title">Geriátrico Web</span>
                </div>
                <div className="seccion-titulo">
                    <h1>Registrarse<span>.</span></h1>
                    <p className="subtitulo">Comienza ahora</p>
                </div>
                <div className='content-wrapper'>
                    <form className="form-container">
                        <div className="input-grid">
                            <div className="input-container-register">
                                <label>Nombre completo</label>
                                <div className="input-wrapper">
                                    <input type="text" placeholder="Juan Andres Gomez Ruiz" />
                                    <i className="fas fa-user"></i>
                                </div>
                            </div>

                            <div className="input-container-register">
                                <label>E-mail</label>
                                <div className="input-wrapper">
                                    <input type="email" placeholder="andrsgome08@gmail.com" />
                                    <i className="fas fa-envelope"></i>
                                </div>
                            </div>

                            <div className="input-container-register">
                                <label>C.C</label>
                                <div className="input-wrapper">
                                    <input type="text" placeholder="106168102" />
                                    <i className="fas fa-id-card"></i>
                                </div>
                            </div>

                            <div className="input-container-register">
                                <label>Fecha de Nacimiento</label>
                                <div className="input-wrapper">
                                    <input type="text" placeholder="23/06/1956" />
                                    <i className="fas fa-calendar"></i>
                                </div>
                            </div>

                            <div className="input-container-register">
                                <label>Contraseña</label>
                                <div className="input-wrapper">
                                    <input type="password" placeholder="••••••••" />
                                    <i className="fas fa-lock"></i>
                                </div>
                            </div>

                            <div className="input-container-register">
                                <label>Cel</label>
                                <div className="input-wrapper">
                                    <input type="tel" placeholder="3171427777" />
                                    <i className="fas fa-mobile-alt"></i>
                                </div>
                            </div>

                            <div className="input-container-register span-2">
                                <label>Confirmar Contraseña</label>
                                <div className="input-wrapper">
                                    <input type="password" placeholder="••••••••" />
                                    <i className="fas fa-lock"></i>
                                </div>
                            </div>
                            <button className="register-button">Registrarme</button>
                        </div>

                    </form>
                </div>
            </div>
        </>
    );
};
