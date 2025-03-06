import { useEffect, useRef, useState } from 'react';
import { useAuthStore, useEnfermera, useForm, usePaciente, usePersona, useSession } from '../../hooks';
import Swal from 'sweetalert2';
import { InputField } from './InputField/InputField';
import { useSedesRol } from '../../hooks';
import { ModalRegistrarPaciente } from '../../geriatrico/components/ModalRegistrarPaciente ';
import { AssignCard } from '../../geriatrico/components/AssignCard';
import { ModalEnfermera } from '../../geriatrico/components/ModalEnfermera';
import { SelectField } from './SelectField/SelectField';

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
    const {startRegisterEnfermera } = useEnfermera();
    const { asignarRolAdminSede, inactivarRolAdminSede, asignarRolesSede } = useSedesRol();
    const [esSuperAdmin, setEsSuperAdmin] = useState(false);
    const [loading, setLoading] = useState(false);
    const { buscarVincularPersona } = usePersona()
    const [adminGeriátrico, setAdminGeriátrico] = useState(null);
    const [showAssignCard, setShowAssignCard] = useState(false);
    const [selectedPersona, setSelectedPersona] = useState(null);
    const [selectedRoles, setSelectedRoles] = useState([]);
    const [fechaInicio, setFechaInicio] = useState("");
    const [fechaFin, setFechaFin] = useState("");
    const [selectedSedes, setSelectedSedes] = useState("");
    const [assigning, setAssigning] = useState(false);
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
      

    // const handleAssignRole = async () => {
    //     if (!selectedPersona || selectedSedes.length === 0 || selectedRoles.length === 0 || !fechaInicio) {
    //         console.log("Validación fallida: ", selectedRoles, selectedSedes, selectedPersona, fechaInicio, fechaFin);
    //         Swal.fire({
    //             icon: "error",
    //             text: "Debe seleccionar al menos una sede y un rol, y definir la fecha de inicio.",
    //         });
    //         return;
    //     }
    //     setAssigning(true);
    //     try {
    //         for (let rol_id of selectedRoles) {
    //             const response = await asignarRolAdminSede({
    //                 per_id: selectedPersona.per_id,
    //                 se_id: Number(selectedSedes),
    //                 rol_id: rol_id,
    //                 sp_fecha_inicio: fechaInicio,
    //                 sp_fecha_fin: fechaFin || null,
    //             });
    //             console.log("Respuesta del servidor:", response);
    //             if (!response.success) {
    //                 throw new Error(response.message);
    //             }
    //         }
    //         Swal.fire({
    //             icon: "success",
    //             text: "Rol asignado exitosamente",
    //         });
    //         resetForm();
    //     } catch (error) {
    //         console.error("Error al asignar rol:", error);
    //         Swal.fire({
    //             icon: "error",
    //             text: error.message || "Error al asignar rol",
    //         });
    //     } finally {
    //         setAssigning(false);
    //     }
    // };
    // const handleAssignSedes = async () => {
    //     try {
    //         // Validar que los valores requeridos estén presentes
    //         if (!selectedPersona?.per_id || !selectedRoles || !fechaInicio) {
    //             console.warn("❌ Datos incompletos para la asignación del rol.");
    //             await Swal.fire({
    //                 icon: "warning",
    //                 text: "Por favor, complete todos los campos obligatorios antes de asignar el rol."
    //             });
    //             return;
    //         }

    //         // Enviar solicitud para asignar rol
    //         const response = await asignarRolesSede({
    //             per_id: selectedPersona.per_id,
    //             rol_id: selectedRoles,
    //             sp_fecha_inicio: fechaInicio,
    //             sp_fecha_fin: fechaFin || null,
    //         });

    //         // Manejo de la respuesta del servidor
    //         if (response?.success) {
    //             console.log("✅ Rol asignado con éxito:", response.message);
    //             await Swal.fire({
    //                 icon: "success",
    //                 text: response.message
    //             });

    //             // Si el rol asignado es "Paciente", mostrar mensaje adicional y abrir modal
    //             if (response.rolNombre === "Paciente" && response.mensajeAdicional) {
    //                 await Swal.fire({
    //                     icon: "info",
    //                     text: response.mensajeAdicional,
    //                 });
    //                 setShowModal(true);
    //             }
    //         } else {
    //             console.warn("⚠️ Error en la asignación del rol:", response?.message || "Error desconocido.");
    //             await Swal.fire({
    //                 icon: "error",
    //                 text: response?.message || "Hubo un problema al asignar el rol."
    //             });
    //         }
    //     } catch (error) {
    //         console.error("❌ Error inesperado al asignar el rol:", error);
    //         await Swal.fire({
    //             icon: "error",
    //             text: error?.message || "Ocurrió un error inesperado. Inténtelo nuevamente."
    //         });
    //     }
    // };
    // const handlePaciente = async (datosPaciente) => {
    //     if (!datosPaciente || !datosPaciente.per_id) {
    //         Swal.fire({
    //             icon: 'warning',
    //             text: "⚠️ No se ha seleccionado una persona válida.",
    //         });
    //         return;
    //     }

    //     console.log("📤 Enviando datos del paciente:", datosPaciente);

    //     try {
    //         const response = await registrarPaciente(datosPaciente);

    //         if (response.success) {
    //             Swal.fire({
    //                 icon: 'success',
    //                 text: response.message,
    //             });
    //             setShowModal(false);
    //         } else {
    //             Swal.fire({
    //                 icon: 'error',
    //                 text: response.message,
    //             });
    //         }
    //     } catch (error) {
    //         console.error("❌ Error al registrar paciente:", error);

    //         let errorMessage = "Ocurrió un error inesperado. Inténtalo nuevamente.";
    //         if (error.response?.data?.message) {
    //             errorMessage = error.response.data.message;
    //         } else if (error.request) {
    //             errorMessage = "No se pudo conectar con el servidor.";
    //         }

    //         Swal.fire({
    //             icon: 'error',
    //             text: errorMessage,
    //         });
    //     }
    // };

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
    
    const resetForm = () => {
        setShowAssignCard(false);
        setSelectedPersona(null);
        setSelectedRoles([]);
        setSelectedSedes("");
        setFechaInicio("");
        setFechaFin("");
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

            {/* {showAssignCard && selectedPersona?.per_id && (
                <AssignCard
                    selectedRoles={selectedRoles}
                    setSelectedRoles={setSelectedRoles}
                    selectedSedes={selectedSedes}
                    setSelectedSedes={setSelectedSedes}
                    fechaInicio={fechaInicio}
                    setFechaInicio={setFechaInicio}
                    fechaFin={fechaFin}
                    setFechaFin={setFechaFin}
                    assigning={assigning}
                    handleAssignRole={handleAssignRole}
                    handleAssignSedes={handleAssignSedes}
                />
            )} */}
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

