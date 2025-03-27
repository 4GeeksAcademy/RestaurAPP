import React, { useState } from "react";
import { SpinnerDotted } from "spinners-react"; // Importazione dello spinner
import "../../styles/RestaurantRecommendationForm.css";

const RestaurantRecommendationForm = () => {
    const [ocasion, setOcasion] = useState("");
    const [fecha, setFecha] = useState("");
    const [hora, setHora] = useState("");
    const [formalidad, setFormalidad] = useState("");
    const [peticionPersonalizada, setPeticionPersonalizada] = useState("");
    const [selectedCity, setSelectedCity] = useState("");
    const [respuesta, setRespuesta] = useState("");
    const [loading, setLoading] = useState(false); // Stato per lo spinner

    // Lista di città disponibili
    const cities = [
        "Madrid", "Barcelona", "Valencia", "Sevilla", "Zaragoza",
        "Málaga", "Murcia", "Palma", "Las Palmas", "Bilbao",
        "Alicante", "Córdoba", "Valladolid", "Vigo", "Gijón",
        "Granada", "Elche", "Santander", "Badajoz", "Almería"
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); // Attiva lo spinner

        const formData = {
            occasion: ocasion,
            date: fecha,
            time: hora,
            formality: formalidad,
            city: selectedCity,
            special_requests: peticionPersonalizada,
        };

        console.log("📩 Enviando datos al backend:", formData);

        try {
            const res = await fetch(process.env.BACKEND_URL + '/api/recommendation', {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            console.log("Estado de la respuesta:", res.status);

            const responseText = await res.text();
            console.log("Respuesta completa:", responseText);

            const data = JSON.parse(responseText);

            if (res.ok) {
                setRespuesta(data.recommendation || data.reply || "No se recibió respuesta.");
            } else {
                setRespuesta("Error en la solicitud.");
            }
        } catch (error) {
            setRespuesta("Error de conexión al servidor.");
            console.error("Error en la solicitud:", error);
        } finally {
            setLoading(false); // Disattiva lo spinner
        }
    };

    return (
        <div className="container-fluid">
            <h2 className="mt-5">"¡Descubre el restaurante perfecto y el plan ideal para tu día!"</h2>
            <h6 className="text-center">
                ¿No sabes a qué restaurante ir y quieres ideas para un plan perfecto? 
                ¡Prueba nuestro formulario inteligente y descubre la mejor recomendación para ti!
            </h6>
            <div className="form-response-container d-flex">
                {/* Formulario */}
                <form onSubmit={handleSubmit} className="recommendation-form">
                    <h5 className="text-center">¡Pruebame! 🚀</h5>
                    <label>Ocasión:</label>
                    <select value={ocasion} onChange={(e) => setOcasion(e.target.value)} required>
                        <option value="">Selecciona una ocasión</option>
                        <option value="aniversario">Aniversario</option>
                        <option value="cumpleaños">Cumpleaños</option>
                        <option value="cena_romantica">Cena romántica</option>
                        <option value="reunion_trabajo">Reunión de trabajo</option>
                        <option value="despedida_soltero">Despedida de soltero/a</option>
                        <option value="reunion_familiar">Reunión familiar</option>
                        <option value="cita_ciegas">Cita a ciegas</option>
                        <option value="celebracion_logro">Celebración de logro</option>
                        <option value="almuerzo_informal">Almuerzo informal</option>
                        <option value="comida_amigos">Comida con amigos</option>
                    </select>

                    <label>Fecha:</label>
                    <input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} required />

                    <label>Hora:</label>
                    <input type="time" value={hora} onChange={(e) => setHora(e.target.value)} required />

                    <label>Nivel de formalidad:</label>
                    <select value={formalidad} onChange={(e) => setFormalidad(e.target.value)} required>
                        <option value="">Selecciona un nivel</option>
                        <option value="formal">Formal</option>
                        <option value="informal">Informal</option>
                        <option value="casual">Casual</option>
                    </select>

                    <label>Ciudad:</label>
                    <select value={selectedCity} onChange={(e) => setSelectedCity(e.target.value)} required>
                        <option value="">Selecciona una ciudad</option>
                        {cities.map((city, index) => (
                            <option key={index} value={city}>{city}</option>
                        ))}
                    </select>

                    <label>Indícanos si tienes alguna petición en particular:</label>
                    <textarea
                        value={peticionPersonalizada}
                        onChange={(e) => setPeticionPersonalizada(e.target.value)}
                        placeholder="Ej. Tengo ganas de comer marisco y me encantaria una mesa con vista al mar."
                    />

                    <button type="submit" className="submit-btn" disabled={loading}>
                        {loading ? (
                            <SpinnerDotted size={50} thickness={100} speed={100} color="rgba(172, 164, 57, 1)" />
                        ) : "Enviar solicitud"}
                    </button>
                </form>

                {/* Sección de imágenes y respuesta */}
                <div className="row g-4 align-items-center">
                    <div className="photo comida col-md-5">
                        <img src="https://cdn.prod.website-files.com/6423e8cf97045d0ac6e9ffb9/6565d9491a89f4b7b7915b3e_tipos%20de%20restaurante.webp" className="rounded-3 img-fluid" alt="Comida" />
                    </div>

                    <div className="col-md-6">
                        <div className="row g-4">
                            <div className="photo playa col-md-8">
                                <img src="https://us.123rf.com/450wm/maridav/maridav1404/maridav140400434/27940409-pareja-feliz-en-la-playa.jpg" className="rounded-3 img-fluid" alt="Playa" />
                            </div>

                            {/* Mostramos la respuesta entre las imágenes */}
                            {respuesta && (
                                <div className="response-box col-12">
                                    <h3>Recomendación para ti:</h3>
                                    <p>{respuesta}</p>
                                </div>
                            )}

                            <div className="photo drink col-12">
                                <img src="https://img.freepik.com/fotos-premium/gente-brindando-cocteles-concepto-estilo-vida_641503-161577.jpg" className="rounded-3 img-fluid" alt="Drink" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RestaurantRecommendationForm;
