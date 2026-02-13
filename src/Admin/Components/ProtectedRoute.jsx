import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

const ProtectedRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/auth/check`,
          {
            credentials: "include",
          }
        );

        if (res.status === 200) {
          setIsAuth(true);
        }
      } catch (err) {
        console.error("Auth check error:", err);
        setIsAuth(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // 🚨 IMPORTANT: dashboard render mat hone do
  if (loading) return <div>Checking authentication...</div>;

  if (!isAuth) return <Navigate to="/login" replace />;

  return children;
};

export default ProtectedRoute;
