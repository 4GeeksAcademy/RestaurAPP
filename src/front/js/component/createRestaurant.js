// import React, { useState, useContext } from "react";
// import { Context } from "../store/appContext";
// import { useNavigate, Navigate, useParams } from "react-router-dom";
// import CloudinaryUploader from "./CloudinaryUploader";

// const CreateRestaurant = () => {
//   const [name, setName] = useState("");
//   const [location, setLocation] = useState("");
//   const [telephone, setTelephone] = useState("");
//   const [capacity, setCapacity] = useState("");
//   const [imageUrl, setImageUrl] = useState("");
//   const [errorMessage, setErrorMessage] = useState("");
//   const [successMessage, setSuccessMessage] = useState("");

//   const { store, actions } = useContext(Context);
//   const navigate = useNavigate();
//   const { id } = useParams();

//   const token = localStorage.getItem("token");

//   // Maneja el envío del formulario
//   const handleSubmit = (e) => {
//     e.preventDefault();

//     const latitude = "44.4048";  // de defailt por ahora, con la GEOLOCAL habrá que cambiarlos..
//     const longitude = "8.9345";

//     const restaurantData = {
//       name,
//       location,
//       telephone,
//       capacity,
//       image_url: imageUrl,  // Usa URL de la imagen
//       latitude,
//       longitude
//     };

//     if (token) {
//       if (id) {
//         // Modificar restaurante
//         actions.modifyRestaurant(id, restaurantData, token)
//           .then(() => navigate("/owners/dashboard"))
//           .catch((err) => setErrorMessage("Error al modificar el restaurante."));
//       } else {
//         // Crear restaurante
//         actions.createRestaurant(restaurantData, token)
//           .then(() => {
//             setSuccessMessage("Restaurante creado con éxito!");
//             // navigate("/owners/dashboard");
//           })
//           .catch((err) => {
//             setErrorMessage("Error al crear el restaurante.");
//           });
//       }
//     } else {
//       setErrorMessage("Token no disponible.");
//     }
//   };

//   return (
//     <>
//       <div className="container d-flex justify-content-between align-items-center mt-3">
//         <h1>Detalles de tu restaurante</h1>
//         <button className="btn btn-primary" onClick={() => navigate("/owners/dashboard")}>
//           Volver al dashboard
//         </button>
//       </div>
//       {store.auth === true ? (
//         <form className="container mt-4" onSubmit={handleSubmit}>
//           {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
//           {successMessage && <div className="alert alert-success">{successMessage}</div>}

//           {/* Componente de carga de imagen */}
//           <div className="mb-3">
//             <label htmlFor="image" className="form-label">
//               Adjuntar una imagen del restaurante
//             </label>
//             <CloudinaryUploader setImageUrl={setImageUrl} setErrorMessage={setErrorMessage} />
//             {imageUrl && (
//               <div className="mt-2">
//                 <img src={imageUrl} alt="Imagen del restaurante" className="img-fluid" />
//               </div>
//             )}
//           </div>

//           {/* Campos del restaurante */}
//           <div className="mb-3">
//             <label htmlFor="restaurantName" className="form-label">Nombre del restaurante</label>
//             <input
//               type="text"
//               value={name}
//               onChange={(e) => setName(e.target.value)}
//               className="form-control"
//               id="restaurantName"
//               required
//             />
//           </div>

//           <div className="mb-3">
//             <label htmlFor="location" className="form-label">Ubicación</label>
//             <input
//               type="text"
//               value={location}
//               onChange={(e) => setLocation(e.target.value)}
//               className="form-control"
//               id="location"
//               required
//             />
//           </div>

//           <div className="mb-3">
//             <label htmlFor="telephone" className="form-label">Teléfono</label>
//             <input
//               type="text"
//               value={telephone}
//               onChange={(e) => setTelephone(e.target.value)}
//               className="form-control"
//               id="telephone"
//               required
//             />
//           </div>

//           <div className="mb-3">
//             <label htmlFor="capacity" className="form-label">Capacidad</label>
//             <input
//               type="number"
//               value={capacity}
//               onChange={(e) => setCapacity(e.target.value)}
//               className="form-control"
//               id="capacity"
//               required
//             />
//           </div>

