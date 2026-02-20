import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

const PublicRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/auth/check`,
          { credentials: "include" }
        );

        if (!res.ok) throw new Error();
        setIsAuth(true);
      } catch {
        setIsAuth(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) return <div>Checking session...</div>;

  // 🔥 If already logged in → redirect to admin
  if (isAuth) return <Navigate to="/admin/dashboard" replace />;

  return children;
};

export default PublicRoute;