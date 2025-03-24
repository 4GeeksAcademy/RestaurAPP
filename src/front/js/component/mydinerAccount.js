import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";

export const DinerAccount = () => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();

    const maskPassword = (password) => {
        if (!password) return "";
        return "*".repeat(password.length);  // Retorna el password como asteriscos
    };

    function handleEdit(id, fullname, email, telephone, password) {
        console.log('se edito');
        navigate(`/dineredit/${id}`, { state: { id, fullname, email, telephone, password } });
    }

    useEffect(() => {
        if (localStorage.getItem("tokenDiner")) {
            const dinerID = localStorage.getItem("dinerId");
            if (dinerID) {
                actions.getSpecifidiner(dinerID); 
                console.log("Datos del diner cargados");
            }
        } else {
            navigate("/diner/login");
        }
    }, []);

    if (!store.especificDiner || Object.keys(store.especificDiner).length === 0) {
        return (
            <div className="container mt-4">
                <div className="row justify-content-center">
                    <div className="col-lg-6 col-md-8">
                        <div className="card">
                            <div className="card-body text-center">
                                <p>Cargando datos del diner...</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Asegurarse que todos los datos están disponibles antes de mostrar
    const { fullname, email, telephone, password } = store.especificDiner;

    return (
        <div className="container mt-4">
            <div className="row justify-content-center">
                <div className="col-lg-6 col-md-8">
                    <div className="card">
                        <div className="card-body">
                            <h1 className="h3 mb-3 fw-normal text-center"><strong>Mi Cuenta</strong></h1>
                            <div className="mb-3">
                                <strong>Full Name:</strong> {fullname}
                            </div>
                            <div className="mb-3">
                                <strong>Email:</strong> {email}
                            </div>
                            <div className="mb-3">
                                <strong>Telephone:</strong> {telephone}
                            </div>
                            <div className="mb-3">
                                <strong>Password:</strong> {maskPassword(password)}
                            </div>
                            <div className="d-flex justify-content-center mt-4">
                                <button
                                    className="btn btn-primary"
                                    onClick={() => handleEdit(store.especificDiner.id, fullname, email, telephone, password)}
                                >
                                    Editar Cuenta
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-5 d-flex justify-content-between">
                <button type="button" className="btn btn-secondary" onClick={() => navigate("/diner/dashboard")}>
                    Volver
                </button>
            </div>

            {store.dinerReservations.length === 0 && (
                <div className="alert alert-warning text-center mt-4" role="alert">
                    No tienes reservas.
                </div>
            )}
        </div>
    );
};
