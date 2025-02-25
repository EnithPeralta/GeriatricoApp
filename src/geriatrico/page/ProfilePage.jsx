import React, { useEffect, useState } from 'react';
import '../../css/profile.css';
import { useAuthStore } from '../../hooks/useAuthStore';
import { usePersona } from '../../hooks/usePersona';
import { CargandoComponent, ModalUpdatePerson } from '../components';
import { GoBackButton } from '../components/GoBackButton';

export const ProfilePage = () => {
  const { startLogout } = useAuthStore();
  const { getAuthenticatedPersona } = usePersona();
  const { updatePerfil } = usePersona();  // Usar el hook para obtener la función de actualización
  const [persona, setPersona] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editedPersona, setEditedPersona] = useState(null);

  useEffect(() => {
    let isMounted = true; // Evita cambios en estado si el componente se desmonta

    const fetchPersona = async () => {
      try {
        const result = await getAuthenticatedPersona();
        if (isMounted) {
          setPersona(result.success ? result.persona : null);
        }
      } catch (error) {
        console.error("Error en la solicitud:", error.message);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchPersona();

    return () => {
      isMounted = false; // Evita que el estado se actualice en un componente desmontado
    };
  }, []); // 🔹 Se ej

  const handleEdit = () => {
    setShowModal(true);
  };

  if (loading) {
    return <CargandoComponent />;
  }

  if (!persona) {
    return <div>Error al cargar el perfil</div>;
  }

  return (
    <div className="body-profile">
      <GoBackButton />
      <button onClick={startLogout} className="btn">Cerrar sesión</button>
      <div className="container-profile">
        <h2 className="h2">Perfil</h2>
        <div className="profile-card">
          <div className="info">
            <div className="profile-picture">
              {persona.foto ? (
                <img src={persona.foto} alt="Foto de perfil" className="profile-img" />
              ) : (
                <i className="fas fa-user-circle"></i>
              )}
            </div>

            <div>
              <strong>Nombre Completo:</strong> {persona.nombre}<br />
              <strong>C.C:</strong> {persona.documento}<br />
            </div>
          </div>
        </div>

        <div className="info-card">
          <h2>Información Personal</h2>
          <div className="grid-4-columns">
            <button className="btn-edit-profile" onClick={handleEdit}>Editar</button>
            <div>
              <label className='label'>Nombres Completo:</label>
              <input className='input' type="text" value={persona.nombre} readOnly />
            </div>

            <div>
              <label className='label'>Usuario:</label>
              <input className='input' type="text" value={persona.usuario} readOnly />
            </div>

            <div>
              <label className='label'>Género:</label>
              <input className='input' type="text" value={persona.genero} readOnly />
            </div>

            <div>
              <label className='label'>C.C:</label>
              <input className='input' type="text" value={persona.documento} readOnly />
            </div>

            <div>
              <label className='label'>Correo:</label>
              <input className='input' type="text" value={persona.correo} readOnly />
            </div>
            {/* 
            <div>
              <label className='label'>Contraseña:</label>
              <input className='input' type="text" value={persona.password} readOnly />
            </div> */}

            <div>
              <label className='label'>Teléfono:</label>
              <input className='input' type="text" value={persona.telefono} readOnly />
            </div>
          </div>
        </div>
      </div>

      <ModalUpdatePerson
        persona={editedPersona}
        updatePersona={updatePerfil}
        setPersona={setPersona}
        showModal={showModal}
        setShowModal={setShowModal}
      />
    </div>
  );
};
