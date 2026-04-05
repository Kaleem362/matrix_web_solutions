import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Loader from "./Loader/Loader";
import { getApiBase } from "../../utils/api.js";
// ✅ Same helper as Login.jsx — always consistent


const ProtectedRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch(
          `${getApiBase()}/api/auth/check`, // ✅ slash is on the path, not the base
          {
            credentials: "include",
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

  if (loading) return (
    <div className="h-screen w-full flex justify-center items-center bg-indigo-900">
      <Loader />
    </div>
  );

  if (!isAuth) return <Navigate to="/login" replace />;

  return children;
};

export default ProtectedRoute;