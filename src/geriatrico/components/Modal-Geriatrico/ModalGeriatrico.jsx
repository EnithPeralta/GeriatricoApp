import '../../../css/geriatrico.css'

export const ModalGeriatrico = ({ geriatrico, isOpen, onClose }) => {
    if (!isOpen || !geriatrico) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="content-modal" onClick={(e) => e.stopPropagation()}>
                <h2 className="geriatrico-name">{geriatrico.ge_nombre}</h2>
                <p className="geriatrico-nit-modal">NIT: {geriatrico.ge_nit}</p>
                <ul>
                    {geriatrico.sedes.length > 0 ? (
                        geriatrico.sedes.map((sede, index) => (
                            <div key={index} className="sede-item">
                                <img src={sede.se_foto} alt="Logo" className="geriatrico-logo" />
                                <span className="sede-name">Nombre: {sede.se_nombre}</span>
                                <span className="sede-name">Dirección: {sede.se_direccion}</span>
                                <span className="sede-name">Teléfono: {sede.se_telefono}</span>
                                <span className="sede-name">Cupos: {sede.cupos_totales}</span>
                            </div>
                        ))
                    ) : (
                        <p>No hay sedes registradas</p>
                    )}
                </ul>
                <button onClick={onClose} className="details-button">Cerrar</button>
            </div>
        </div>
    );
};
