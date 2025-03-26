import React, { useContext, useState } from "react";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom"; // Aggiungi questa riga
import logo2 from "../../img/logo2.jpeg";
import "../../styles/login.css";

export const Dinerform = () => {
  const { store, actions } = useContext(Context);
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [telephone, setTelephone] = useState("");
  const navigate = useNavigate();

  const handleSignup = (e) => {
    e.preventDefault();
    actions.DinerForm(fullname, email, telephone, password);
    navigate("/diner/login");
  };

  return (
    <div className="login-container">
      <div className="login-card">
        {/* imagen izquierda */}
        <div className="login-image-container">
          <img
            src="https://img.freepik.com/premium-vector/drawing-people-sitting-table-with-lamp-them_1087929-8168.jpg"
            alt="Login Background"
            className="login-image"
          />
        </div>

        {/* form login derecha */}
        <div className="login-content">
          <img
            src={logo2}
            alt="Logo"
            style={{
              cursor: "pointer",
              width: "52px",
              height: "auto",
              borderRadius: "8px",
              marginBottom: "4px",
              marginTop: "3px",
            }}
          />
          <h2 className="mb-2" style={{ fontFamily: "Poppins, sans-serif", marginBottom: "20px" }}>
            Crea una nueva cuenta
          </h2>
          <form onSubmit={handleSignup}>
            <div className="mb-1">
              <label htmlFor="fullname" className="form-label">
                Nombre completo
              </label>
              <input
                type="text"
                id="fullname"
                value={fullname}
                onChange={(e) => setFullname(e.target.value)}
                className="form-control"
                placeholder="Escribe tu nombre completo"
                style={{ padding: "10px" }}
              />
            </div>
            <div className="mb-1">
              <label htmlFor="email" className="form-label">
                Correo electrónico
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-control"
                placeholder="Escribe tu correo electrónico"
                style={{ padding: "10px" }}
              />
            </div>
            <div className="mb-1">
              <label htmlFor="telephone" className="form-label">
                Teléfono
              </label>
              <input
                type="text"
                id="telephone"
                value={telephone}
                onChange={(e) => setTelephone(e.target.value)}
                className="form-control"
                placeholder="Escribe tu teléfono"
                style={{ padding: "10px" }}
              />
            </div>
            <div className="mb-1">
              <label htmlFor="password" className="form-label">
                Contraseña
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-control"
                placeholder="Escribe tu contraseña"
                style={{ padding: "10px" }}
              />
            </div>
            <button
              type="submit"
              className="btn btn-warning w-100 mt-3"
              style={{
                padding: "12px 20px",
                fontSize: "16px",
                fontWeight: "bold",
                borderRadius: "8px",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = "#e0a800"}
              onMouseLeave={(e) => e.target.style.backgroundColor = "#ffc107"}
            >
              Registrarse
            </button>
            <p className="mt-1">
              ¿Ya tienes una cuenta?{" "}
              <Link to="/diner/login" className="text-primary fw-bold">
                Inicia sesión aquí
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};
