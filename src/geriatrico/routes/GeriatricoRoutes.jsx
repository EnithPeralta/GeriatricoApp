import { Route, Routes } from "react-router-dom"
import { AdminPage } from "../page/AdminPage"
import { SedesPage } from "../page/SedesPage"
import { PacientesPage } from "../page/PacientesPage"
import { SedeEspecificaPage } from "../page/SedeEspecificaPage"

export const GeriatricoRoutes = () => {
    return (
        <Routes>
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/sedes" element={<SedesPage />} />
            <Route path="/pacientes" element={<PacientesPage />} />
            <Route path="/sedeEspecifica" element={<SedeEspecificaPage />} />
        </Routes>
    )
}
