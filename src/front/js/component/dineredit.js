import React, { useContext, useState, useEffect } from "react";
import { Context } from "../store/appContext";
import { useNavigate, useParams } from "react-router-dom";

export const DinerEdit = () => {
  const { diner_id } = useParams(); // Obtener el ID del diner desde la URL
  console.log("El ID del diner es:", diner_id); // Verificar que el ID se capture correctamente
  const { actions, store } = useContext(Context); // Acceder a las acciones y el estado global
  const navigate = useNavigate();

  // Estados para los campos del formulario
  const [fullname, setFullname] = useState(""); // Estado para "fullname"
  const [email, setEmail] = useState("");
  const [telephone, setTelephone] = useState("");
  const [password, setPassword] = useState(""); // Solo si se necesita actualizar la contraseña

  // Precargar los datos del diner en modo edición
  useEffect(() => {
    if (diner_id) {
      const diner = store.diners.find((d) => d.id === parseInt(diner_id));
      if (diner) {
        setFullname(diner.fullname || "");
        setEmail(diner.email || "");
        setTelephone(diner.telephone || "");
      } else {
        console.error(`Diner con ID ${diner_id} no encontrado en el estado global.`);
      }
    } else {
      console.error("El ID del diner es undefined.");
    }
  }, [diner_id, store.diners]);

  // Manejar la edición del diner
  const handleEdit = async (event) => {
    event.preventDefault();

    const updatedData = {
      fullname, // Datos del formulario
      email,
      telephone,
      password, // Opcional si se requiere actualizar la contraseña
    };

    try {
      await actions.handleEdit(diner_id, updatedData); // Llamar a la acción para editar
      alert("Diner actualizado exitosamente");
      navigate("/dinerlist"); // Redirigir a la lista de diners
    } catch (error) {
      console.error("Error al editar el diner:", error.message);
      alert("Error al realizar la operación: " + error.message);
    }
  };

  return (
    <div className="container">
      <div className="d-flex align-items-center mt-3 bg-body-tertiary">
        <div className="form-signin w-100 m-auto">
          <form onSubmit={handleEdit}>
            <h1 className="h3 mb-3 fw-normal"><strong>Edit Diner</strong></h1>

            <div className="form-floating mb-2">
              <input
                type="text"
                className="form-control"
                id="floatingfullname"
                placeholder="Full Name"
                value={fullname}
                onChange={(e) => setFullname(e.target.value)}
                autoComplete="name"
                required
              />
              <label htmlFor="floatingfullname">Full Name</label>
            </div>

            <div className="form-floating mb-2">
              <input
                type="email"
                className="form-control"
                id="floatingEmail"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="username"
                required
              />
              <label htmlFor="floatingEmail">Email</label>
            </div>

            <div className="form-floating mb-2">
              <input
                type="text"
                className="form-control"
                id="floatingTelephone"
                placeholder="Telephone"
                value={telephone}
                onChange={(e) => setTelephone(e.target.value)}
                autoComplete="tel"
                required
              />
              <label htmlFor="floatingTelephone">Telephone</label>
            </div>

            <div className="form-floating">
              <input
                type="password"
                className="form-control"
                id="floatingPassword"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
              <label htmlFor="floatingPassword">Password</label>
            </div>
            <button className="btn btn-primary w-100 py-2" type="submit">
              Save Changes
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
