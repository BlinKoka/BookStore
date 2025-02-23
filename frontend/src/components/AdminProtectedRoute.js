import { Navigate, Outlet } from "react-router-dom";

const AdminProtectedRoute = () => {
    const token = localStorage.getItem("accessToken");
    const role = localStorage.getItem("role"); // Assuming you store the user's role in localStorage

    return token && role === "admin" ? <Outlet /> : <Navigate to="/login" replace />;
};

export default AdminProtectedRoute;