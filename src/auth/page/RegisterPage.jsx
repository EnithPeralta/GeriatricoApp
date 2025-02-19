import { FaCircle } from 'react-icons/fa';
import "../../css/register.css";
import { RegisterForm } from '../components';
import { GoBackButton } from '../../geriatrico/components/GoBackButton';

export const RegisterPage = () => {
    return (
        <>
            <div className="cuadrado-register"></div>
            
            <div className="circle-1"></div>
            <div className="circle-2"></div>
            <div className="content-wrapper">
            <GoBackButton />
                <div className="register">
                    <FaCircle className="circle" />
                    <span className="title">Geriátrico Web</span>
                </div>
                <div className="seccion-titulo">
                    <h1>Registrarse<span>.</span></h1>
                    <p className="subtitulo">Comienza ahora</p>
                </div>

                <div className="content-wrapper">
                    <RegisterForm />
                </div>
            </div>
        </>
    );
};
