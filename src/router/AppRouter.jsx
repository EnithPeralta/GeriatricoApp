import { Navigate, Route, Routes } from "react-router-dom";
import { useAuthStore } from "../hooks/useAuthStore";
import { ForgotPassword, RegisterPage, ResetPassword } from "../auth/page";
import { AuthRoutes } from "../auth/routes/AuthRoutes";
import { GeriatricoRoutes } from "../geriatrico/routes/GeriatricoRoutes";
import { useEffect } from "react";
import { CargandoComponent } from "../geriatrico/components/CargandoComponent";

export const AppRouter = () => {
  const { status, checkAuthToken } = useAuthStore();

  useEffect(() => {
    checkAuthToken();
  }, []);

  if (status === "checking") {
    return <CargandoComponent />;
  }

  return (
    <Routes>
      <Route path="/restablecerPassword/:token" element={<ResetPassword />} />
      <Route path="/forgotPassword" element={<ForgotPassword />} />


      {status === "authenticated" ? (
        <>
          <Route path="/geriatrico/*" element={<GeriatricoRoutes />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/*" element={<Navigate to="/" />} />
        </>
      ) : (
        <>
          <Route path="/auth/*" element={<AuthRoutes />} />
          <Route path="/" element={<Navigate to="/auth/login" />} />
        </>
      )}
    </Routes>
  );
};
