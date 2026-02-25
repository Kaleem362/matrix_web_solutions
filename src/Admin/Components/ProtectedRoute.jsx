import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Loader from "./Loader/Loader";

const ProtectedRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [isAuth, setIsAuth] = useState(false); // OFF

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/auth/check`,
          {
            credentials: "include", // ⚠️ MUST
          }
        );

        setIsAuth(res.status === 200);
      } catch {
        setIsAuth(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) return <div className="h-screen w-full justify-center items-center bg-indigo-900"><Loader/></div>;

  if (!isAuth) return <Navigate to="/login" replace />;

  return children;
};

export default ProtectedRoute;
