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

      handleEdit: async (diner_id, updatedData) => {
        console.log(`Editando diner con ID: ${diner_id}`);
        try {
          const url = new URL(`/api/diners/${diner_id}`, process.env.BACKEND_URL).toString();
      
          const response = await fetch(url, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedData),
          });
      
          if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Error HTTP: ${response.status} - ${errorText}`);
          }
      
          const data = await response.json();
          console.log("Diner actualizado exitosamente:", data);
      
          // Actualizar el estado global (store)
          const updatedDiners = getStore().diners.map((diner) =>
            diner.id === diner_id ? data.diner : diner
          );
          setStore({ diners: updatedDiners });
      
          return data.diner;
        } catch (error) {
          console.error("Error en handleEdit:", error.message);
          throw error; // Lanza el error para que el componente lo maneje
        }
      },
      
      
      // Buscar restaurantes disponibles
      getAvailableRestaurants: async (city, people) => {
        console.log("Ejecutando getAvailableRestaurants");
        try {
          const response = await fetch(
            `${process.env.BACKEND_URL}/api/restaurants/available`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ location, people }),
            }
          );
          if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Error HTTP: ${response.status} - ${errorText}`);
          }
          const data = await response.json();
          console.log("Restaurantes disponibles:", data.available_restaurants);
          setStore({ availableRestaurants: data.available_restaurants });
        } catch (error) {
          console.error("Error en getAvailableRestaurants:", error.message);
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
      // Crear un nuevo propietario
      addOwner: async (ownerData) => {
        console.log("Ejecutando addOwner");
        try {
          const response = await fetch(
            `${process.env.BACKEND_URL}/api/owners/`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(ownerData),
            }
          );
      
          if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Error HTTP: ${response.status} - ${errorText}`);
          }
      
          const data = await response.json();
          console.log("Propietario creado exitosamente:", data);
      
          // Opcional: Agregar el nuevo propietario al store si es necesario
          const updatedOwners = [...getStore().owners, data.owner];
          setStore({ owners: updatedOwners });
      
          return data; // Devuelve la respuesta si es necesario
        } catch (error) {
          console.error("Error en addOwner:", error.message);
          throw error; // Opcional: Lanza el error para que el componente lo maneje
        }
      },
      // Eliminar un propietario
      deleteOwner: async (owner_id) => {
        console.log(`Ejecutando deleteOwner para owner_id: ${owner_id}`);
        try {
          const response = await fetch(
            `${process.env.BACKEND_URL}/api/owners/${owner_id}`, // Endpoint del backend para eliminar al propietario
            {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json", // Tipo de contenido
              },
            }
          );
      
          if (!response.ok) {
            // Si el servidor devuelve un error, lanza un mensaje con detalles
            const errorText = await response.text();
            throw new Error(`Error HTTP: ${response.status} - ${errorText}`);
          }
      
          console.log("Propietario eliminado exitosamente.");
          // Actualiza el estado para remover el propietario eliminado
          const updatedOwners = getStore().owners.filter(
            (owner) => owner.id !== owner_id
          );
          setStore({ owners: updatedOwners });
        } catch (error) {
          console.error("Error en deleteOwner:", error.message);
        }
      },
      // Modificar un propietario
      updateOwner: async (owner_id, updatedData) => {
        console.log(`Ejecutando updateOwner para owner_id: ${owner_id}`);
        try {
          // Construye la URL de actualización
          const url = new URL(`/api/owners/${owner_id}`, process.env.BACKEND_URL).toString();
          const response = await fetch(url, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedData), // Enviar solo los datos a actualizar
          });
      
          if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Error HTTP: ${response.status} - ${errorText}`);
          }
      
          const data = await response.json();
          console.log("Propietario actualizado exitosamente:", data);
      
          // Actualiza el estado del store con los datos actualizados
          const updatedOwners = getStore().owners.map((owner) =>
            owner.id === owner_id ? data.owner : owner
          );
          setStore({ owners: updatedOwners });
      
          return data.owner; // Devuelve el propietario actualizado
        } catch (error) {
          console.error("Error en updateOwner:", error.message);
        }
      },
      
      // Obtener un propietario específico
      getSpecificOwner: async (owner_id) => {
        console.log(`Ejecutando getSpecificOwner para owner_id: ${owner_id}`);
        try {
          const response = await fetch(
            `${process.env.BACKEND_URL}/api/owners/${owner_id}`
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
      getRestaurantReservations: async (restaurant_id) => {
        console.log(
          `Ejecutando getRestaurantReservations para restaurant_id: ${restaurant_id}`
        );
        try {
          const response = await fetch(
            `${process.env.BACKEND_URL}/api/reservations/restaurant/${restaurant_id}`
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
      manageReservation: async (reservation_id, reservationData) => {
        console.log(
          `Ejecutando manageReservation para reservation_id: ${reservation_id}`
        );
        try {
          const response = await fetch(
            `${process.env.BACKEND_URL}/api/reservations/manage/${reservation_id}`,
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
          const updatedReservations = getStore().reservations.map(
            (reservation) =>
              reservation.id === reservation_id ? data.reservation : reservation
          );
          setStore({ reservations: updatedReservations });
        } catch (error) {
          console.error("Error en manageReservation:", error.message);
        }
      },

      // Eliminar una reserva
      deleteReservation: async (reservation_id) => {
        console.log(
          `Ejecutando deleteReservation para reservation_id: ${reservation_id}`
        );
        try {
          const response = await fetch(
            `${process.env.BACKEND_URL}/api/reservations/manage/${reservation_id}`,
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
          const updatedReservations = getStore().reservations.filter(
            (reservation) => reservation.id !== reservation_id
          );
          setStore({ reservations: updatedReservations });
        } catch (error) {
          console.error("Error en deleteReservation:", error.message);
        }
      },

      // Obtener restaurantes de un propietario
      getOwnerRestaurants: async (owner_id) => {
        console.log(
          `Ejecutando getOwnerRestaurants para owner_id: ${owner_id}`
        );
        try {
          const response = await fetch(
            `${process.env.BACKEND_URL}/api/owners/${owner_id}/restaurants`
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
      },
    },
  };
};
export default getState;
