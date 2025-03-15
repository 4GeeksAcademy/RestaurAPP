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
            auth: false,
            owners: [],
            specificOwner: null,
            origins: [],
            restaurants: [],
            categories: [],
            specificCategory: null,
        },
        actions: {
            // Use getActions to call a function within a function
            exampleFunction: () => {
                getActions().changeColor(0, "green");
            },

            getDinerList: () => {
                const requestOptions = {
                    method: "GET",
                    headers: { "content-type": "application/json" },
                };

                fetch(process.env.BACKEND_URL + "/api/diners", requestOptions)
                    .then((response) => response.json())
                    .then((result) => {
                        setStore({ diners: result });
                    });
            },

            handleDelete: (id) => {
                const requestOptions = {
                    method: "DELETE",
                    headers: { "Content-Type": "application/json" },
                };

                fetch(process.env.BACKEND_URL + "/api/diner/" + id, requestOptions)
                    .then((response) => response.json())
                    .then(() => {
                        const updatedDiners = getStore().diners.filter((diner) => diner.id !== id);
                        setStore({ diners: updatedDiners });
                    });
            },

            handleEdit: (id, fullname, email, telephone, password) => {
                fetch(process.env.BACKEND_URL + "/api/diner/" + id, {
                    method: "PUT",
                    body: JSON.stringify({ id, fullname, email, telephone, password }),
                    headers: { "Content-Type": "application/json" },
                })
                    .then((response) => response.json())
                    .then((updatedDiner) => {
                        const updatedDiners = getStore().diners.map((diner) =>
                            diner.id === updatedDiner.id ? updatedDiner : diner
                        );
                        setStore({ diners: updatedDiners });
                    });
            },

            DinerForm: (fullname, email, telephone, password) => {
                const requestOptions = {
                    method: "POST",
                    headers: { "content-type": "application/json" },
                    body: JSON.stringify({ fullname, email, telephone, password }),
                };

                fetch(process.env.BACKEND_URL + "/api/diner", requestOptions)
                    .then((response) => {
                        if (!response.ok) {
                            throw new Error("Error al crear el usuario. Verifica los datos o intenta más tarde.");
                        }
                        return response.json();
                    })
                    .then((result) => {
                        setStore({ auth: true });
                        localStorage.setItem("token", result.access_token);
                    });
            },

            dinerLogin: (email, password) => {

                const backendUrl = process.env.BACKEND_URL + "/api/diner/login";
                console.log("Backend URL:", backendUrl);

                const requestOption = {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        email: email,
                        password: password,
                    }),
                };
                fetch(process.env.BACKEND_URL + "/api/diner/login", requestOption)
                    .then((response) => {
                        if (response.status == 200) {
                            setStore({ auth: true });
                        } else {
                            setStore({ auth: false });
                        }
                        return response.json();
                    })
                    .then((data) => {
                        if (data.msg) {
                            alert(data.msg);
                        } else {
                            localStorage.setItem("dinerFullName", data.diner_fullname);
                            setStore({ auth: true, dinerFullName: data.diner_fullname });
                        }
                    });
            },
            dinerLogout: () => {
                setStore({ auth: false });
                localStorage.removeItem("token");
            },

            getAllOwners: () => {
                fetch(process.env.BACKEND_URL + "/api/owners")
                    .then((response) => response.json())
                    .then((data) => {
                        console.log("Datos recibidos:", data);
                        setStore({ owners: data });
                    });
            },

            getSpecificOwner: (ownerId) => {
                fetch(process.env.BACKEND_URL + "/api/owners/" + ownerId)
                    .then((response) => response.json())
                    .then((data) => {
                        console.log("Datos recibidos:", data);
                        setStore({ specificOwner: data });
                    });
            },

            addOwner: (newOwner) => {
                const requestOptions = {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(newOwner),
                };

                fetch(process.env.BACKEND_URL + "/api/owners", requestOptions)
                    .then((response) => response.json())
                    .then((data) => {
                        const store = getStore();
                        setStore({ owners: [...store.owners, data] });

                        getActions().getAllOwners();
                    });
            },

            deleteOwner: (ownerId) => {
                const requestOptions = {
                    method: "DELETE",
                    headers: { "Content-Type": "application/json" },
                };

                fetch(process.env.BACKEND_URL + "/api/owners/" + ownerId, requestOptions)
                    .then((response) => response.json())
                    .then(() => {
                        const store = getStore();
                        setStore({ owners: store.owners.filter((owner) => owner.id !== ownerId) });

                        getActions().getAllOwners();
                    });
            },

            modifyOwner: (ownerId, updatedOwner) => {
                const requestOptions = {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(updatedOwner),
                };

                fetch(process.env.BACKEND_URL + "/api/owners/" + ownerId, requestOptions)
                    .then((response) => response.json())
                    .then((data) => {
                        const store = getStore();
                        const updatedOwners = store.owners.map((owner) =>
                            owner.id === ownerId ? data : owner
                        );
                        setStore({ owners: updatedOwners });

                        getActions().getAllOwners();
                    });
            },

            ownerLogin: (email, password) => {
                console.log("login from actions");
                const backendUrl = process.env.BACKEND_URL + "/api/owners/login";
                console.log("Backend URL:", backendUrl); 
           
                const requestOption = {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        email: email,
                        password: password,
                    }),
                };

                return fetch(backendUrl, requestOption)
                    .then((response) => {
                        console.log(response.status);
                        if (response.status === 200) {

//                 fetch(process.env.BACKEND_URL + "/api/owners/login", requestOption)
//                     .then((response) => {
//                         console.log(response.status);
//                         if (response.status == 200) {

                            setStore({ auth: true });
                        } else {
                            setStore({ auth: false });
                        }

                        return response.json(); 
                    })
                    .then((data) => {
                        if (data.msg) {
                            alert(data.msg); 
                        } else {
                            localStorage.setItem("token", data.access_token); 
                            localStorage.setItem("ownerName", data.owner_name); 
            
                            setStore({
                                auth: true,
                                ownerName: data.owner_name, 
                            });
            
                            console.log(data.access_token); 
                        }
                    })
                    .catch((error) => {
                        console.error("Login error:", error);
                        alert("There was an error during login.");
                    });
            },
            

