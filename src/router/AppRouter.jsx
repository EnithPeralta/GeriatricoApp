import { Route, Routes } from "react-router-dom"
import { AuthRoutes } from "../auth/routes/AuthRoutes"
import { GeriatricoRoutes } from "../geriatrico/routes/GeriatricoRoutes"

export const AppRouter = () => {
  return (
    <Routes>
      <Route path="/auth/*" element={<AuthRoutes />} />
      <Route path="/geriatrico/*" element={<GeriatricoRoutes />} />
    </Routes>
  )
}
