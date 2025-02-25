import { useEffect } from "react";
import { FaCircle } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import "../../css/login.css";
import { useAuthStore, useForm, useSession } from "../../hooks";

const loginFormFields = {
  per_password: '',
  per_usuario: ''
};

export const LoginPage = () => {
  const { startLogin } = useAuthStore();
  const navigate = useNavigate();
  const { per_password, per_usuario, onInputChange, isPasswordVisible, togglePasswordVisibility } = useForm(loginFormFields);
  const { session, obtenerSesion } = useSession(); 

  useEffect(() => {
    // Si ya hay una sesión almacenada, redirigir directamente
    if (session) {
      navigate(session.esSuperAdmin ? "/geriatrico/superAdmin" : "/geriatrico/home");
    }
  }, [session, navigate]);

  const loginSubmit = async (e) => {
    e.preventDefault();

    const { success, esSuperAdmin } = await startLogin({ per_usuario, per_password });

    if (success) {
        await obtenerSesion(); // Se obtiene la sesión después del login
        navigate(esSuperAdmin ? "/geriatrico/superAdmin" : "/geriatrico/home");
    } else {
        alert("Usuario o contraseña incorrectos");
    }
  };

  return (
    <div className="BodyLogin">
      <img src="../../../public/enf.png" className="img" alt="enfermera" />
      <div className="circletop"></div>
      <div className="cuadrado">
        <div className="web">
          <FaCircle className="circle" />
          <span className="title">Geriátrico Web</span>
        </div>
        <h3>Comienza ahora</h3>
        <h2>Iniciar sesión<span className="link">.</span></h2>

        <form className="form" onSubmit={loginSubmit}>
          <div className="input-container">
            <i className="fas fa-user"></i>
            <input
              type="text"
              placeholder="Usuario"
              value={per_usuario}
              onChange={onInputChange}
              name="per_usuario"
            />
          </div>
          <div className="input-container">
            <i className={`fa-solid ${isPasswordVisible ? 'fa-eye-slash' : 'fa-eye'}`} onClick={togglePasswordVisibility}></i>
            <input
              type={isPasswordVisible ? "text" : "password"}
              placeholder="Contraseña"
              value={per_password}
              onChange={onInputChange}
              name="per_password"
            />
          </div>
          <button type="submit">Entrar</button>
          <Link className="link" to={"/forgotPassword"}>
            <p className="p">¿Se te ha olvidado la contraseña?</p>
          </Link>
        </form>

        <div className="circlebottom"></div>
      </div>
    </div>
  );
};
