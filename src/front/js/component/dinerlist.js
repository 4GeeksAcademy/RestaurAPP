import React, { useContext, useEffect } from "react";
import { Context } from "../store/appContext";
import { Link, useNavigate } from "react-router-dom";

export const Dinerlist = () => {
  const { store, actions } = useContext(Context);
  const navigate = useNavigate();

  useEffect(() => {
    actions.getDinerList(); // Cargar la lista de diners desde el estado global
    console.log("Diners en el estado global:", store.diners);
  }, []);

  // Función para manejar la eliminación de un diner
  const handleDelete = async (diner_id) => {
    try {
      await actions.deleteDiner(diner_id); // Llamar la acción global para eliminar el diner
      alert("Diner eliminado exitosamente.");
    } catch (error) {
      console.error("Error al eliminar el diner:", error.message);
      alert("Error al eliminar el diner. Intenta nuevamente.");
    }
  };

  return (
    <>
      <div className="container">
        <h2>List of Diners</h2>
        <ul className="list-group">
          {store.diners.length > 0 ? (
            store.diners.map((diner, index) => (
              <li key={index} className="list-group-item">
                <h5>{diner.fullname}</h5>
                <p>{diner.email}</p>
                <p>{diner.telephone}</p>
                <button
                  onClick={() => navigate(`/diners/${diner.id}/edit`)} // Redirige al formulario de edición
                  className="btn btn-warning me-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(diner.id)} // Llama a la función para eliminar
                  className="btn btn-danger"
                >
                  Delete
                </button>
              </li>
            ))
          ) : (
            <p>No diners found.</p>
          )}
        </ul>
        <br />
        <Link to="/dinerform">
          <button className="btn btn-primary">Diner form</button>
        </Link>
      </div>
    </>
  );
};

