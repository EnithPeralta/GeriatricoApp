import { PersonCardGestionar } from "./PersonCardGestionar";
import { RolesDisplayGestionar } from "./RolesDisplayGestionar";

export const PersonListGestionar = ({
    personasFiltradas = [], // Asegurar que no es undefined
    activeCard,
    handleCardClick,
    openEditModal,
    openAssignCard,
    roles
}) => {
    return (
        <div>
            {personasFiltradas.length === 0 ? (
                <p>No hay personas disponibles</p>
            ) : (
                personasFiltradas
                    .filter(persona => persona !== null && persona !== undefined) // Filtrar valores nulos
                    .map(persona => (
                        <div key={`${persona.id}-${persona.documento}`} style={{ position: "relative" }}>
                            <PersonCardGestionar
                                persona={persona}
                                activeCard={activeCard}
                                onClick={() => handleCardClick(persona)}
                                onEdit={(e) => {
                                    e.stopPropagation();
                                    openEditModal(persona);
                                }}
                                onAssign={(e) => {
                                    e.stopPropagation();
                                    openAssignCard(persona);
                                }}  
                            />
                            {activeCard === persona.id && (
                                <div style={{ marginTop: "10px" }}>
                                    <RolesDisplayGestionar roles={roles} />
                                </div>
                            )}
                        </div>
                    ))
            )}
        </div>
    );
};
