import { useState, useEffect } from 'react';
import { useAuthStore, useForm } from '../../hooks';
import { useGeriatricoPersonaRol } from '../../hooks/useGeriatricoPersonaRol';
import Swal from 'sweetalert2';
import { SelectField } from './SelectField';
import { InputField } from './InputField/InputField';

const registerFormFields = {
    per_password: '',
    confirm_password: '',
    per_usuario: '',
    per_genero: '',
    per_telefono: '',
    per_nombre_completo: '',
    per_documento: '',
    per_correo: '',
    per_foto: '',
    rol_id: '',
    ge_id: '',
    gp_fecha_inicio: '',
    gp_fecha_fin: ''
};

export const RegisterForm = () => {
    const { startRegister, errorMessage } = useAuthStore();
    const { asignarRolGeriatrico } = useGeriatricoPersonaRol();
    const [showExtraFields, setShowExtraFields] = useState(false);

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
        rol_id,
        ge_id,
        gp_fecha_inicio,
        gp_fecha_fin,
        onInputChange,
        isPasswordVisible,
        togglePasswordVisibility
    } = useForm(registerFormFields);

    useEffect(() => {
        setShowExtraFields(rol_id === "2");
    }, [rol_id]);

    useEffect(() => {
        if (errorMessage) {
            Swal.fire({ title: 'Error en la autenticación', icon: 'error', text: errorMessage });
        }
    }, [errorMessage]);

    const handleRoleChange = (event) => {
        onInputChange(event);
        setShowExtraFields(event.target.value === "2");
    };

    function validRegisterForm() {
        return per_password && confirm_password && per_usuario && per_genero && per_telefono && per_nombre_completo && per_documento && per_correo;
    }

    const registroSubmit = async (e) => {
        e.preventDefault();
    
        if (per_password !== confirm_password) {
            Swal.fire({ title: 'Error', icon: 'error', text: 'Las contraseñas no coinciden' });
            return;
        }
    
        try {
            const response = await startRegister({
                per_correo,
                per_usuario,
                per_genero,
                per_telefono,
                per_nombre_completo,
                per_password,
                per_documento,
                per_foto
            });
    
            const idPersona = response?.data?.per_id;
            
            if (idPersona) {
                await asignarRol(idPersona);
            } else {
                Swal.fire({ title: 'Error', icon: 'error', text: response?.message || 'Error en el registro' });
            }
        } catch (error) {
            console.error("Error en el registro:", error);
            Swal.fire({ title: 'Error', icon: 'error', text: 'Hubo un problema al registrar a la persona' });
        }
    };
    
    const asignarRol = async (idPersona) => {
        if (!idPersona || !ge_id || !rol_id || !gp_fecha_inicio || !gp_fecha_fin) {
            Swal.fire({ title: 'Error', icon: 'error', text: 'Faltan datos para asignar el rol' });
            return;
        }
        
        const asignacionResponse = await asignarRolGeriatrico({
            per_id: idPersona,
            ge_id,
            rol_id,
            gp_fecha_inicio,
            gp_fecha_fin
        });
    
        if (asignacionResponse?.success) {
            Swal.fire({ title: 'Éxito', icon: 'success', text: 'Rol asignado correctamente' });
        } else {
            Swal.fire({ title: 'Error', icon: 'error', text: asignacionResponse?.message || 'No se pudo asignar el rol' });
        }
    };

    return (
        <form className="form-container" onSubmit={registroSubmit}>
            <div className="input-grid">
                <InputField label="Nombre completo" type="text" name="per_nombre_completo" value={per_nombre_completo} onChange={onInputChange} placeholder="Juan Gomez" icon="fas fa-user" required/>
                <InputField label="E-mail" type="email" name="per_correo" value={per_correo} onChange={onInputChange} placeholder="correo@example.com" icon="fas fa-envelope" required/>
                <InputField label="C.C" type="text" name="per_documento" value={per_documento} onChange={onInputChange} placeholder="106168102" icon="fas fa-id-card" required/>
                <InputField label="Usuario" type="text" name="per_usuario" value={per_usuario} onChange={onInputChange} placeholder="juangomez" icon="fas fa-user" required/>
                <InputField label="Contraseña" type={isPasswordVisible ? "text" : "password"} name="per_password" value={per_password} onChange={onInputChange} placeholder="••••••••" icon={`fa-solid ${isPasswordVisible ? 'fa-eye-slash' : 'fa-eye'}`} onClick={togglePasswordVisibility} required/>
                <InputField label="Confirmar Contraseña" type={isPasswordVisible ? "text" : "password"} name="confirm_password" value={confirm_password} onChange={onInputChange} placeholder="••••••••" icon={`fa-solid ${isPasswordVisible ? 'fa-eye-slash' : 'fa-eye'}`} onClick={togglePasswordVisibility} required/>
                <InputField label="Genero" type="text" name="per_genero" value={per_genero} onChange={onInputChange} placeholder="M" icon="fas fa-male" />
                <InputField label="Teléfono" type="text" name="per_telefono" value={per_telefono} onChange={onInputChange} placeholder="3112345678" icon="fas fa-phone" />
                <InputField label="Foto" type="file" name="per_foto" onChange={onInputChange} />
            </div>
            {validRegisterForm() && (
                <div className="role-assignment">
                    <SelectField label="Rol" name="rol_id" value={rol_id} onChange={handleRoleChange} />
                    {showExtraFields && (
                        <>
                            <InputField label="ID Geriátrico" type="text" name="ge_id" value={ge_id} onChange={onInputChange} required={showExtraFields}/>
                            <InputField label="Fecha Inicio" type="date" name="gp_fecha_inicio" value={gp_fecha_inicio} onChange={onInputChange} required={showExtraFields}/>
                            <InputField label="Fecha Fin" type="date" name="gp_fecha_fin" value={gp_fecha_fin} onChange={onInputChange} required={showExtraFields}/>
                        </>
                    )}
                </div>
            )}
            <button type="submit">Registrarme</button>            
        </form>
    );
};
