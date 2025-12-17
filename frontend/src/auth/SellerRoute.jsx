import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function SellerRoute({ children }) {
  let { user, loading } = useAuth();
  
  if (loading) {
    return;
  } // or loader
  // console.log(loading + JSON.stringify(user));

  if (!user || user.role != "SELLER") {
    return <Navigate to="/" replace />;
  }

  return children;
};