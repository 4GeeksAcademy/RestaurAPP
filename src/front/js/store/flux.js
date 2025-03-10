/*
const getState = ({ getStore, getActions, setStore }) => {
  return {
    store: {
      message: null,
      demo: [
        {
          title: "FIRST",
          background: "white",
          initial: "white",
        },
        {
          title: "SECOND",
          background: "white",
          initial: "white",
        },
      ],
      diners: [],
      auth: true,
      owners: [],
      specificOwner: null,
      reservations: [],
      availableRestaurants: [],
      user: null,
    },
    actions: {
      // Ejemplo de función (sin cambios)
      exampleFunction: () => {
        getActions().changeColor(0, "green");
      },

      getMessage: async () => {
        console.log("Ejecutando getMessage");
        try {
          const backendUrl = process.env.BACKEND_URL;
          if (!backendUrl) {
            throw new Error(
              "La variable de entorno BACKEND_URL no está definida."
            );
          }

          const response = await fetch(`${backendUrl}/api/hello`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          });

          if (!response.ok) {
            // Obtén el texto de error si la respuesta no es válida
            const errorText = await response.text();
            throw new Error(`Error HTTP: ${response.status} - ${errorText}`);
          }

          const data = await response.json();
          setStore({ message: data.message });
          console.log("Mensaje recibido del backend:", data);
          return data;
        } catch (error) {
          console.error("Error en getMessage:", error.message);
        }
      },

      // Obtener lista de comensales
      getDinerList: async () => {
        console.log("Ejecutando getDinerList");
        const requestOptions = {
          method: "GET",
          headers: { "content-type": "application/json" },
        };

        try {
          const response = await fetch(
            `${process.env.BACKEND_URL}/api/diners/`,
            requestOptions
          );
          if (!response.ok) {
            throw new Error("Error al obtener la lista de comensales.");
          }
          const result = await response.json();
          setStore({ diners: result });
          console.log("Lista de comensales obtenida:", result);
        } catch (error) {
          console.error("Error en getDinerList:", error.message);
        }
      },
      
    
      getAvailableRestaurants: async (city, people) => {
        console.log("Ejecutando getAvailableRestaurants");
        try {
          const response = await fetch(
            `${process.env.BACKEND_URL}/api/reservations/available`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ city, people }),
            }
          );
          if (!response.ok) {
            const error = await response.json();
            throw new Error(
              error.error || "Error al buscar restaurantes disponibles."
            );
          }
          const data = await response.json();
          setStore({ availableRestaurants: data.available_restaurants });
          console.log("Restaurantes disponibles:", data.available_restaurants);
        } catch (error) {
          console.error("Error en getAvailableRestaurants:", error.message);
        }
      },

      // Crear una nueva reserva
      createReservation: async (reservationData) => {
        console.log("Ejecutando createReservation");
        try {
          const response = await fetch(
            `${process.env.BACKEND_URL}/api/reservations/`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(reservationData),
            }
          );
          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || "Error al crear la reserva.");
          }
          const data = await response.json();
          console.log("Reserva creada exitosamente:", data);
        } catch (error) {
          console.error("Error en createReservation:", error.message);
        }
      },

      // Obtener todos los propietarios
      getAllOwners: async () => {
        console.log("Ejecutando getAllOwners");
        try {
          const response = await fetch(
            `${process.env.BACKEND_URL}/api/owners/`
          );
          if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Error HTTP: ${response.status} - ${errorText}`);
          }
          const data = await response.json();
          console.log("Datos de propietarios obtenidos:", data);
          setStore({ owners: data });
        } catch (error) {
          console.error("Error en getAllOwners:", error.message);
        }
      },

      // Obtener un propietario específico
      getSpecificOwner: async (ownerId) => {
        console.log(`Ejecutando getSpecificOwner para ownerId: ${ownerId}`);
        try {
          const response = await fetch(
            `${process.env.BACKEND_URL}/api/owners/${ownerId}`
          );
          if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Error HTTP: ${response.status} - ${errorText}`);
          }
          const data = await response.json();
          console.log("Propietario específico:", data);
          setStore({ specificOwner: data });
        } catch (error) {
          console.error("Error en getSpecificOwner:", error.message);
        }
      },

      // Obtener todas las reservas
      getAllReservations: async () => {
        console.log("Ejecutando getAllReservations");
        try {
          const response = await fetch(
            `${process.env.BACKEND_URL}/api/reservations/`
          );
          if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
          }
          const data = await response.json();
          console.log("Reservas obtenidas:", data);
          setStore({ reservations: data.reservations });
        } catch (error) {
          console.error("Error en getAllReservations:", error.message);
        }
      },

      // Eliminar un comensal
      handleDelete: async (id) => {
        console.log(`Ejecutando handleDelete para dinerId: ${id}`);
        const requestOptions = {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        };

        try {
          const response = await fetch(
            `${process.env.BACKEND_URL}/api/diner/${id}`,
            requestOptions
          );
          if (!response.ok) {
            throw new Error("Error al eliminar el comensal.");
          }
          const updatedDiners = getStore().diners.filter(
            (diner) => diner.id !== id
          );
          setStore({ diners: updatedDiners });
          console.log("Comensal eliminado:", id);
        } catch (error) {
          console.error("Error en handleDelete:", error.message);
        }
      },

      // Actualizar información de un comensal
      handleEdit: async (id, fullname, email, telephone, password) => {
        console.log(`Ejecutando handleEdit para dinerId: ${id}`);
        try {
          const response = await fetch(
            `${process.env.BACKEND_URL}/api/diner/${id}`,
            {
              method: "PUT",
              body: JSON.stringify({
                id,
                fullname,
                email,
                telephone,
                password,
              }),
              headers: { "Content-Type": "application/json" },
            }
          );
          if (!response.ok) {
            throw new Error("Error al actualizar el comensal.");
          }
          const updatedDiner = await response.json();
          const updatedDiners = getStore().diners.map((diner) =>
            diner.id === updatedDiner.id ? updatedDiner : diner
          );
          setStore({ diners: updatedDiners });
          console.log("Comensal actualizado:", updatedDiner);
        } catch (error) {
          console.error("Error en handleEdit:", error.message);
        }
      },

      // Registrar un nuevo comensal
      DinerForm: async (fullname, email, telephone, password) => {
        console.log("Ejecutando DinerForm");
        const requestOptions = {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ fullname, email, telephone, password }),
        };

        try {
          const response = await fetch(
            `${process.env.BACKEND_URL}/api/diner`,
            requestOptions
          );
          if (!response.ok) {
            throw new Error("Error al crear el usuario.");
          }
          const result = await response.json();
          setStore({ auth: true });
          localStorage.setItem("token", result.access_token);
          console.log("Usuario creado y autenticado:", result);
        } catch (error) {
          console.error("Error en DinerForm:", error.message);
        }
      },

      // Cambiar color (acción de ejemplo)
      changeColor: (index, color) => {
        console.log(`Ejecutando changeColor para índice: ${index}`);
        const store = getStore();
        const demo = store.demo.map((elm, i) => {
          if (i === index) elm.background = color;
          return elm;
        });
        setStore({ demo });
      },
    },
  };
};

export default getState;
*/

