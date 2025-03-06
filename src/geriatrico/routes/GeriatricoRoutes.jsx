import { Route, Routes } from "react-router-dom";
import { AdminSuper, EnfermerasPage, GeriatricosPage, GestionarPersonas, GestionPersonaGeriatricoPage, HistorialRoles, HomePage, PacientesPage, ProfilePage, RolesPage, SedeEspecificaPage, SedesPage } from "../page";

export const GeriatricoRoutes = () => {
    return (
        <Routes>
            <Route path="home" element={<HomePage />} />
            <Route path="superAdmin" element={<AdminSuper />} />
            <Route path="sedes" element={<SedesPage />} />
            <Route path="pacientes" element={<PacientesPage />} />
            <Route path="sedeEspecifica" element={<SedeEspecificaPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="geriatrico" element={<GeriatricosPage />} />
            <Route path="roles" element={<RolesPage />} />
            <Route path="asignar" element={<GestionarPersonas />} />
            <Route path="gestionarPersonas" element={<GestionPersonaGeriatricoPage />} />
            <Route path="historial/:id" element={<HistorialRoles />} />
            <Route path="enfermeras" element={<EnfermerasPage />} />
        </Routes>
    );
};
