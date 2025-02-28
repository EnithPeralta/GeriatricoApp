// En GeriatricoRoutes.jsx
import { Route, Routes } from "react-router-dom";
import { AdminSuper, GeriatricosPage, GestionarPersonas, GestionPersonaGeriatricoPage, HomePage, PacientesPage, ProfilePage, RolesPage, SedeEspecificaPage, SedesInactivoPage, SedesPage } from "../page";

export const GeriatricoRoutes = () => {
    return (
        <Routes>
            <Route path="home" element={<HomePage />} />
            <Route path="superAdmin" element={<AdminSuper />} />
            <Route path="sedes" element={<SedesPage />} />
            <Route path="sedesInactivos" element={<SedesInactivoPage />} />
            <Route path="pacientes" element={<PacientesPage />} />
            <Route path="sedeEspecifica" element={<SedeEspecificaPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="geriatricoActive" element={<GeriatricosPage />} />
            <Route path="roles" element={<RolesPage />} />
            <Route path="asignar" element={<GestionarPersonas />} />
            <Route path="gestionarPersonas" element={<GestionPersonaGeriatricoPage />} />
        </Routes>
    );
};
