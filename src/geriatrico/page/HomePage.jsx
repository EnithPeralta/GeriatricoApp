import { useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa';
import '../../css/home.css';
import { Link } from 'react-router-dom';

export const HomePage = () => {

    // Opcional: Agregar desplazamiento suave al hacer clic en los enlaces
    useEffect(() => {
        const smoothScroll = (event) => {
            if (event.target.tagName === 'A' && event.target.getAttribute('href')?.startsWith('#')) {
                event.preventDefault();
                const targetId = event.target.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
        };
        document.addEventListener('click', smoothScroll);
        return () => document.removeEventListener('click', smoothScroll);
    }, []);

    return (
        <div>
            <nav className="navbar" id='Inicio'>
                <h1 className="logo-home">LOGO</h1>
                <ul className="nav-links">
                    <li><a className='link-nav' href="#Inicio">INICIO</a></li>
                    <li><Link className='link-nav' to={"/geriatrico/profile"} >PERFIL</Link></li>
                    <li><a className='link-nav' href="#Nosotros">SOBRE NOSOTROS</a></li>
                    <li><a className='link-nav' href="#Contacto">CONTACTO</a></li>
                </ul>
            </nav>
            <Swiper
                modules={[Navigation, Pagination, Autoplay]}
                loop={true}
                autoplay={{ delay: 5000 }}
                pagination={{ clickable: true }}
                navigation
                className="swiper"
            >
                <SwiperSlide className='slide'>
                    <div className="content">
                        <h2>Geriatrico</h2>
                        <p>There are many variations of passages of Lorem Ipsum available</p>
                        <button className="read-more">READ MORE</button>
                    </div>
                </SwiperSlide>
                <SwiperSlide className='slide1'>
                    <div className="overlay"></div>
                    <div className="content">
                        <h2>Modern Interiors</h2>
                        <p>Enhancing spaces with creative interior solutions</p>
                        <button className="read-more">READ MORE</button>
                    </div>
                </SwiperSlide>
            </Swiper>

            <section className="about" id='Nosotros'>
                <h2>Sobre Nosotros</h2>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec et justo nec justo vehicula fermentum. Sed suscipit, risus eget aliquam pharetra, justo felis cursus ligula, at ullamcorper justo libero nec lorem.</p>
            </section>

            <footer className="footer" id='Contacto'>
                <div>
                    <h3>SEDE ADMINISTRATIVA</h3>
                    <p><FaMapMarkerAlt /> Calle 1 # 2-55, Barrio Caldas, Popayán - Cauca</p>
                    <p><FaPhone /> +57 3155205655</p>
                    <p><FaEnvelope /> info@eirasalud.com.co</p>
                </div>
                <div>
                    <h3>REDES SOCIALES</h3>
                    <p><FaFacebook /> eirasaludips</p>
                    <p><FaTwitter /> @eirasaludips</p>
                    <p><FaInstagram /> @eirasaludips</p>
                </div>
                <div>
                    <h3>ENLACES</h3>
                    <p><a href="#Inicio" className="enlaces">Inicio</a></p>
                    <p><a href="#Nosotros" className="enlaces">Nosotros</a></p>
                    <p><a href="#Servicios" className="enlaces">Servicios</a></p>
                    <p><Link to={"https://eirasalud.com.co/"} className="enlaces">Eira App</Link></p>
                </div>
            </footer>
        </div>
    );
};
