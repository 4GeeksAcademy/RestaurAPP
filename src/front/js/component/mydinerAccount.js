import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";
import dinerAccountpng from "../../img/dinerAccount.png";
import "../../styles/mydinerAccount.css"

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
                            <div className="card-body text-center me-5">
                                <p>Cargando datos del diner...</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const { fullname, email, telephone, password } = store.especificDiner;

    const handleDelete = (id) => {
        actions.handleDelete(id);
        console.log("Eliminar cuenta de diner", id);
        navigate("/diner/login");
    };
    return (
        <div className="container mt-4 mb-5">
            <div className="row justify-content-center">
                <div className="col-lg-6 col-md-8 d-flex">
                    <div className="card-body me-5" style={{ fontFamily: 'var(--bs-body-font-family)' }}>
                        <h1 className="h3 mb-5 fw-normal text-center"><strong>Detalles del perfil</strong></h1>
                        <div className="d-flex me-5">
                            <div class="avatar avatar-xxxl">
                                <img class="avatar-img rounded-circle" src="data:image/png;base64,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" alt="avatar" />
                            </div>
                            <div className="mt-4 ms-5">
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
                            </div>
                        </div>
                        <div className="d-flex justify-content-center mt-4">
                            <button className="btn border bg-secondary text-light rounded-pill shadow-sm me-2 fw-bold mx-auto"
                                onClick={() => handleEdit(store.especificDiner.id, fullname, email, telephone, password)}
                            >
                                ✏️ Editar Cuenta
                            </button>
                            <button className="btn border text-light bg-danger rounded-pill shadow-sm fw-bold"
                                onClick={() => handleDelete(store.especificDiner.id)}
                            >
                                🗑️ Eliminar Cuenta
                            </button>
                        </div>
                    </div>

                    {/* Imagen del perfil a la derecha
                    <div className=" d-none d-md-block">
                        <img
                            className="img-fluid profile-img me-5"
                            src={dinerAccountpng}
                            alt="Profile"
                            style={{
                                maxWidth: '150%',
                                height: 'auto',
                                transition: 'transform 0.3s ease',
                            }}
                        />
                    </div> */}
                </div>
            </div>

            {/* Botón de "Volver" en la parte superior */}
            <div className="fixed-top" style={{ zIndex: 1030 }}>
                <div className="container">
                    <div className="col-md-4 mb-4">
                        <div className="d-flex justify-content-start mt-3">
                            <button
                                type="button"
                                className="btn btn-warning text-dark rounded-pill fw-bold shadow-sm mt-3 fw-bold"
                                onClick={() => navigate("/diner/dashboard")}
                                style={{ position: 'absolute', top: '10px', left: '10px', zIndex: 1050 }}
                            >
                                <i class="fas fa-arrow-left me-2"></i> Volver
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

