// import React, { useState, useContext, useEffect, useRef } from "react";
// import { Context } from "../store/appContext";
// import { useNavigate, Navigate, useParams } from "react-router-dom";

// const CreateRestaurant = () => {
//   const [name, setName] = useState("");
//   const [location, setLocation] = useState("");
//   const [telephone, setTelephone] = useState("");
//   const [latitude, setLatitude] = useState("");
//   const [longitude, setLongitude] = useState("");
//   const [capacity, setCapacity] = useState("");
//   const [errorMessage, setErrorMessage] = useState(""); // Mensaje de error
//   const [successMessage, setSuccessMessage] = useState(""); // Mensaje de éxito
//   const [image, setImage] = useState(null); // Estado para almacenar la imagen

//   const { store, actions } = useContext(Context);
//   const navigate = useNavigate();
//   const { id } = useParams();
//   const token = localStorage.getItem("token");

//   const hasLoaded = useRef(false); // Previene la recarga continua

//   useEffect(() => {
//     if (!token) {
//       navigate("/owners/login");
//     }
//   }, [token, navigate]);

//   // Carga los datos del restaurante si el id está presente (y si aún no se han cargado)
//   useEffect(() => {
//     if (id && !hasLoaded.current) {
//       actions.getRestaurantById(id);
//       hasLoaded.current = true;
//     }
//   }, [id, actions]);

//   useEffect(() => {
//     if (store.specificRestaurant && store.specificRestaurant.id === parseInt(id)) {
//       const restaurant = store.specificRestaurant;
//       setName(restaurant.name);
//       setLocation(restaurant.location);
//       setTelephone(restaurant.telephone);
//       setLatitude(restaurant.latitude);
//       setLongitude(restaurant.longitude);
//       setCapacity(restaurant.capacity);
//     }
//   }, [store.specificRestaurant, id]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const restaurantData = {
//       name,
//       location,
//       telephone,
//       latitude,
//       longitude,
//       capacity,
//     };

//     // Si hay una imagen, añádela al FormData
//     const formData = new FormData();
//     if (image) {
//       formData.append("image", image); // Añadir imagen al FormData
//     }
//     formData.append("restaurantData", JSON.stringify(restaurantData)); // Añadir otros datos del restaurante

//     try {
//       // Enviar la imagen y los datos al servidor
//       const response = await fetch("/upload-image", {
//         method: "POST",
//         body: formData,
//       });
//       const data = await response.json();
//       const imageUrl = data.imageUrl; // URL de la imagen retornada por Cloudinary

//       // Añadir la URL de la imagen a los datos del restaurante
//       restaurantData.image_url = imageUrl;

//       // Ahora enviar los datos del restaurante con la URL de la imagen
//       if (id) {
//         // Editar restaurante existente
//         actions.modifyRestaurant(id, restaurantData, token);
//       } else {
//         // Crear nuevo restaurante
//         actions.createRestaurant(restaurantData, token);
//       }

//       setSuccessMessage("Restaurante creado/actualizado con éxito!");
//       navigate("/owners/dashboard");
//     } catch (error) {
//       console.error("Error al subir la imagen:", error);
//       setErrorMessage("Error al subir la imagen.");
//     }
//   };

//   const handleClose = () => {
//     navigate("/owners/dashboard");
//   };

//   return (
//     <>
//       <h1 className="container mt-3">{id ? "Editar Restaurante" : "Crear Nuevo Restaurante"}</h1>
//       {store.auth === true ? (
//         <form className="container mt-4" onSubmit={handleSubmit}>
//           {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
//           {successMessage && <div className="alert alert-success">{successMessage}</div>}

//           <div className="mb-3">
//             <label htmlFor="restaurantName" className="form-label">
//               Nombre del Restaurante
//             </label>
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
//             <label htmlFor="location" className="form-label">
//               Ubicación
//             </label>
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
//             <label htmlFor="telephone" className="form-label">
//               Teléfono
//             </label>
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
//             <label htmlFor="latitude" className="form-label">
//               Latitud
//             </label>
//             <input
//               type="number"
//               value={latitude}
//               onChange={(e) => setLatitude(e.target.value)}
//               className="form-control"
//               id="latitude"
//               required
//             />
//           </div>

//           <div className="mb-3">
//             <label htmlFor="longitude" className="form-label">
//               Longitud
//             </label>
//             <input
//               type="number"
//               value={longitude}
//               onChange={(e) => setLongitude(e.target.value)}
//               className="form-control"
//               id="longitude"
//               required
//             />
//           </div>

//           <div className="mb-3">
//             <label htmlFor="capacity" className="form-label">
//               Capacidad
//             </label>
//             <input
//               type="number"
//               value={capacity}
//               onChange={(e) => setCapacity(e.target.value)}
//               className="form-control"
//               id="capacity"
//               required
//             />
//           </div>

