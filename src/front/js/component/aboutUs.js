import React from "react";
import flavia from "../../img/flavia.jpg";
import Mike from "../../img/Mike.jpg";
import "../../styles/aboutUs.css";
import { Demo } from "../pages/demo";

const AboutUs = () => {
    return (
        <div className="container mt-5">
            <div className="card p-4 shadow-lg border-0 text-center about-us-container">
                <h1 className="mb-4">Sobre Nosotros</h1>

                <div className="section">
                    <h2>
                        ¡Bienvenidos a <strong>RestaurAPP</strong>, la aplicación diseñada para facilitar la gestión de reservas en restaurantes!
                    </h2>
                    <h3 className="h4">Nuestra Historia</h3>
                </div>

                <div className="section">
                    <h2 className="h4">¿Quiénes somos?</h2>
                    <div className="row mt-4">
                        <div className="col-md-6 text-center mb-4">
                            <img
                                src={flavia}
                                alt="Flavia Pala"
                                className="img-fluid rounded-circle profile-img"
                            />
                            <h1 className="h5 name-text">Flavia Pala</h1>
                            <i className="fab fa-fw fa-facebook-f"></i>
                            <a href="https://www.instagram.com/_flavia_pl?igsh=d2FmM3A5emducGV4"><i className="fab fa-fw fa-instagram"></i></a>
                            <i className="fab fa-fw fa-twitter"></i>
                            <i className="fab fa-fw fa-linkedin-in"></i>
                            <p className="description-text">
                            Apasionada de la tecnología y la experiencia de usuario, siempre en busca de nuevas formas de mejorar la interacción y el rendimiento de las aplicaciones. Trabaja en proyectos que integran tanto el frontend como el backend, creando soluciones completas y eficientes.
                            </p>
                        </div>
                        <div className="col-md-6 text-center mb-4">
                            <img
                                src={Mike}
                                alt="Michael Bedoya"
                                className="img-fluid rounded-circle profile-img"
                            />
                            <h1 className="h5 name-text">Michael Bedoya</h1>
                            <i className="fab fa-fw fa-facebook-f"></i>
                            <a href="https://www.instagram.com/bedoyamike30/"><i className="fab fa-fw fa-instagram"></i></a>
                            <i className="fab fa-fw fa-twitter"></i>
                            <i className="fab fa-fw fa-linkedin-in"></i>
                            <p className="description-text">
                            Entusiasta del desarrollo de software con un enfoque en el aprendizaje continuo. Apasionado por trabajar tanto en el frontend como en el backend, su objetivo es construir aplicaciones web robustas y escalables que ofrezcan una excelente experiencia de usuario.
                            </p>
                        </div>
                    </div>
                </div>
                <hr></hr>
                <div className="container-fluid px-4">
                    <div className="section">
                        <h1 className="h3 mt-4 text-start">Nuestra Tecnología</h1>
                        <p className="text-start" style={{ fontSize: "1.3rem" }}>
                            Gracias a la integración de <strong>geolocalización</strong>, <strong>gestión de imágenes con Cloudinary</strong> y una
                            <strong> interfaz fácil de usar</strong>, <strong>RestaurAPP</strong> ofrece una solución innovadora para los propietarios de restaurantes.
                        </p>
                        <p className="text-start" style={{ fontSize: "1.2rem" }}>
                            🔗 Síguenos en GitHub:{" "}
                            <a href="https://github.com/4GeeksAcademy/RestaurAPP" target="_blank" rel="noopener noreferrer">
                                RestaurAPP
                            </a>
                        </p>
                    </div>
                </div>
                <hr></hr>
                < Demo />
                <div className="container">
                <div className="row g-4 g-lg-5 justify-content-center pb-4 pt-4">
                    <div className="col-sm-6 col-md-4 text-center position-relative">

                        <figure className="position-absolute top-0 start-100 translate-middle mt-8 d-none d-lg-block">
                            <svg width="154px" height="83px">
                                <path
                                    className="fill-secondary opacity-4"
                                    d="M142.221,83.016 L140.251,81.082 L148.020,73.376 C146.847,73.405 145.665,73.402 144.479,73.353 L144.548,70.637 C145.888,70.692 147.217,70.676 148.535,70.628 L139.384,62.839 L141.165,60.792 L153.787,71.539 L142.221,83.016 ZM131.667,71.378 L132.327,68.751 C134.373,69.284 136.418,69.712 138.402,70.022 L138.015,72.707 C135.938,72.383 133.803,71.936 131.667,71.378 ZM119.489,67.036 L120.594,64.564 C122.531,65.433 124.480,66.221 126.383,66.905 L125.482,69.458 C123.509,68.751 121.493,67.935 119.489,67.036 ZM108.113,60.978 L109.540,58.677 C111.340,59.784 113.170,60.834 114.978,61.800 L113.698,64.186 C111.840,63.193 109.961,62.115 108.113,60.978 ZM99.302,55.005 C98.712,54.567 98.124,54.125 97.540,53.680 L99.203,51.541 C99.776,51.978 100.352,52.412 100.933,52.843 C102.031,53.657 103.148,54.459 104.282,55.243 L102.729,57.461 C101.568,56.659 100.426,55.841 99.302,55.005 ZM87.631,45.617 L89.413,43.574 C91.015,44.943 92.626,46.298 94.258,47.629 L92.525,49.714 C90.877,48.369 89.247,47.000 87.631,45.617 ZM78.063,37.231 L79.883,35.221 L84.635,39.423 L82.823,41.439 L78.063,37.231 ZM68.521,28.905 L70.295,26.853 C71.914,28.227 73.520,29.618 75.118,31.017 L73.310,33.038 C71.724,31.648 70.130,30.268 68.521,28.905 ZM58.688,21.003 L60.328,18.848 C62.036,20.128 63.717,21.440 65.378,22.781 L63.659,24.875 C62.023,23.557 60.369,22.263 58.688,21.003 ZM48.288,13.967 L49.683,11.647 C51.494,12.727 53.321,13.891 55.111,15.108 L53.575,17.340 C51.832,16.155 50.053,15.019 48.288,13.967 ZM38.981,9.077 C38.372,8.799 37.760,8.531 37.146,8.268 L38.204,5.775 C38.838,6.046 39.469,6.325 40.098,6.611 C41.429,7.216 42.746,7.854 44.046,8.521 L42.810,10.930 C41.547,10.283 40.272,9.664 38.981,9.077 ZM25.330,4.320 L25.934,1.679 C27.985,2.168 30.080,2.771 32.161,3.471 L31.314,6.042 C29.311,5.369 27.298,4.791 25.330,4.320 ZM13.076,2.706 L13.084,-0.012 C15.208,0.029 17.387,0.197 19.559,0.487 L19.234,3.180 C17.166,2.905 15.094,2.745 13.076,2.706 ZM0.759,1.270 C2.660,0.821 4.623,0.487 6.593,0.273 L6.939,2.975 C5.080,3.177 3.230,3.493 1.439,3.914 L0.759,1.270 Z"
                                ></path>
                            </svg>
                        </figure>

                        <div className="px-4">
                          
                            <img src="https://booking.webestica.com/assets/images/element/step-3.svg" className="w-150px mb-3" alt="" />
                            <h5>Opción de búsqueda</h5>
                            <p className="mb-0">Más de 200 restaurantes con los que trabajamos</p>
                        </div>
                    </div>

                    <div className="col-sm-6 col-md-4 position-relative text-center pt-0 pt-lg-5">
                        <figure className="position-absolute top-100 start-100 translate-middle d-none d-lg-block mt-n9">
                            <svg className="fill-secondary opacity-4" width="161px" height="79px">
                                <path d="M158.107,15.463 L157.135,5.449 C156.369,6.347 155.573,7.235 154.736,8.101 L152.599,6.579 C153.544,5.600 154.425,4.592 155.272,3.574 L142.859,6.243 L142.411,3.796 L159.535,0.118 L160.985,15.028 L158.107,15.463 ZM131.614,21.310 C133.615,20.323 135.558,19.284 137.387,18.222 L138.833,20.282 C136.938,21.383 134.927,22.459 132.858,23.479 L131.614,21.310 ZM119.450,26.438 C121.550,25.684 123.624,24.876 125.616,24.039 L126.674,26.293 C124.626,27.153 122.496,27.983 120.340,28.758 L119.450,26.438 ZM107.366,32.761 L106.764,30.352 C107.500,30.158 108.237,29.959 108.974,29.755 C110.367,29.370 111.762,28.963 113.155,28.535 L113.894,30.904 C112.468,31.343 111.042,31.759 109.615,32.153 C108.867,32.359 108.116,32.563 107.366,32.761 ZM93.778,33.405 C95.956,32.941 98.128,32.461 100.295,31.955 L100.806,34.386 C98.616,34.898 96.421,35.383 94.222,35.850 L93.778,33.405 ZM80.657,36.053 L87.229,34.752 L87.633,37.206 L81.049,38.509 L80.657,36.053 ZM67.485,38.736 C69.678,38.262 71.876,37.807 74.074,37.362 L74.484,39.816 C72.299,40.256 70.119,40.708 67.942,41.181 L67.485,38.736 ZM54.349,41.900 C56.526,41.309 58.711,40.754 60.906,40.230 L61.433,42.656 C59.274,43.174 57.122,43.718 54.979,44.301 L54.349,41.900 ZM41.404,46.011 C43.490,45.232 45.654,44.489 47.835,43.801 L48.597,46.164 C46.472,46.834 44.363,47.557 42.331,48.315 L41.404,46.011 ZM30.259,53.613 L28.967,51.468 C29.611,51.137 30.259,50.813 30.912,50.495 C32.293,49.821 33.691,49.176 35.102,48.558 L36.207,50.792 C34.838,51.392 33.483,52.016 32.143,52.670 C31.511,52.978 30.883,53.292 30.259,53.613 ZM17.425,58.480 C19.198,57.202 21.090,55.953 23.052,54.765 L24.549,56.794 C22.662,57.937 20.844,59.138 19.142,60.364 L17.425,58.480 ZM7.428,67.231 C8.888,65.655 10.488,64.107 12.182,62.630 L14.128,64.332 C12.516,65.738 10.995,67.211 9.607,68.707 L7.428,67.231 ZM0.172,77.195 C1.089,75.523 2.140,73.865 3.293,72.267 L5.697,73.469 C4.610,74.977 3.620,76.539 2.755,78.114 L0.172,77.195 ZM149.871,12.613 C148.214,13.999 146.419,15.364 144.535,16.669 L142.867,14.750 C144.671,13.499 146.390,12.194 147.973,10.869 L149.871,12.613 Z"
                                ></path>
                            </svg>
                        </figure>

                        <div className="px-4">
                            <img src="https://booking.webestica.com/assets/images/element/step-2.svg" className="w-150px mb-3" alt="" />
                            <h5>Seleccionar Restaurante</h5>
                            <p className="mb-0">Los mejores al alcance de un click</p>
                        </div>
                    </div>

                    <div className="col-sm-6 col-md-4 text-center">
                        <div className="px-4">
                            <img src="https://booking.webestica.com/assets/images/element/step-1.svg" className="w-150px mb-3" alt="" />
                            <h5>Fácil de reservar</h5>
                            <p className="mb-0">Con un proceso de reserva fácil y rápido</p>
                        </div>
                    </div>
                </div>
            </div>
            </div>
        </div>
    );
};

export default AboutUs;
