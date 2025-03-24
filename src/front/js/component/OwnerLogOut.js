import React, { useContext } from "react";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";

const OwnerLogout = () => {
    const { actions } = useContext(Context);
    const navigate = useNavigate();

    const handleLogout = () => {
        actions.ownerLogout();
        localStorage.clear();
        navigate("/");
    };

    return (
        <div className="container mt-5 d-flex justify-content-between">
            <button type="button" className="btn btn-danger" onClick={handleLogout}>
                Cerrar sesión
            </button>
            <button type="button" className="btn btn-primary" onClick={() => navigate("/")}>
                Home page
            </button>
        </div>
    );
};

export default OwnerLogout;
