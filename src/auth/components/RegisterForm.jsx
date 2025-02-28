import { useEffect, useRef, useState } from 'react';
import { useAuthStore, useForm, usePersona, useSession } from '../../hooks';
import Swal from 'sweetalert2';
import { InputField } from './InputField/InputField';
import { useGeriatricoPersona } from '../../hooks/useGeriatricoPersona';

const registerFormFields = {
    per_password: '',
    confirm_password: '',
    per_usuario: '',
    per_genero: '',
    per_telefono: '',
    per_nombre_completo: '',
    per_documento: '',
    per_correo: '',
    per_foto: ''
};

export const RegisterForm = () => {
    const { startRegister, errorMessage } = useAuthStore();
    const { obtenerSesion } = useSession();
    const [esSuperAdmin, setEsSuperAdmin] = useState(false);
    const [loading, setLoading] = useState(false);
    const { buscarVincularPersona } = usePersona()
    const { vincularPersonaAGeriatrico } = useGeriatricoPersona();
    const [adminGeriátrico, setAdminGeriátrico] = useState(null);


    const fetchedRef = useRef(false);

    useEffect(() => {
        if (!fetchedRef.current) {
            const fetchSesion = async () => {
                const sesion = await obtenerSesion();
                console.log("Sesion obtenida:", sesion);
                setEsSuperAdmin(sesion?.esSuperAdmin || false);
                setAdminGeriátrico(sesion?.rol_id == 2);
            };
            fetchSesion();
            fetchedRef.current = true;
        }
    }, [obtenerSesion]);

    const {
        per_password,
        confirm_password,
        per_usuario,
        per_genero,
        per_telefono,
        per_nombre_completo,
        per_documento,
        per_correo,
        per_foto,
        onInputChange,
        isPasswordVisible,
        togglePasswordVisibility
    } = useForm(registerFormFields);

    useEffect(() => {
        if (errorMessage) {
            Swal.fire({ title: 'Error en la autenticación', icon: 'error', text: errorMessage });
        }
    }, [errorMessage]);

    const buscarPersona = async () => {
        if (!per_documento.trim()) return;

        setLoading(true);
        const sesion = await obtenerSesion();
        const ge_id = sesion?.ge_id;

        const resultado = await buscarVincularPersona({ documento: per_documento, ge_id });

        setLoading(false);

        if (resultado.success) {
            if (resultado.action === "none") {
                Swal.fire({ icon: 'info', text: resultado.message });
            } else if (resultado.action === "link") {
                Swal.fire({
                    icon: 'question',
                    text: resultado.message,
                    showCancelButton: true,
                    confirmButtonText: 'Sí, vincular',
                    cancelButtonText: 'No'
                }).then(async (result) => {
                    if (result.isConfirmed) {
                        await vincularPersonaAGeriatrico(resultado.per_id, ge_id);
                        Swal.fire({ icon: 'success', text: 'Persona vinculada exitosamente' });
                    }
                });
            }
        } else {
            Swal.fire({ icon: 'error', text: resultado.message });
        }
    };

    const registroSubmit = async (e) => {
        e.preventDefault();

        if (per_password !== confirm_password) {
            Swal.fire({ title: 'Error', icon: 'error', text: 'Las contraseñas no coinciden' });
            return;
        }

        try {
            await startRegister({
                per_correo,
                per_usuario,
                per_genero,
                per_telefono,
                per_nombre_completo,
                per_password,
                per_documento,
                per_foto
            });

            Swal.fire({
                icon: 'success',
                text: 'La cuenta ha sido creada correctamente',
                timer: 2000,
                showConfirmButton: false
            })

        } catch (error) {
            console.error("Error en el registro:", error);
            Swal.fire({ title: 'Error', icon: 'error', text: error.message });
        }
    };

    return (
        <form className="form-container" onSubmit={registroSubmit}>
            {!esSuperAdmin && (
                <div className="search-container-asignar">
                    <input
                        type="text"
                        className="search-input-asignar"
                        placeholder="Buscar por Cédula..."
                        name="per_documento"
                        value={per_documento}
                        onChange={onInputChange}
                        onBlur={buscarPersona} // Dispara la búsqueda al salir del campo
                    />
                    <button type="button" className="search-button-buscar" onClick={buscarPersona} disabled={loading}>
                        <i className={`fas fa-search ${loading ? 'fa-spin' : ''}`} />
                    </button>
                </div>
            )}
            <div className="input-grid">
                <InputField label="Nombre completo" type="text" name="per_nombre_completo" value={per_nombre_completo} onChange={onInputChange} placeholder="Juan Gomez" icon="fas fa-user" required />
                <InputField label="Cedula" type="cc" name="per_documento" value={per_documento} onChange={onInputChange} placeholder="1234567890" icon="fas fa-id-card" required />
                <InputField label="E-mail" type="email" name="per_correo" value={per_correo} onChange={onInputChange} placeholder="correo@example.com" icon="fas fa-envelope" required />
                <InputField label="Usuario" type="text" name="per_usuario" value={per_usuario} onChange={onInputChange} placeholder="juangomez" icon="fas fa-user" required />
                <InputField label="Contraseña" type={isPasswordVisible ? "text" : "password"} name="per_password" value={per_password} onChange={onInputChange} placeholder="••••••••" icon={`fa-solid ${isPasswordVisible ? 'fa-eye-slash' : 'fa-eye'}`} onClick={togglePasswordVisibility} required />
                <InputField label="Confirmar Contraseña" type={isPasswordVisible ? "text" : "password"} name="confirm_password" value={confirm_password} onChange={onInputChange} placeholder="••••••••" icon={`fa-solid ${isPasswordVisible ? 'fa-eye-slash' : 'fa-eye'}`} onClick={togglePasswordVisibility} required />
                <div className="input-container-register">
                    <label>Género</label>
                    <select id="per_genero" name="per_genero" value={per_genero} onChange={onInputChange} className="custom-select-container">
                        <option hidden>Seleccione una opción</option>
                        <option value="M">Masculino</option>
                        <option value="F">Femenino</option>
                        <option value="O">Otro</option>
                    </select>
                </div>
                <InputField label="Teléfono" type="text" name="per_telefono" value={per_telefono} onChange={onInputChange} placeholder="3112345678" icon="fas fa-phone" />
                <InputField label="Foto" type="file" name="per_foto" onChange={onInputChange} />
            </div>
            <button type="submit" className="register-button">Registrarme</button>
        </form>
    );
};
