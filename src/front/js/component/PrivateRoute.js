import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { Context } from "../store/appContext";

const PrivateRoute = ({ children, requiredRole }) => {
    const { store } = useContext(Context);

    // Verifica que el usuario esté logueado y tenga el rol requerido
    if (!store.user || store.user.role !== requiredRole) {
        return <Navigate to="/" />; // Redirige a Home si no cumple las condiciones
    }

    return children;
};

export default PrivateRoute;