//                         return response.json();
//                     })
//                     .then((data) => {
//                         if (data.msg) {
//                             // Si el servidor restituye un mensaje de error (ejemplo "wrong email o password")
//                             alert(data.msg); // Muestra el mensaje del servidor del back
//                         } else {
//                             localStorage.setItem("token", data.access_token);    //guarda el token en el local storage
//                             localStorage.setItem("ownerName", data.owner_name);  //guarda el nombre del owner en el local Storage

//                             setStore({
//                                 auth: true,
//                                 ownerName: data.owner_name, // Asigna el valor del nombre a la variable del Store 
//                             });

//                             console.log(data.access_token);
//                         }
//                     });
//             },


            ownerLogout: () => {
                console.log("logout desde actions");
                setStore({ auth: false });
                localStorage.removeItem("token");
            },


            getAllRestaurants: () => {
                fetch(process.env.BACKEND_URL + "/api/restaurants")
                    .then((response) => response.json())
                    .then((data) => {
                        console.log("Datos recibidos:", data);
                        setStore({ restaurants: data });
                    });
            },

            createRestaurant: (newRestaurant, token) => {
                return new Promise((resolve, reject) => { 
                  const requestOptions = {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                      "Authorization": `Bearer ${token}`, 
                    },
                    body: JSON.stringify(newRestaurant),
                  };
              
                  fetch(process.env.BACKEND_URL + "/api/create_restaurant", requestOptions)
                    .then((response) => {
                      if (!response.ok) {
                        reject('Error en la creación del restaurante');
                      }
                      return response.json();
                    })
                    .then((data) => {
                      const store = getStore();
                      setStore({ restaurants: [...store.restaurants, data] });
                      setStore({ auth: true });
                      localStorage.setItem("token", data.access_token);
                      localStorage.setItem("ownerId", data.owner_id);
                      localStorage.setItem("ownerName", data.owner_name);
                      getActions().getAllRestaurants();
                      resolve(); 
                    })
                    .catch((error) => {
                      console.error("Error al crear restaurante:", error);
                      reject(error);
                    });
                });
              },
              
              



            getMessage: async () => {
                try {
                    const resp = await fetch(process.env.BACKEND_URL + "/api/hello");
                    const data = await resp.json();
                    setStore({ message: data.message });
                    return data;
                } catch (error) {
                    console.log("Error loading message from backend", error);
                }
            },

            getOriginList: () => {
                const requestOptions = {
                    method: "GET",
                    headers: { "content-type": "application/json" },
                };

                fetch(process.env.BACKEND_URL + "/api/origins", requestOptions)
                    .then((response) => response.json())
                    .then((result) => {
                        setStore({ origins: result });
                    });
            },

            originDelete: (id) => {
                const requestOptions = {
                    method: "DELETE",
                    headers: { "Content-Type": "application/json" },
                };

                fetch(process.env.BACKEND_URL + "/api/origin/" + id, requestOptions)
                    .then((response) => response.json())
                    .then(() => {
                        const updatedOrigins = getStore().origins.filter((origin) => origin.id !== id);
                        setStore({ origins: updatedOrigins });
                    });
            },

            createOrigin: (name) => {
                const requestOptions = {
                    method: "POST",
                    headers: { "content-type": "application/json" },
                    body: JSON.stringify({ name }),
                };

                fetch(process.env.BACKEND_URL + "/api/origin", requestOptions)
                    .then((response) => {
                        if (!response.ok) {
                            throw new Error("Failed to create new origin.");
                        }
                        return response.json();
                    })
                    .then((result) => {
                        const store = getStore();
                        setStore({ origins: [...store.origins, result] });
                        getActions().getOriginList();
                    });
            },
            editOrigin: (name, id) => {
                fetch(process.env.BACKEND_URL + "/api/origin/" + id, {
                    method: "PUT",
                    body: JSON.stringify({ name }),
                    headers: { "Content-Type": "application/json" },
                })
                    .then((response) => response.json())
                    .then((data) => {
                        const updatedOrigin = getStore().origins.map((origin) =>
                            origin.id === updatedOrigin.id ? updatedOrigin : origin
                        );
                        setStore({ origins: data });
                    });
            },



            getAllCategories: () => {
                fetch(process.env.BACKEND_URL + "/api/categories")
                    .then((response) => response.json())
                    .then((data) => {
                        console.log("Datos recibidos:", data);
                        setStore({ categories: data });
                    });
            },

            getSpecificCategory: (categoryId) => {
                fetch(process.env.BACKEND_URL + "/api/categories/" + categoryId)
                    .then((response) => response.json())
                    .then((data) => {
                        console.log("Datos recibidos:", data);
                        setStore({ specificCategory: data });
                    });
            },

            addCategory: (newCategory) => {
                const requestOptions = {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(newCategory),
                };

                fetch(process.env.BACKEND_URL + "/api/categories", requestOptions)
                    .then((response) => response.json())
                    .then((data) => {
                        const store = getStore();
                        setStore({ categories: [...store.categories, data] });

                        getActions().getAllCategories();
                    });
            },

            deleteCategory: (categoryId) => {
                const requestOptions = {
                    method: "DELETE",
                    headers: { "Content-Type": "application/json" },
                };

                fetch(process.env.BACKEND_URL + "/api/categories/" + categoryId, requestOptions)
                    .then((response) => response.json())
                    .then(() => {
                        const store = getStore();
                        setStore({ categories: store.categories.filter((category) => category.id !== categoryId) });

                        getActions().getAllCategories();
                    });
            },

            modifyCategory: (categoryId, updatedCategory) => {
                console.log("modifica da actions");
                
                const requestOptions = {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(updatedCategory),
                };

                fetch(process.env.BACKEND_URL + "/api/categories/" + categoryId, requestOptions)
                    .then((response) => response.json())
                    .then((data) => {
                        const store = getStore();
                        const updatedCategories = store.categories.map((category) =>
                            category.id === categoryId ? data : category
                        );
                        setStore({ categories: updatedCategories });

                        getActions().getAllCategories();
                    });
            },


            changeColor: (index, color) => {
                const store = getStore();
                const demo = store.demo.map((elm, i) => {
                    if (i === index) elm.background = color;
                    return elm;
                });
                setStore({ demo });

            },