//           {/* imagen */}
//           <div className="mb-3">
//             <label htmlFor="restaurantImage" className="form-label">
//               Imagen del Restaurante
//             </label>
//             <input
//               type="file"
//               onChange={(e) => setImage(e.target.files[0])}
//               className="form-control"
//               id="restaurantImage"
//             />
//           </div>

//           <button type="submit" className="btn btn-primary">
//             {id ? "Guardar Cambios" : "Crear Restaurante"}
//           </button>
//           <button type="button" className="btn btn-secondary ms-2" onClick={handleClose}>
//             Cerrar
//           </button>
//         </form>
//       ) : (
//         <Navigate to="/owners/login" />
//       )}
//     </>
//   );
// };

// export default CreateRestaurant;



import React, { useState, useContext, useEffect, useRef } from "react";
import { Context } from "../store/appContext";

import { useNavigate, Navigate, useParams } from "react-router-dom";

const CreateRestaurant = () => {
  
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [telephone, setTelephone] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [capacity, setCapacity] = useState("");
  const [errorMessage, setErrorMessage] = useState("");  // mensaje errores
  const [successMessage, setSuccessMessage] = useState("");  // mensaje ok


  const { store, actions } = useContext(Context);
  const navigate = useNavigate();
  const { id } = useParams();
  console.log("ID del ristorante:", id);

  const token = localStorage.getItem("token");

  const hasLoaded = useRef(false);  // bloquea la recarga continua

  useEffect(() => {
    if (!token) {
      navigate("/owners/login");
    }
  }, [token, navigate]);

  // Carica los datos del rest si id presente (aún nocargados)
  useEffect(() => {
    if (id && !hasLoaded.current) {
      actions.getRestaurantById(id); 
      hasLoaded.current = true;
    }
  }, [id, actions]);

  
  useEffect(() => {
    if (store.specificRestaurant && store.specificRestaurant.id === parseInt(id)) {
      const restaurant = store.specificRestaurant;
      setName(restaurant.name);
      setLocation(restaurant.location);
      setTelephone(restaurant.telephone);
      setLatitude(restaurant.latitude);
      setLongitude(restaurant.longitude);
      setCapacity(restaurant.capacity);
    }
  }, [store.specificRestaurant, id]);

  const handleSubmit = (e) => {
    e.preventDefault();


    const restaurantData = {
      name,
      location,
      telephone,
      latitude,
      longitude,
      capacity,
    };
    if (token) {
      if (id) {
        // Modifica rist
        actions.modifyRestaurant(id, restaurantData, token)
            navigate("/owners/dashboard");

      } else {
        // Crea rist
        actions.createRestaurant(restaurantData, token)
          .then(() => {
            setSuccessMessage("Restaurante creado exitosamente!");
            navigate("/owners/dashboard");
          })
          .catch((error) => {
            console.error("Error al crear restaurante:", error);
            setErrorMessage("Ocurrió un error al crear el restaurante.");
          });
      }
    } else {
      setErrorMessage("Token is not available");
    }
  };

  const handleClose = () => {
    navigate("/owners/dashboard");
  };

  return (
    <>
      <h1 className="container mt-3">{id ? "Editar Restaurante" : "Crear Nuevo Restaurante"}</h1>
      {store.auth === true ? (
        <form className="container mt-4" onSubmit={handleSubmit}>

          {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
          {successMessage && <div className="alert alert-success">{successMessage}</div>}

          <div className="mb-3">
            <label htmlFor="restaurantName" className="form-label">
              Nombre del Restaurante
            </label>
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
            <label htmlFor="location" className="form-label">
              Ubicacion
            </label>
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
            <label htmlFor="telephone" className="form-label">
              Telefono
            </label>
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
            <label htmlFor="latitude" className="form-label">
              Latitud
            </label>
            <input
              type="number"
              value={latitude}
              onChange={(e) => setLatitude(e.target.value)}
              className="form-control"
              id="latitude"
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="longitude" className="form-label">
              Longitud
            </label>
            <input
              type="number"
              value={longitude}
              onChange={(e) => setLongitude(e.target.value)}
              className="form-control"
              id="longitude"
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="capacity" className="form-label">
              Capacidad
            </label>
            <input
              type="number"
              value={capacity}
              onChange={(e) => setCapacity(e.target.value)}
              className="form-control"
              id="capacity"
              required
            />
          </div>

          <button type="submit" className="btn btn-primary">
            {id ? "Guardar Cambios" : "Crear Restaurante"}
          </button>
          <button type="button" className="btn btn-secondary ms-2" onClick={handleClose}>
            Cerrar
          </button>
        </form>
      ) : (
        <Navigate to="/owners/login" />
      )}
    </>
  );
};
export default CreateRestaurant;