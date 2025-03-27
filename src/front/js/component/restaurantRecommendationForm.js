import React, { useState } from "react";
import "../../styles/RestaurantRecommendationForm.css";

const RestaurantRecommendationForm = () => {
    const [ocasion, setOcasion] = useState("");
    const [fecha, setFecha] = useState("");
    const [hora, setHora] = useState("");
    const [formalidad, setFormalidad] = useState("");
    const [peticionPersonalizada, setPeticionPersonalizada] = useState("");
    const [selectedCity, setSelectedCity] = useState("");
    const [respuesta, setRespuesta] = useState("");

    // Lista de ciudades programadas
    const cities = [
        "Madrid", "Barcelona", "Valencia", "Sevilla", "Zaragoza",
        "Málaga", "Murcia", "Palma", "Las Palmas", "Bilbao",
        "Alicante", "Córdoba", "Valladolid", "Vigo", "Gijón",
        "Granada", "Elche", "Santander", "Badajoz", "Almería"
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();

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
        }
    };

    return (
        <div className="container">
            <h2>¿Quieres una recomendación sobre un restaurante y el plan del día?</h2>

            <div className="form-response-container">
                {/* Formulario */}
                <form onSubmit={handleSubmit} className="recommendation-form">
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
                    <select 
                        value={selectedCity} 
                        onChange={(e) => setSelectedCity(e.target.value)} 
                        required
                    >
                        <option value="">Selecciona una ciudad</option>
                        {cities.map((city, index) => (
                            <option key={index} value={city}>
                                {city}
                            </option>
                        ))}
                    </select>

                    <label>Indícanos la zona y si tienes alguna petición específica:</label>
                    <textarea 
                        value={peticionPersonalizada} 
                        onChange={(e) => setPeticionPersonalizada(e.target.value)} 
                        placeholder="Ej. En Valencia, prefiero comida vegetariana o una mesa con vista al mar."
                    />

                    <button type="submit" className="submit-btn">Enviar solicitud</button>
                </form>

                {/* Tarjeta de respuesta */}
                {respuesta && (
                    <div className="response-card">
                        <h3>Recomendación para ti:</h3>
                        <p className="OpenAiResponse">{respuesta}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RestaurantRecommendationForm;
