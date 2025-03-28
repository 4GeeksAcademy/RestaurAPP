import React, { useState } from "react";
import "../../styles/RestaurantRecommendationForm.css";
import { useNavigate } from "react-router-dom";

const RestaurantRecommendationForm = () => {
    const [ocasion, setOcasion] = useState("");
    const [fecha, setFecha] = useState("");
    const [hora, setHora] = useState("");
    const [formalidad, setFormalidad] = useState("");
    const [peticionPersonalizada, setPeticionPersonalizada] = useState("");
    const [respuesta, setRespuesta] = useState("");
    const navigate = useNavigate();
    

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = {
            occasion: ocasion, 
            date: fecha,       
            time: hora,       
            formality: formalidad,  
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
        <div className="form-container">
            <h2>Quieres una recomendación sobre un restaurante y el plan del día?</h2>
            <form onSubmit={handleSubmit} className="recommendation-form mb-5">
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

                <label>Indicanos la zona y si tienes alguna peticón especifica:</label>
                <textarea 
                    value={peticionPersonalizada} 
                    onChange={(e) => setPeticionPersonalizada(e.target.value)} 
                    placeholder="Ej. En Madrid, prefiero comida vegetariana o una mesa con vista al mar."
                />

                <button type="submit" className="submit-btn">Enviar solicitud</button>
                <div className="fixed-top" style={{ zIndex: 1030 }}>
                    <div className="container">
                        <div className="col-md-4 mb-4">
                            <div className="d-flex justify-content-start mt-3">
                                <button
                                    type="button"
                                    className="btn btn-warning text-light"
                                    onClick={() => navigate("/diner/dashboard")}
                                    style={{ position: 'absolute', top: '10px', left: '10px', zIndex: 1050 }}>
                                    Volver
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </form>

            {respuesta && (
                <div className="response-container">
                    <h3>Recomendación para ti:</h3>
                    <p className="OpenAiResponse">{respuesta}</p>
                </div>
            )}
        </div>
    );
};

export default RestaurantRecommendationForm;
