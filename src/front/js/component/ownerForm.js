import React, { useState, useContext, useEffect } from "react";
import { Context } from "../store/appContext";
import { useNavigate, useParams, Link } from "react-router-dom";
import chef from "../../img/chef.png";
import logo2 from "../../img/logo2.jpeg";
import "../../styles/login.css";
const OwnerForm = () => {
  // Estados para el formulario
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [telephone, setTelephone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  // Obtener el contexto, navegación y parámetros
  const { store, actions } = useContext(Context);
  const navigate = useNavigate();
  const { ownerId } = useParams();
  // Obtener el ID a usar (desde useParams o localStorage)
  const idToUse = ownerId || localStorage.getItem("ownerId");
  useEffect(() => {
    // Función para cargar los datos del propietario
    const loadOwnerData = async () => {
      if (!idToUse) {
        // Modo creación: no necesitamos cargar datos
        setIsLoading(false);
        return;
      }
      try {
        console.log("Intentando cargar los datos del propietario con ID:", idToUse);
        // Llamada a la API
        await actions.getSpecificOwner(idToUse);
        console.log("Datos cargados:", store.specificOwner);
        // Actualizar el formulario con los datos recibidos
        if (store.specificOwner) {
          setName(store.specificOwner.name || "");
          setLocation(store.specificOwner.location || "");
          setTelephone(store.specificOwner.telephone || "");
          setEmail(store.specificOwner.email || "");
          // No establecemos la contraseña por seguridad
        }
        setIsLoading(false);
      } catch (err) {
        console.error("Error al cargar los datos:", err);
        setError("No se pudieron cargar los datos del propietario. Intente nuevamente.");
        setIsLoading(false);
      }
    };
    // Iniciar la carga de datos
    loadOwnerData();
  }, [idToUse]); // Dependencia: idToUse
  // Manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Datos a enviar
    const ownerData = {
      name,
      location,
      telephone,
      email,
      password
    };
    try {
      // Modo edición o creación
      if (idToUse) {
        console.log("Actualizando propietario con ID:", idToUse);
        await actions.modifyOwner(idToUse, ownerData);
        navigate("/owners/dashboard");
      } else {
        console.log("Creando nuevo propietario");
        await actions.addOwner(ownerData);
        navigate("/owners/login");
      }
    } catch (err) {
      console.error("Error al procesar el formulario:", err);
      setError("Ocurrió un error al guardar los datos. Intente nuevamente.");
    }
  };
  // Renderizar un loader mientras se cargan los datos
  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
        <div className="spinner-border text-warning" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }
  // Renderizar mensaje de error si ocurre alguno
  if (error) {
    return (
      <div className="alert alert-danger m-5" role="alert">
        <h4>Error</h4>
        <p>{error}</p>
        <button
          className="btn btn-outline-danger"
          onClick={() => setError(null)}
        >
          Intentar nuevamente
        </button>
      </div>
    );
  }
  // Renderizar el formulario
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
            {idToUse ? "Cambia tus datos" : "Crea una nueva cuenta como restaurante"}
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
                required
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
                required
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
                required
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
                required
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
                required
              />
              <span
                className="position-absolute end-0 p-2"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  cursor: "pointer",
                  fontSize: "18px",
                  color: "#6C757D",
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
              onMouseEnter={(e) => e.target.style.backgroundColor = "#E0A800"}
              onMouseLeave={(e) => e.target.style.backgroundColor = "#FFC107"}
            >
              {idToUse ? "Guardar cambios" : "Registrarse"}
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