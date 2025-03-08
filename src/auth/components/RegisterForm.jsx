import { useEffect, useRef, useState } from 'react';
import { useAuthStore, useEnfermera, useForm, usePaciente, usePersona, useSession } from '../../hooks';
import Swal from 'sweetalert2';
import { InputField } from './InputField/InputField';
import { ModalRegistrarPaciente } from '../../geriatrico/components/ModalRegistrarPaciente ';
import { ModalEnfermera } from '../../geriatrico/components/ModalEnfermera';
import { SelectField } from './SelectField/SelectField';
import { FieldSelect } from './FieldSelect/FieldSelect';

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
    const { registrarPaciente } = usePaciente();
    const { obtenerSesion } = useSession();
    const { startRegisterEnfermera } = useEnfermera();
    const [esSuperAdmin, setEsSuperAdmin] = useState(false);
    const [loading, setLoading] = useState(false);
    const { buscarVincularPersona } = usePersona()
    const [adminGeriátrico, setAdminGeriátrico] = useState(null);
    const [selectedPersona, setSelectedPersona] = useState(null);
    const [selectedRoles, setSelectedRoles] = useState([]);
    const [showExtraFields, setShowExtraFields] = useState("");
    const fetchedRef = useRef(false);
    const [showModal, setShowModal] = useState(false);
    const [showSelectRoles, setShowSelectRoles] = useState(false);
    const [showModalEnfermera, setShowModalEnfermera] = useState(false);



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
        rol_id,
        pac_edad,
        pac_peso,
        pac_talla,
        pac_regimen_eps,
        pac_nombre_eps,
        pac_rh_grupo_sanguineo,
        pac_talla_camisa,
        pac_talla_pantalon,
        enf_codigo,
        sp_fecha_inicio,
        sp_fecha_fin,
        togglePasswordVisibility
    } = useForm(registerFormFields);

    useEffect(() => {
        if (errorMessage) {
            Swal.fire({
                icon: 'error',
                text: errorMessage
            });
        }
    }, [errorMessage]);

    const buscarPersona = async () => {
        if (!per_documento.trim()) return;

        setLoading(true);
        try {
            const sesion = await obtenerSesion();
            const ge_id = sesion?.ge_id;

            const resultado = await buscarVincularPersona({ documento: per_documento, ge_id });
            console.log(resultado); // Para depuración

            if (resultado.success) {
                setSelectedPersona(resultado);

                Swal.fire({
                    icon: 'question',
                    text: resultado.message,
                    confirmButtonText: 'Aceptar',
                });

                // Esperamos a que el usuario seleccione un rol antes de mostrar el modal correcto
                setShowSelectRoles(true);
            } else {
                Swal.fire({
                    icon: 'error',
                    text: resultado.message,
                });
            }
        } catch (error) {
            console.error("❌ Error al buscar la persona:", error);
            Swal.fire({
                icon: 'error',
                text: 'Ocurrió un error al buscar la persona.',
            });
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        // showExtraFields se activa si el usuario elige el rol 3 (Admin Sede)
        setShowExtraFields(rol_id === 3 && !esSuperAdmin && !adminGeriátrico);
    }, [rol_id, esSuperAdmin, adminGeriátrico]);

    const handleRoleChange = (event) => {
        const value = Number(event.target.value); // Asegurar que sea un número
        setSelectedRoles(value);
        setShowExtraFields(value === 4); // Compara estrictamente con ===
        setShowModalEnfermera(value === 5);
    };



    const handlePacientes = async (datosPaciente) => {
        if (!datosPaciente.per_id) {
            Swal.fire({
                icon: 'warning',
                text: "⚠️ No se ha seleccionado una persona válida.",
            });
            return;
        }

        console.log("📤 Enviando datos del paciente:", datosPaciente);

        try {
            const response = await registrarPaciente(datosPaciente);
            console.log("✅ Respuesta del backend en handlePacientes:", response);

            Swal.fire({
                icon: response?.success ? 'success' : 'error',
                text: response?.message || "Error desconocido",
            });

        } catch (error) {
            console.error("❌ Error al registrar paciente:", error);
            Swal.fire({
                icon: 'error',
                text: error?.response?.data?.message || "Error al registrar paciente"
            });
        }
    };


    const handleEnfermera = async (datosEnfermera) => {
        if (!datosEnfermera.per_id) {
            Swal.fire({
                icon: 'warning',
                text: "⚠️ No se ha seleccionado una persona válida.",
            });
            return;
        }

        console.log("📤 Enviando datos de la enfermera:", datosEnfermera)

        try {
            const response = await startRegisterEnfermera(datosEnfermera);
            console.log(response);

            Swal.fire({
                icon: response.success ? 'success' : 'error',
                text: response.message,
            });

            if (response.success) {
                setShowModal(false); // Cierra el modal si el registro es exitoso
            } else {
                console.error("❌ Error al registrar enfermera:", response.message);
            }
        } catch (error) {
            console.error("❌ Error al registrar enfermera:", error.response.data.message);
            Swal.fire({
                icon: 'error',
                text: error.response.data.message
            })
        }
    };

    function validRegister() {
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
                per_foto,
                rol_id: selectedRoles
            });

            const idPersona = response?.data?.per_id;
            if (!idPersona) {
                Swal.fire({ icon: 'error', text: 'No se pudo obtener el ID de la persona' });
                return;
            }

            // Convertir selectedRoles a número en caso de que sea string
            const rolId = Number(selectedRoles);

            if (rolId === 4) {  // Paciente
                const datosPaciente = {
                    per_id: idPersona,  // Se corrige el nombre del campo
                    rol_id: rolId,      // Se incluye el rol_id
                    pac_edad,
                    pac_peso,
                    pac_talla,
                    pac_regimen_eps,
                    pac_nombre_eps,
                    pac_rh_grupo_sanguineo,
                    pac_talla_camisa,
                    pac_talla_pantalon,
                    sp_fecha_inicio,
                    sp_fecha_fin
                };

                console.log("📤 Enviando datos del paciente:", datosPaciente);
                await handlePacientes(datosPaciente);
                Swal.fire({
                    icon: 'success',
                    text: response?.message
                })
                console.log("Datos paciente registrados:", datosPaciente);
            } else if (rolId === 5) {
                const datosEnfermera = {
                    per_id: idPersona,
                    rol_id: rolId,
                    enf_codigo,
                    sp_fecha_inicio,
                    sp_fecha_fin
                }

                console.log("📤 Enviando datos de la enfermera:", datosEnfermera);
                await handleEnfermera(datosEnfermera);
                Swal.fire({
                    icon: 'success',
                    text: response?.message
                })
                console.log("Datos enfermera registrados:", datosEnfermera);
            } else (
                Swal.fire({
                    icon: 'error',
                    text: 'El rol seleccionado no es válido'
                })
            )
            Swal.fire({
                icon: 'success',
                text: 'La cuenta ha sido creada correctamente',
                timer: 2000,
                showConfirmButton: false
            });

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
                <InputField label="Foto" type="file" name="per_foto" onChange={onInputChange} accept="image/*" />

                {validRegister() && (
                    <div className="roles-assignment" >
                        <FieldSelect label="Rol" name="rol_id" value={selectedRoles} onChange={handleRoleChange} />

                        {/* Se activan los campos adicionales SOLO si el usuario tiene rol 4 (Paciente) */}
                        {showExtraFields && (
                            <div >
                                <InputField label="Edad" type="text" name="pac_edad" value={pac_edad} onChange={onInputChange} placeholder="Edad" required />
                                <InputField label="Peso" type="text" name="pac_peso" value={pac_peso} onChange={onInputChange} placeholder="Peso" required />
                                <InputField label="Estatura" type="text" name="pac_talla" value={pac_talla} onChange={onInputChange} placeholder="Estatura" required />
                                <InputField label="Régimen EPS" type="text" name="pac_regimen_eps" value={pac_regimen_eps} onChange={onInputChange} placeholder="Régimen EPS" required />
                                <InputField label="EPS" type="text" name="pac_nombre_eps" value={pac_nombre_eps} onChange={onInputChange} placeholder="EPS" required />
                                <InputField label="Grupo sanguíneo" type="text" name="pac_rh_grupo_sanguineo" value={pac_rh_grupo_sanguineo} onChange={onInputChange} placeholder="Grupo sanguíneo" required />
                                <InputField label="Talla de camisa" type="text" name="pac_talla_camisa" value={pac_talla_camisa} onChange={onInputChange} placeholder="Talla de camisa" required />
                                <InputField label="Talla de pantalón" type="text" name="pac_talla_pantalon" value={pac_talla_pantalon} onChange={onInputChange} placeholder="Talla de pantalón" required />
                                <InputField label="Fecha de inicio" type="date" name="sp_fecha_inicio" value={sp_fecha_inicio} onChange={onInputChange} placeholder="aaaa-mm-dd" required />
                                <InputField label="Fecha de fin" type="date" name="sp_fecha_fin" value={sp_fecha_fin} onChange={onInputChange} placeholder="aaaa-mm-dd" required />
                            </div>
                        )}
                        {showModalEnfermera && (
                            <div className="input-grid">
                                <InputField label="Fecha inicio" type="date" name="sp_fecha_inicio" value={sp_fecha_inicio} onChange={onInputChange} placeholder="aaaa-mm-dd" required />
                                <InputField label="Fecha fin" type="date" name="sp_fecha_fin" value={sp_fecha_fin} onChange={onInputChange} placeholder="aaaa-mm-dd" required />
                                <InputField label="Codigo" type="cc" name="enf_codigo" value={enf_codigo} onChange={onInputChange} placeholder="1234567890" required />
                            </div>
                        )}
                    </div>
                )}

            </div>
            <button type="submit" className="register-button">Registrarme</button>
            {showSelectRoles && selectedPersona && (
                <SelectField
                    name="rol_id"
                    value={selectedRoles}
                    onChange={(roles) => {
                        const rolesNumericos = roles.map(Number);
                        setSelectedRoles(rolesNumericos);

                        const rolSeleccionado = rolesNumericos[0] || null;

                        if (rolSeleccionado === 5) {
                            setShowModalEnfermera(true);
                            setShowModal(false);
                        } else {
                            setShowModal(true);
                            setShowModalEnfermera(false);
                        }
                    }}
                />
            )}

            {showModal && selectedPersona && (
                <ModalRegistrarPaciente
                    datosIniciales={selectedPersona}
                    onClose={() => setShowModal(false)}
                    selectedRoles={selectedRoles}
                    setSelectedRoles={setSelectedRoles}
                />
            )}

            {showModalEnfermera && selectedPersona && (
                <ModalEnfermera
                    datosInicial={selectedPersona}
                    onRegistrar={handleEnfermera}
                    onClose={() => setShowModalEnfermera(false)}
                    selectedRoles={selectedRoles}
                    setSelectedRoles={setSelectedRoles}
                />
            )}

        </form>
    );
};

