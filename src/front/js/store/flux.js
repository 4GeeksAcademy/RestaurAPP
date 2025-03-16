const getState = ({ getStore, getActions, setStore }) => {
    return {
        store: {
            diners: [],
            auth: false,
            owners: [],
            specificOwner: null,
            restaurants: [],
            reservations: [],
            availableRestaurants: [],
            ownerRestaurants: [],
        },
        actions: {
            // Nueva función getMessage
            getMessage: () => {
                console.log("Mensaje desde getMessage"); // Mensaje de prueba
                return "Este es un mensaje de prueba"; // Retorno de ejemplo
            },
            // Nueva función getAllReservations
            getAllReservations: async () => {
                try {
                    const response = await fetch(`${process.env.BACKEND_URL}/api/reservations`, {
                        method: "GET",
                        headers: { "Content-Type": "application/json" },
                    });
                    if (!response.ok) throw new Error("Error al obtener las reservas.");
                    const data = await response.json();
                    setStore({ reservations: data }); // Almacena las reservas en el estado
                } catch (error) {
                    console.error("Error en getAllReservations:", error.message);
                }

            },
            createReservation: async (reservationData) => {
                try {
                    const response = await fetch(`${process.env.BACKEND_URL}/api/reservations/`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(reservationData),
                    });

                    if (!response.ok) {
                        throw new Error("Error al crear la reserva");
                    }

                    const data = await response.json();
                    console.log("Reserva creada exitosamente:", data);
                    return data; // Puedes devolver la respuesta si es necesario
                } catch (error) {
                    console.error("Error en createReservation:", error.message);
                }
            },


            // Obtener lista de comensales
            getDinerList: async () => {
                try {
                  const response = await fetch(`${process.env.BACKEND_URL}/api/diners`, {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                  });
                  if (!response.ok) throw new Error("Error al obtener la lista de comensales.");
                  
                  const result = await response.json();
                  console.log("Datos de comensales recibidos del backend:", result); // Depuración
                  
                  // Acceder al array dentro de la clave "data"
                  setStore({ diners: result.data });
                  console.log("Diners guardados en el estado global:", result.data); // Depuración
                } catch (error) {
                  console.error("Error en getDinerList:", error.message);
                }
            },
              

            getAvailableRestaurants: async (location, people) => {
                const params = new URLSearchParams();
                if (location) params.append("location", location.trim());
                if (people) params.append("people", people);

                const url = `${process.env.BACKEND_URL}/api/restaurants/search?${params.toString()}`;
                console.log("URL solicitada:", url); // Verifica la URL construida

                try {
                    const response = await fetch(url, {
                        method: "GET",
                        headers: { "Content-Type": "application/json" },
                    });

                    if (!response.ok) {
                        throw new Error("Error al obtener restaurantes disponibles.");
                    }

                    const data = await response.json();
                    setStore({ availableRestaurants: data.data });
                } catch (error) {
                    console.error("Error en getAvailableRestaurants:", error.message);
                }
            },



            // Editar un comensal
            handleEdit: async (dinerId, updatedData) => {
                try {
                    const response = await fetch(`${process.env.BACKEND_URL}/api/diners/${dinerId}`, {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(updatedData),
                    });
                    if (!response.ok) throw new Error("Error al editar el comensal.");
                    const data = await response.json();
                    const updatedDiners = getStore().diners.map((diner) =>
                        diner.id === dinerId ? data.diner : diner
                    );
                    setStore({ diners: updatedDiners });
                } catch (error) {
                    console.error("Error en handleEdit:", error.message);
                }
            },

            // Obtener todos los propietarios
            getAllOwners: async () => {
                try {
                    const response = await fetch(`${process.env.BACKEND_URL}/api/owners`, {
                        method: "GET",
                        headers: { "Content-Type": "application/json" },
                    });
                    console.log("URL solicitada EESSS:", `${process.env.BACKEND_URL}/api/owners`);

                    if (!response.ok) throw new Error("Error al obtener propietarios.");
                    const data = await response.json();
                    
                    console.log("Datos de propietarios recibidos del backend:", data);

                    setStore({ owners: data.data });
                } catch (error) {
                    console.error("Error en getAllOwners:", error.message);
                }
            },

            // Crear un propietario
            addOwner: async (ownerData) => {
                try {
                    const response = await fetch(`${process.env.BACKEND_URL}/api/owners`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(ownerData),
                    });
                    if (!response.ok) throw new Error("Error al crear propietario.");
                    const data = await response.json();
                    setStore({ owners: [...getStore().owners, data] });
                } catch (error) {
                    console.error("Error en addOwner:", error.message);
                }
            },

            // Eliminar un propietario
            deleteOwner: async (ownerId) => {
                try {
                    const response = await fetch(`${process.env.BACKEND_URL}/api/owners/${ownerId}`, {
                        method: "DELETE",
                        headers: { "Content-Type": "application/json" },
                    });
                    if (!response.ok) throw new Error("Error al eliminar propietario.");
                    const updatedOwners = getStore().owners.filter((owner) => owner.id !== ownerId);
                    setStore({ owners: updatedOwners });
                } catch (error) {
                    console.error("Error en deleteOwner:", error.message);
                }
            },

            // Obtener todos los restaurantes
            getAllRestaurants: async () => {
                try {
                    const response = await fetch(`${process.env.BACKEND_URL}/api/restaurants`, {
                        method: "GET",
                        headers: { "Content-Type": "application/json" },
                    });
                    if (!response.ok) throw new Error("Error al obtener restaurantes.");
                    const data = await response.json();
                    setStore({ restaurants: data });
                } catch (error) {
                    console.error("Error en getAllRestaurants:", error.message);
                }
            },

            // Crear un restaurante
            createRestaurant: async (restaurantData) => {
                try {
                    const response = await fetch(`${process.env.BACKEND_URL}/api/restaurants`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(restaurantData),
                    });
                    if (!response.ok) throw new Error("Error al crear restaurante.");
                    const data = await response.json();
                    setStore({ restaurants: [...getStore().restaurants, data] });
                } catch (error) {
                    console.error("Error en createRestaurant:", error.message);
                }
            },

            // Obtener reservas de un restaurante
            getRestaurantReservations: async (restaurantId) => {
                try {
                    const response = await fetch(`${process.env.BACKEND_URL}/api/reservations/restaurant/${restaurantId}`, {
                        method: "GET",
                        headers: { "Content-Type": "application/json" },
                    });
                    if (!response.ok) throw new Error("Error al obtener reservas del restaurante.");
                    const data = await response.json();
                    setStore({ reservations: data });
                } catch (error) {
                    console.error("Error en getRestaurantReservations:", error.message);
                }
            },

            // Gestionar una reserva
            manageReservation: async (reservationId, reservationData) => {
                try {
                    const response = await fetch(`${process.env.BACKEND_URL}/api/reservations/manage/${reservationId}`, {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(reservationData),
                    });
                    if (!response.ok) throw new Error("Error al gestionar reserva.");
                    const data = await response.json();
                    const updatedReservations = getStore().reservations.map((reservation) =>
                        reservation.id === reservationId ? data.reservation : reservation
                    );
                    setStore({ reservations: updatedReservations });
                } catch (error) {
                    console.error("Error en manageReservation:", error.message);
                }
            },
        },
    };
};

export default getState;
