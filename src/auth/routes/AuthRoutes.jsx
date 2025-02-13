import { Route, Routes } from "react-router-dom"
import { ForgotPassword, LoginPage, RegisterPage } from "../page"


export const AuthRoutes = () => {
  return (
    <Routes>
      <Route path="login" element={<LoginPage />} />
      <Route path="forgotPassword" element={<ForgotPassword />} />
    </Routes>
  )
}