const getState = ({ getStore, getActions, setStore }) => {
  return {
    store: {
      message: null,
      demo: [
        {
          title: "FIRST",
          background: "white",
          initial: "white",
        },
        {
          title: "SECOND",
          background: "white",
          initial: "white",
        },
      ],
      diners: [],
      auth: true,
      owners: [],
      specificOwner: null,
      reservations: [],
      availableRestaurants: [],
      ownerRestaurants: [], // Lista de restaurantes del propietario
      user: null,
    },
    actions: {
      // Ejemplo de función (sin cambios)
      exampleFunction: () => {
        getActions().changeColor(0, "green");
      },

      getMessage: async () => {
        console.log("Ejecutando getMessage");
        try {
          const backendUrl = process.env.BACKEND_URL;
          if (!backendUrl) {
            throw new Error(
              "La variable de entorno BACKEND_URL no está definida."
            );
          }

          const response = await fetch(`${backendUrl}/api/hello`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          });

          if (!response.ok) {
            // Obtén el texto de error si la respuesta no es válida
            const errorText = await response.text();
            throw new Error(`Error HTTP: ${response.status} - ${errorText}`);
          }

          const data = await response.json();
          setStore({ message: data.message });
          console.log("Mensaje recibido del backend:", data);
          return data;
        } catch (error) {
          console.error("Error en getMessage:", error.message);
        }
      },

      // Obtener lista de comensales
      getDinerList: async () => {
        console.log("Ejecutando getDinerList");
        const requestOptions = {
          method: "GET",
          headers: { "content-type": "application/json" },
        };

        try {
          const response = await fetch(
            `${process.env.BACKEND_URL}/api/diners/`,
            requestOptions
          );
          if (!response.ok) {
            throw new Error("Error al obtener la lista de comensales.");
          }
          const result = await response.json();
          setStore({ diners: result });
          console.log("Lista de comensales obtenida:", result);
        } catch (error) {
          console.error("Error en getDinerList:", error.message);
        }
      },
      
    
      getAvailableRestaurants: async (city, people) => {
        console.log("Ejecutando getAvailableRestaurants");
        try {
          const response = await fetch(
            `${process.env.BACKEND_URL}/api/reservations/available`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ city, people }),
            }
          );
          if (!response.ok) {
            const error = await response.json();
            throw new Error(
              error.error || "Error al buscar restaurantes disponibles."
            );
          }
          const data = await response.json();
          setStore({ availableRestaurants: data.available_restaurants });
          console.log("Restaurantes disponibles:", data.available_restaurants);
        } catch (error) {
          console.error("Error en getAvailableRestaurants:", error.message);
        }
      },

      // Crear una nueva reserva
      createReservation: async (reservationData) => {
        console.log("Ejecutando createReservation");
        try {
          const response = await fetch(
            `${process.env.BACKEND_URL}/api/reservations/`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(reservationData),
            }
          );
          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || "Error al crear la reserva.");
          }
          const data = await response.json();
          console.log("Reserva creada exitosamente:", data);
        } catch (error) {
          console.error("Error en createReservation:", error.message);
        }
      },

      // Obtener todos los propietarios
      getAllOwners: async () => {
        console.log("Ejecutando getAllOwners");
        try {
          const response = await fetch(
            `${process.env.BACKEND_URL}/api/owners/`
          );
          if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Error HTTP: ${response.status} - ${errorText}`);
          }
          const data = await response.json();
          console.log("Datos de propietarios obtenidos:", data);
          setStore({ owners: data });
        } catch (error) {
          console.error("Error en getAllOwners:", error.message);
        }
      },

      // Obtener un propietario específico
      getSpecificOwner: async (ownerId) => {
        console.log(`Ejecutando getSpecificOwner para ownerId: ${ownerId}`);
        try {
          const response = await fetch(
            `${process.env.BACKEND_URL}/api/owners/${ownerId}`
          );
          if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Error HTTP: ${response.status} - ${errorText}`);
          }
          const data = await response.json();
          console.log("Propietario específico:", data);
          setStore({ specificOwner: data });
        } catch (error) {
          console.error("Error en getSpecificOwner:", error.message);
        }
      },

      // Obtener todas las reservas
      getAllReservations: async () => {
        console.log("Ejecutando getAllReservations");
        try {
          const response = await fetch(
            `${process.env.BACKEND_URL}/api/reservations/`
          );
          if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
          }
          const data = await response.json();
          console.log("Reservas obtenidas:", data);
          setStore({ reservations: data.reservations });
        } catch (error) {
          console.error("Error en getAllReservations:", error.message);
        }
      },

      // Obtener reservas de un restaurante
      getRestaurantReservations: async (restaurantId) => {
        console.log(`Ejecutando getRestaurantReservations para restaurantId: ${restaurantId}`);
        try {
          const response = await fetch(
            `${process.env.BACKEND_URL}/api/reservations/restaurant/${restaurantId}`
          );
          if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Error HTTP: ${response.status} - ${errorText}`);
          }
          const data = await response.json();
          console.log("Reservas del restaurante:", data);
          setStore({ reservations: data.reservations });
        } catch (error) {
          console.error("Error en getRestaurantReservations:", error.message);
        }
      },

      // Gestionar una reserva (aceptar, rechazar, modificar)
      manageReservation: async (reservationId, reservationData) => {
        console.log(`Ejecutando manageReservation para reservationId: ${reservationId}`);
        try {
          const response = await fetch(
            `${process.env.BACKEND_URL}/api/reservations/manage/${reservationId}`,
            {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(reservationData),
            }
          );
          if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Error HTTP: ${response.status} - ${errorText}`);
          }
          const data = await response.json();
          console.log("Reserva gestionada exitosamente:", data);
          // Actualizar las reservas en el estado
          const updatedReservations = getStore().reservations.map(reservation =>
            reservation.id === reservationId ? data.reservation : reservation
          );
          setStore({ reservations: updatedReservations });
        } catch (error) {
          console.error("Error en manageReservation:", error.message);
        }
      },

      // Eliminar una reserva
      deleteReservation: async (reservationId) => {
        console.log(`Ejecutando deleteReservation para reservationId: ${reservationId}`);
        try {
          const response = await fetch(
            `${process.env.BACKEND_URL}/api/reservations/manage/${reservationId}`,
            {
              method: "DELETE",
              headers: { "Content-Type": "application/json" },
            }
          );
          if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Error HTTP: ${response.status} - ${errorText}`);
          }
          console.log("Reserva eliminada exitosamente.");
          // Actualizar las reservas en el estado
          const updatedReservations = getStore().reservations.filter(reservation => reservation.id !== reservationId);
          setStore({ reservations: updatedReservations });
        } catch (error) {
          console.error("Error en deleteReservation:", error.message);
        }
      },

      // Obtener restaurantes de un propietario
      getOwnerRestaurants: async (ownerId) => {
        console.log(`Ejecutando getOwnerRestaurants para ownerId: ${ownerId}`);
        try {
          const response = await fetch(
            `${process.env.BACKEND_URL}/api/owners/${ownerId}/restaurants`
          );
          if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Error HTTP: ${response.status} - ${errorText}`);
          }
          const data = await response.json();
          console.log("Restaurantes del propietario:", data);
          setStore({ ownerRestaurants: data });
        } catch (error) {
          console.error("Error en getOwnerRestaurants:", error.message);
        }
      }
    },
  };
} 
export default getState;
