import { FaCircle } from "react-icons/fa";
import { Link } from "react-router-dom";
import "../../css/login.css";


export const LoginPage = () => {
    return (
        <div className="BodyLogin">
        <img src="../../../public/enf.png" className="img" alt="enfermera" />
        <div className="circletop"></div>
        <div className="cuadrado">
          <div className="web">
            <FaCircle className="circle" />
            <span className="title">Geriátrico Web</span>
          </div>
           <h3>comienza ahora</h3>
              <h2>
                Iniciar sesión
                <Link className="link">.</Link>
              </h2>
          <form className="form">
            <div className="input-container">
              <i className="fas fa-user"></i>
              <input type="text" placeholder="Usuario" />
            </div>
            <div className="input-container">
              <i className="fa-solid fa-eye"></i>
              <input type="password" placeholder="Contraseña" />
            </div>
            <button type="submit">Entrar</button>
          </form>
          <div className="circlebottom"></div>
        </div>
      </div>
    );
};
