// En GeriatricoRoutes.jsx
import { Route, Routes } from "react-router-dom";
import { AdminPage, GeriatricoInactivoPage, GeriatricosPage, HomePage, PacientesPage, ProfilePage, RolesPage, SedeEspecificaPage, SedesPage } from "../page";

export const GeriatricoRoutes = () => {
    return (
        <Routes>
            <Route path="home" element={<HomePage />} />
            <Route path="admin" element={<AdminPage />} />
            <Route path="sedes" element={<SedesPage />} />
            <Route path="pacientes" element={<PacientesPage />} />
            <Route path="sedeEspecifica" element={<SedeEspecificaPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="geriatricoActive" element={<GeriatricosPage />} />
            <Route path="geriatricoInactive" element={<GeriatricoInactivoPage />} />
            <Route path="roles" element={<RolesPage />} />
        </Routes>
    );
};
