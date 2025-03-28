import React, { useState, useContext, useEffect } from "react";
import { Context } from "../store/appContext";
import { useNavigate, useParams, Link } from "react-router-dom";
import chef from "../../img/chef.png"
import logo2 from "../../img/logo2.jpeg";
import "../../styles/login.css";

const OwnerForm = () => {
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [telephone, setTelephone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { store, actions } = useContext(Context);
  const navigate = useNavigate();
  const { ownerId } = useParams();
  console.log("Owner ID from useParams:", ownerId);


  useEffect(() => {
      // Recupera l'ID dell'owner dal localStorage
      const storedOwnerId = localStorage.getItem("ownerId");
      console.log("Owner ID from localStorage:", storedOwnerId);
  
      // Se l'ID è presente nel localStorage, usalo, altrimenti prendi quello dalla URL
      const idToUse = storedOwnerId || ownerId; // Usa storedOwnerId se disponibile, altrimenti ownerId
  
      if (idToUse) {
          // Recupera i dati dell'owner usando l'ID
          console.log("Fetching details for Owner ID:", idToUse);
          actions.getSpecificOwner(idToUse); // Recupera i dati dell'owner
  
          // Attendi che i dati dell'owner siano nel store
          const owner = store.owners.find((owner) => owner.id === parseInt(idToUse));
  
          // Se trovi l'owner nel store, imposta i dati nel form
          if (owner) {
              console.log("Owner data found:", owner);
              setName(owner.name || "");
              setLocation(owner.location || "");
              setTelephone(owner.telephone || "");
              setEmail(owner.email || "");
              setPassword(owner.password || "");
          }
      } else {
          // Se l'ID dell'owner non è disponibile, azzera i campi
          setName("");
          setLocation("");
          setTelephone("");
          setEmail("");
          setPassword("");
      }
  }, [ownerId, store.owners]); // La dipendenza è sia ownerId che store.owners
  
  
  // useEffect(() => {
  //   if (ownerId) {
  //     console.log("Fetching details for Owner ID:", ownerId);
  //     actions.getSpecificOwner(ownerId);
  //     const owner = store.owners.find((owner) => owner.id === parseInt(ownerId));
  //     if (owner) {
  //       actions.getSpecificOwner(store.ownerId);
  //       console.log(actions.getSpecificOwner(store.ownerId));
        
  //       setName(owner.name || "");
  //       setLocation(owner.location || "");
  //       setTelephone(owner.telephone || "");
  //       setEmail(owner.email || "");
  //       setPassword(owner.password || "");
  //     }
  //   } else {
  //     setName("");
  //     setLocation("");
  //     setTelephone("");
  //     setEmail("");
  //     setPassword("");
  //   }
  // }, [ownerId, store.owners]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (ownerId) {
      actions.modifyOwner(ownerId, { name, telephone, email, location, password });
      navigate("/owners/dashboard");
    } else {
      actions.addOwner({ name, telephone, email, location, password });
    }
    navigate("/owners/login");
  };

  return (
    <div className="login-container">
      <div className="login-card">
        {/* imagen izquierda */}
        <div className="login-image-container">
          <img
            src={chef}
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
              cursor: 'pointer',
              width: '52px',
              height: 'auto',
              borderRadius: '8px',
              marginBottom: '4px',
              marginTop: '3px'
            }}
          />
          <h2 className="mb-2" style={{ fontFamily: "Poppins, sans-serif", marginBottom: '20px' }}>

            {ownerId ? "Cambia tus datos" : "Crea una nueva cuenta como restaurante"}

          </h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-1">
              <label htmlFor="exampleInputname" className="form-label">Nombre completo</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="form-control"
                placeholder="Escribe tu nombre completo"
                style={{ padding: "10px" }}
              />
            </div>
            <div className="mb-1">
              <label className="form-label">Ubicación</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="form-control"
                placeholder="Escribe la ubicación"
                style={{ padding: "10px" }}
              />
            </div>
            <div className="mb-1">
              <label className="form-label">Teléfono</label>
              <input
                type="text"
                value={telephone}
                onChange={(e) => setTelephone(e.target.value)}
                className="form-control"
                placeholder="Escribe tu teléfono"
                style={{ padding: "10px" }}
              />
            </div>
            <div className="mb-1">
              <label className="form-label">Correo electrónico</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-control"
                placeholder="Escribe tu correo electrónico"
                style={{ padding: "10px" }}
              />
            </div>
            <div className="position-relative mb-1">
              <label className="form-label">Contraseña</label>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-control"
                placeholder="Escribe aquí tu contraseña"
                style={{ padding: "10px" }}
              />
              <span
                className="position-absolute end-0 p-2"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  cursor: "pointer",
                  fontSize: "18px",
                  color: "#6c757d",
                  top: "75%",
                  transform: "translateY(-54%)",
                }}
              >
                <i className={`fas ${showPassword ? "fa-eye" : "fa-eye-slash"}`}></i>
              </span>
            </div>
            <button 
              type="submit" 
              className="btn btn-warning w-100 mt-3" 
              style={{
                padding: '12px 20px', 
                fontSize: '16px', 
                fontWeight: 'bold', 
                borderRadius: '8px', 
                transition: 'all 0.3s ease',
              }} 
              onMouseEnter={(e) => e.target.style.backgroundColor = "#e0a800"}
              onMouseLeave={(e) => e.target.style.backgroundColor = "#ffc107"}
            >
              {ownerId ? "Guardar cambios" : "Registrarse"}
            </button>
            <p className="mt-1">
              ¿Ya tienes una cuenta?{" "}
              <Link to="/owners/login" className="text-warning fw-bold">Inicia sesión aquí</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OwnerForm;
