// import React, { useState, useContext, useEffect } from "react";
// import { Context } from "../store/appContext";
// import { useNavigate, useParams, Link } from "react-router-dom";

// const OwnerForm = () => {
//   const [name, setName] = useState("");
//   const [location, setLocation] = useState("");
//   const [telephone, setTelephone] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

//   const { store, actions } = useContext(Context);
//   const navigate = useNavigate();
//   const { ownerId } = useParams();

//   useEffect(() => {
//     if (ownerId) {
//       const owner = store.owners.find(
//         (owner) => owner.id === parseInt(ownerId)
//       );
//       if (owner) {
//         setName(owner.name || "");
//         setLocation(owner.location || "");
//         setTelephone(owner.telephone || "");
//         setEmail(owner.email || "");
//         setPassword(owner.password || "");
//       }
//     } else {
//       setName("");
//       setLocation("");
//       setTelephone("");
//       setEmail("");
//       setPassword("");
//     }
//   }, [ownerId, store.owners]);

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (ownerId) {
//       actions.modifyOwner(ownerId, {
//         name,
//         telephone,
//         email,
//         location,
//         password,
//       });
//       navigate("/owners/dashboard");
//     } else {
//       actions.addOwner({ name, telephone, email, location, password });
//     }
//     navigate("/owners/login");
//   };

//   return (
//     <>
//       <div className="container">
//         <h1 className="my-4">RestaurApp</h1>
//         <h2 className="container mt-3">{ownerId ? "Cambia tus datos" : "Registro de propietario"}</h2>
//         <form className="container mt-4" onSubmit={handleSubmit}>
//           <div className="mb-3">
//             <label htmlFor="exampleInputname" className="form-label">
//               Nombre completo
//             </label>
//             <input
//               type="text"
//               value={name}
//               onChange={(e) => setName(e.target.value)}
//               className="form-control"
//               id="exampleInputname"
//               aria-describedby="textHelp"
//             />
//           </div>
//           <div className="mb-3">
//             <label htmlFor="exampleInputtext1" className="form-label">
//               Ubicación
//             </label>
//             <input
//               type="text"
//               value={location}
//               onChange={(e) => setLocation(e.target.value)}
//               className="form-control"
//               id="exampleInputlocation"
//               aria-describedby="textHelp"
//             />
//           </div>
//           <div className="mb-3">
//             <label htmlFor="exampleInputtelephone" className="form-label">
//               Teléfono
//             </label>
//             <input
//               type="text"
//               value={telephone}
//               onChange={(e) => setTelephone(e.target.value)}
//               className="form-control"
//               id="exampleInputtelephone"
//               aria-describedby="textHelp"
//             />
//           </div>
//           <div className="mb-3">
//             <label htmlFor="exampleInputEmail1" className="form-label">
//               Correo electrónico
//             </label>
//             <input
//               type="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               className="form-control"
//               id="exampleInputEmail"
//               aria-describedby="emailHelp"
//             />
//           </div>
//           <div className="mb-3">
//             <label htmlFor="exampleInputPassword1" className="form-label">
//               Contraseña
//             </label>
//             <input
//               type="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               className="form-control"
//               id="exampleInputPassword"
//             />
//           </div>
//           <button type="submit" className="btn btn-primary">
//             {ownerId ? "Guardar cambios" : "Registrarse"}
//           </button>
//           <p className="mt-4">
//             ¿Ya tienes una cuenta?{" "}
//             <Link to="/owners/login" className="text-primary fw-bold">
//               Inicia sesión aquí
//             </Link>
//           </p>
//         </form>
//       </div>
//     </>
//   );
// };

// export default OwnerForm;

import React, { useState, useContext, useEffect } from "react";
import { Context } from "../store/appContext";
import { useNavigate, useParams, Link } from "react-router-dom";
import LoginImg from "../../img/LoginImg.jpeg"; // Aggiungi il percorso corretto dell'immagine
import logo2 from "../../img/logo2.jpeg"; // Aggiungi il percorso corretto del logo
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

  useEffect(() => {
    if (ownerId) {
      const owner = store.owners.find((owner) => owner.id === parseInt(ownerId));
      if (owner) {
        setName(owner.name || "");
        setLocation(owner.location || "");
        setTelephone(owner.telephone || "");
        setEmail(owner.email || "");
        setPassword(owner.password || "");
      }
    } else {
      setName("");
      setLocation("");
      setTelephone("");
      setEmail("");
      setPassword("");
    }
  }, [ownerId, store.owners]);

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
        {/* Sezione immagine a sinistra */}
        <div className="login-image-container">
          <img
            src={LoginImg}
            alt="Login Background"
            className="login-image"
          />
        </div>

        {/* Sezione form di login a destra */}
        <div className="login-content">
          <img
            src={logo2}
            alt="Logo"
            style={{
              cursor: 'pointer',
              width: '52px',
              height: 'auto',
              borderRadius: '8px',
              marginBottom: '2px',
            }}
          />
          <h2 className="mb-4" style={{ fontFamily: "Poppins, sans-serif" }}>
            {ownerId ? "Cambia tus datos" : "Crea una nueva cuenta"}
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="exampleInputname" className="form-label">Nombre completo</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="form-control"
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Ubicación</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="form-control"
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Teléfono</label>
              <input
                type="text"
                value={telephone}
                onChange={(e) => setTelephone(e.target.value)}
                className="form-control"
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Correo electrónico</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-control"
              />
            </div>
            <div className="position-relative">
              <label className="form-label">Contraseña</label>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-control"
                placeholder="Escribe aquí tu contraseña"
              />
              <span
                className="position-absolute end-0 p-2"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  cursor: "pointer",
                  fontSize: "18px",
                  color: "#6c757d",
                  top: "75%", /* Allineato con l'input */
                  transform: "translateY(-54%)"
                }}
              >
                <i className={`fas ${showPassword ? "fa-eye" : "fa-eye-slash"}`}></i>
              </span>
            </div>
            <button type="submit" className="btn btn-primary w-100 mt-3">
              {ownerId ? "Guardar cambios" : "Registrarse"}
            </button>
            <p className="mt-4">
              ¿Ya tienes una cuenta?{" "}
              <Link to="/owners/login" className="text-primary fw-bold">Inicia sesión aquí</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OwnerForm;