//           <button type="submit" className="btn btn-primary">
//             {id ? "Guardar Cambios" : "Crear Restaurante"}
//           </button>
//         </form>
//       ) : (
//         <Navigate to="/owners/login" />
//       )}
//     </>
//   );
// };

// export default CreateRestaurant;


import React, { useState, useContext, useEffect } from "react";
import { Context } from "../store/appContext";
import { useNavigate, Navigate, useParams } from "react-router-dom";
import CloudinaryUploader from "./CloudinaryUploader";

const CreateRestaurant = () => {
  // Estados para los campos del formulario
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [telephone, setTelephone] = useState("");
  const [capacity, setCapacity] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  
  const { store, actions } = useContext(Context);
  const navigate = useNavigate();
  const { id } = useParams(); // Obtenemos el id del restaurante si estamos editando

  const token = localStorage.getItem("token");

  // Cargar los datos del restaurante si estamos en modo edición
  useEffect(() => {
    if (id) {
      const restaurant = store.restaurants.find(r => r.id === parseInt(id));
      if (restaurant) {
        setName(restaurant.name);
        setLocation(restaurant.location);
        setTelephone(restaurant.telephone);
        setCapacity(restaurant.capacity);
        setImageUrl(restaurant.image_url || "");
      } else {
        setErrorMessage("Ristorante non trovato.");
      }
    }
  }, [id, store.restaurants]);

  // Función para manejar el envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault();

    // Datos predeterminados para latitud y longitud (cambiar cuando se agregue geolocalización)
    const latitude = "44.4048";  
    const longitude = "8.9345";

    // Crear objeto con los datos del restaurante
    const restaurantData = {
      name,
      location,
      telephone,
      capacity,
      image_url: imageUrl, // Usamos la URL de la imagen
      latitude,
      longitude
    };

    if (token) {
      if (id) {
        // Si tenemos id edit
        actions.modifyRestaurant(id, restaurantData, token)
          .then(() => navigate("/owners/dashboard")) // Redirigir al dashboard
          .catch((err) => setErrorMessage("Error al modificar el restaurante."));
      } else {
        // Si no id crea
        actions.createRestaurant(restaurantData, token)
          .then(() => {
            setSuccessMessage("Restaurante creado con éxito!");
            // navigate("/owners/dashboard");
          })
          .catch((err) => {
            setErrorMessage("Error al crear el restaurante.");
          });
      }
    } else {
      setErrorMessage("Token no disponible.");
    }
  };

  return (
    <>
      <div className="container d-flex justify-content-between align-items-center mt-3">
        <h1>Detalles de tu restaurante</h1>
        <button className="btn btn-primary" onClick={() => navigate("/owners/dashboard")}>
          Volver al dashboard
        </button>
      </div>
      {store.auth === true ? (
        <form className="container mt-4" onSubmit={handleSubmit}>
          {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
          {successMessage && <div className="alert alert-success">{successMessage}</div>}

          {/* Componente para cargar la imagen */}
          <div className="mb-3">
            <label htmlFor="image" className="form-label">
              Adjuntar una imagen del restaurante
            </label>
            <CloudinaryUploader setImageUrl={setImageUrl} setErrorMessage={setErrorMessage} />
            {imageUrl && (
              <div className="mt-2">
                <img src={imageUrl} alt="Imagen del restaurante" className="img-fluid" />
              </div>
            )}
          </div>

          {/* Campos del restaurante */}
          <div className="mb-3">
            <label htmlFor="restaurantName" className="form-label">Nombre del restaurante</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="form-control"
              id="restaurantName"
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="location" className="form-label">Ubicación</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="form-control"
              id="location"
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="telephone" className="form-label">Teléfono</label>
            <input
              type="text"
              value={telephone}
              onChange={(e) => setTelephone(e.target.value)}
              className="form-control"
              id="telephone"
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="capacity" className="form-label">Capacidad</label>
            <input
              type="number"
              value={capacity}
              onChange={(e) => setCapacity(e.target.value)}
              className="form-control"
              id="capacity"
              required
            />
          </div>

          {/* Botón para crear o editar el restaurante */}
          <button type="submit" className="btn btn-primary">
            {id ? "Guardar Cambios" : "Crear Restaurante"}
          </button>
        </form>
      ) : (
        <Navigate to="/owners/login" />
      )}
    </>
  );
};

export default CreateRestaurant;
