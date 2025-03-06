
/**
 * Componente que muestra los roles de una persona en una tarjeta de persona.
 * Muestra los roles de geriatrico y los roles de sede en tarjetas separadas.
 * El componente recibe un objeto con 2 propiedades:
 * rolesGeriatrico: un array de objetos con las siguientes propiedades:
 * rol_nombre: nombre del rol
 * activo: booleano que indica si el rol esta activo o no
 * fechaInicio: fecha de inicio del rol
 * fechaFin: fecha de fin del rol (puede ser null si no tiene fecha de fin)
 * rolesSede: un array de objetos con las siguientes propiedades:
 * rol_nombre: nombre del rol
 * se_nombre: nombre de la sede
 * activo: booleano que indica si el rol esta activo o no
 * fechaInicio: fecha de inicio del rol
 * fechaFin: fecha de fin del rol (puede ser null si no tiene fecha de fin)
 * Si no hay roles que mostrar, el componente devuelve null.
 */
export const RolesDisplay = ({ roles }) => {
    if (roles.rolesGeriatrico.length === 0 && roles.rolesSede.length === 0) {
        return null; // No hay roles que mostrar
    }

    return (
        <>
            {roles.rolesGeriatrico.length > 0 && (
                <div className="sede-card-asignar">
                    {roles.rolesGeriatrico.map((rol, index) => (
                        <div key={index} className="sede-info">
                            <div className="status-icon-active-sede">
                                {rol.activo ? (
                                    <i className="fa-solid fa-circle-check activo"></i>
                                ) : (
                                    <i className="fa-solid fa-circle-xmark inactivo"></i>
                                )}
                            </div>
                            <span className="full-name">{rol.rol_nombre}</span>
                            <span className="CC">{rol.fechaInicio} - {rol.fechaFin}</span>
                        </div>
                    ))}
                </div>
            )}

            {roles.rolesSede.length > 0 && (
                <div className="sede-card-asignar">
                    {roles.rolesSede.map((rol, index) => (
                        <div key={index} className="">
                            <div className="status-icon-active-sede">
                                {rol.activo ? (
                                    <i className="fa-solid fa-circle-check activo"></i>
                                ) : (
                                    <i className="fa-solid fa-circle-xmark inactivo"></i>
                                )}
                            </div>
                            <div className="sede-info">
                                <span className="full-name">{rol.rol_nombre}</span>
                                <span className="CC">{rol.se_nombre}</span>
                                <span className="CC">{rol.fechaInicio} - {rol.fechaFin ? rol.fechaFin : "Indefinido"}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </>
    );
};