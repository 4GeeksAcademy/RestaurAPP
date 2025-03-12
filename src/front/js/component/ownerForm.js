import React, { useState, useContext, useEffect } from "react";
import { Context } from "../store/appContext";
import { useNavigate, useParams } from "react-router-dom";

const OwnerForm = () => {
  // Estados del formulario
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [telephone, setTelephone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { store, actions } = useContext(Context); // Estado global y acciones
  const navigate = useNavigate();
  const { owner_id } = useParams();

  // Cargar datos del propietario si está editando
  useEffect(() => {
    if (owner_id) {
      const owner = store.owners.find(
        (owner) => owner.id === parseInt(owner_id)
      );
      if (owner) {
        setName(owner.name || "");
        setLocation(owner.location || "");
        setTelephone(owner.telephone || "");
        setEmail(owner.email || "");
        setPassword(""); // Por seguridad no pre-poblamos la contraseña
      }
    } else {
      // Limpiar los campos si no se está editando
      setName("");
      setLocation("");
      setTelephone("");
      setEmail("");
      setPassword("");
    }
  }, [owner_id, store.owners]);

  // Validación del formulario
  const validateForm = () => {
    if (!name || !location || !telephone || !email || !password) {
      alert("Todos los campos son obligatorios.");
      return false;
    }
    // Validación básica de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert("Por favor, introduce un correo electrónico válido.");
      return false;
    }
    return true;
  };

  // Envío del formulario
  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevenir recarga de la página al enviar el formulario
  
    // Construir formData desde los estados individuales
    const formData = {
      name,
      location,
      telephone,
      email,
      password, // Solo se usa en creación, no en edición
    };
  
    try {
      if (owner_id) {
        // Si estamos editando (hay un owner_id)
        console.log(`Modificando propietario con ID ${owner_id}`);
        await actions.updateOwner(owner_id, {
          name: formData.name,
          location: formData.location,
          telephone: formData.telephone,
          email: formData.email,
        });
      } else {
        // Si estamos creando un nuevo propietario
        console.log("Creando un nuevo propietario");
        await actions.addOwner(formData); // Usar formData directamente en creación
      }
  
      alert("Operación completada exitosamente");
      navigate("/owners"); // Redirige a la lista de propietarios
    } catch (error) {
      console.error("Error al guardar el propietario:", error.message);
      alert("Error al realizar la operación: " + error.message);
    }
  };
  
  

  return (
    <>
      <h1 className="container mt-3">{owner_id ? "Editar Propietario" : "Registro de Propietario"}</h1>
      <form className="container mt-4" onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="exampleInputName" className="form-label">
            Nombre Completo
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="form-control"
            id="exampleInputName"
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="exampleInputLocation" className="form-label">
            Ubicación
          </label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="form-control"
            id="exampleInputLocation"
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="exampleInputTelephone" className="form-label">
            Teléfono
          </label>
          <input
            type="text"
            value={telephone}
            onChange={(e) => setTelephone(e.target.value)}
            className="form-control"
            id="exampleInputTelephone"
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="exampleInputEmail" className="form-label">
            Dirección de Correo Electrónico
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="form-control"
            id="exampleInputEmail"
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="exampleInputPassword" className="form-label">
            Contraseña
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="form-control"
            id="exampleInputPassword"
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">
          {owner_id ? "Actualizar" : "Registrar"}
        </button>
      </form>
    </>
  );
};

export default OwnerForm;
