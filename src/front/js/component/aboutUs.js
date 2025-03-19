import React from "react";
// import flavia from "../../img/flavia";
// import Mike from "../../img/Mike";

const AboutUs = () => {
    return (
        <div className="container mt-5">
            <div className="card p-4 shadow-lg border-0 text-center">
                <h1 className="mb-3">Sobre Nosotros</h1>

                <h2 className="h4">Nuestra Historia</h2>
                <p>
                    ¡Bienvenidos a <strong>RestaurAPP</strong>, la aplicación diseñada para facilitar la gestión de reservas en restaurantes!
                </p>

                <h2 className="h4">¿Quiénes somos?</h2>
                <div className="row mt-4">
                    <div className="col-md-6">
                        <img 
                            // src="/img/flavia.jpg"  averigua path correcto
                            alt="Flavia Pala" 
                            className="img-fluid rounded-circle mb-2" 
                            style={{ width: "150px", height: "150px", objectFit: "cover" }}
                        />
                        <h3 className="h5">Flavia Pala</h3>
                        <p>Desarrolladora Full Stack con pasión por la tecnología y la experiencia de usuario.</p>
                    </div>
                    <div className="col-md-6">
                        <img 
                            // src={Mike}      averigua path correcto
                            alt="Michael Bedoya" 
                            className="img-fluid rounded-circle mb-2" 
                            style={{ width: "150px", height: "150px", objectFit: "cover" }}
                        />
                        <h3 className="h5">Michael Bedoya</h3>
                        <p>Ingeniero de Software con enfoque en soluciones innovadoras para la restauración.</p>
                    </div>
                </div>

                <h2 className="h4 mt-4">Nuestra Tecnología</h2>
                <p>
                    Gracias a la integración de <strong>geolocalización</strong>, <strong>gestión de imágenes con Cloudinary</strong> y una 
                    <strong> interfaz fácil de usar</strong>, <strong>RestaurAPP</strong> ofrece una solución innovadora para los propietarios de restaurantes.
                </p>
                <p>
                    🔗 Síguenos en GitHub: <a href="https://github.com/4GeeksAcademy/RestaurAPP" target="_blank" rel="noopener noreferrer">RestaurAPP</a>
                </p>
            </div>
        </div>
    );
};

export default AboutUs;
