import React from "react";
import "../../styles/contactUs.css"

const ContactUs = () => {
    return (

        <section className="pt-4 pt-md-5 mb-4">
            <div className="container">
                <div className="row mb-5">
                    <div className="col-xl-10">
                        <h1>Conectémonos y conozcámonos.</h1>
                        <p className="lead mb-0">
                            ¡Haz que tu restaurante se destaque! 🍽️✨
                            ¿Sabías que la manera en que promocionas tu restaurante puede ser la clave para atraer más clientes?
                            No dejes que tu restaurante pase desapercibido. ¡Es momento de dar el siguiente paso y hacer crecer tu negocio! Contáctanos hoy y descubre cómo podemos ayudarte a llevar tu restaurante al siguiente nivel.

 
   

                            ¡Contáctanos ahora y empieza a atraer más comensales!
                        </p>
                    </div>
                </div>
                <div className="row g-4">
                    {/* Contact item START */}
                    <div className="col-md-6 col-xl-4">
                        <div className="card card-body shadow text-center align-items-center h-100">
                            <div className="icon-lg bg-info bg-opacity-10 text-info rounded-circle mb-2">
                                <i className="bi bi-headset fs-5"></i>
                            </div>
                            <h5>Llámanos</h5>
                            <p>No hay nada que nos guste mas que escucharte!.</p>
                            <div className="d-grid gap-3 d-sm-block">
                                <button className="btn btn-sm btn-primary-soft">
                                    <i className="bi bi-phone me-2"></i>+123 456 789
                                </button>
                                <button className="btn btn-sm btn-light">
                                    <i className="bi bi-telephone me-2"></i>+(222)4567 586
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6 col-xl-4">
                        <div className="card card-body shadow text-center align-items-center h-100">
                            <div className="icon-lg bg-danger bg-opacity-10 text-danger rounded-circle mb-2">
                                <i className="bi bi-inboxes-fill fs-5"></i>
                            </div>
                            <h5>Envíanos un correo electrónico</h5>
                            <p>Estaremos atentos a cualquier cosa que desees comunicarnos y te responderemos rapidamente.</p>
                            <a href="#" className="btn btn-link text-decoration-underline text-black p-0 mb-0">
                                <i className="bi bi-envelope me-1"></i>ejemplo@gmail.com
                            </a>
                        </div>
                    </div>
                    <div className="col-xl-4 position-relative">
                        <div className="card card-body shadow text-center align-items-center h-100">
                            <div className="icon-lg bg-orange bg-opacity-10 text-orange rounded-circle mb-2">
                                <i className="bi bi-globe2 fs-5"></i>
                            </div>
                            <h5>Redes sociales</h5>
                            <p>Siguenos y seras participe de nuestras dinamicas sociales, promociones y mas!.</p>
                            <ul className="list-inline mb-0">
                                <li className="list-inline-item">
                                    <a className="btn btn-sm bg-facebook px-2 mb-0 hover-zoom" href="#">
                                        <i className="fab fa-fw fa-facebook-f"></i>
                                    </a>
                                </li>
                                <li className="list-inline-item">
                                    <a className="btn btn-sm bg-instagram px-2 mb-0 hover-zoom" href="#">
                                        <i className="fab fa-fw fa-instagram"></i>
                                    </a>
                                </li>
                                <li className="list-inline-item">
                                    <a className="btn btn-sm bg-twitter px-2 mb-0 hover-zoom" href="#">
                                        <i className="fab fa-fw fa-twitter"></i>
                                    </a>
                                </li>
                                <li className="list-inline-item">
                                    <a className="btn btn-sm bg-linkedin px-2 mb-0 hover-zoom" href="#">
                                        <i className="fab fa-fw fa-linkedin-in"></i>
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                    {/* Contact item END */}
                    
                </div>
                
            </div>
        </section>
    );
}

export default ContactUs;