//         },
    };

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
      getAvailableRestaurants: async (location, people) => {
        console.log("Respuesta completa del servidor desde /api/restaurants/available:, {location, people}");
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
          console.log("Restaurantes disponibles respuesta del backend:", data);
          setStore({ availableRestaurants: data.available_restaurants });
        } catch (error) {
          console.error("Error en getAvailableRestaurants:", error.message);
        }
      },
      // Obtener todos los propietarios
      getAllOwners: async () => {
        try {
            console.log("Fetching owners from the backend...");
            const response = await fetch("https://potential-telegram-9gw96rvrqwjfpvx6-3001.app.github.dev/api/owners/");
            if (!response.ok) {
                throw new Error(`Failed to fetch owners: ${response.status}`);
            }
            const data = await response.json();
            setStore({ ...getStore(), owners: data.owners }); // Asegúrate de que no sobreescribe todo el store
            console.log("Owners fetched successfully:", data.owners);
        } catch (error) {
            console.error("Error in getAllOwners:", error);
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

      addRestaurant: async (restaurant) => {
        try {
          const response = await fetch(`${process.env.BACKEND_URL}/api/restaurants`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(restaurant),
          });
      
          if (!response.ok) {
            throw new Error(`Error al añadir restaurante: ${response.status}`);
          }
          const data = await response.json();
          console.log(data.message);
        } catch (error) {
          console.error(error.message);
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
