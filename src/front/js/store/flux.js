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
            dinerauth: false,
            dinerReservations: [],
            owners: [],
            specificOwner: null,
            origins: [],
            categories: [],
            specificCategory: null,
            restaurantCategories: [],
            specificRestaurantCategory: [],
            restaurants: [],
            specificRestaurant: [],
            ownerReservations: [],
            restaurantReservations: [],
            availableRestaurants: [],
            ownerRestaurants: []
            
        },
        actions: {
            exampleFunction: () => {
                getActions().changeColor(0, "green");
            },
         
            createReservation: (reservationData) => {
                const { restaurant_id, date, hour, people, name, email, phone } = reservationData;

                if (!restaurant_id || !date || !hour || !people || !name || !email || !phone) {
                    console.log("restaurant_id ", restaurant_id)
                    console.log("date", date)
                    console.log("hour ", hour)
                    console.log("people ", people)
                    console.log("name", name)
                    console.log("email", email)
                    console.log("phone", phone)
                    console.log("Por favor, completa todos los campos.");
                    // return;
                }
                const formattedDate = new Date(date).toISOString().split('T')[0];
                const formattedHour = hour;

                const token = localStorage.getItem("tokenDiner");

                const requestOptions = {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        id_fk_restaurant: restaurant_id,
                        date: formattedDate,
                        hour: formattedHour,
                        people: people,
                    }),
                };
                console.log(requestOptions)
                fetch(`${process.env.BACKEND_URL}/api/create_reservation`, requestOptions)
                    .then((response) => {
                        console.log(response)
                        if (!response.ok) {
                            return response.json().then((data) => {
                                throw new Error(data.error || 'Error en la solicitud');
                            });
                        }
                        return response.json();
                    })
                    .then((data) => {
                        console.log(data)
                        if (data.error) {
                            console.error("Error al crear la reserva:", data.error);
                        } else {
                            console.log("Reserva creada exitosamente:", data);

                            const newReservation = data;

                            if (!newReservation || !newReservation.id) {
                                console.log("No se pudo obtener la reserva creada.");
                                return;
                            }

                            if (getStore().dinerauth) {
                                const dinerId = getStore().diners[0]?.id;

                                if (newReservation.id_fk_diner === dinerId) {
                                    const updatedReservations = [...getStore().dinerReservations, newReservation];

                                    setStore({ dinerReservations: updatedReservations });

                                    console.log("Reserva creada exitosamente.");
                                } else {
                                    console.log("El comensal no coincide con el que realizó la reserva.");
                                }
                            } else {
                                console.log("No hay un comensal logueado.");
                            }
                        }
                    })
                    .catch((error) => {
                        console.error("Error de red:", error);
                        console.log("Error de red al intentar crear la reserva.");
                    });
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

            getDinerReserves: () => {
                const token = localStorage.getItem('tokenDiner');
                const dinerId = localStorage.getItem('diner.id');

                const requestOptions = {
                    method: "GET",
                    headers: {
                        "content-type": "application/json",
                        'Authorization': `Bearer ${token}`
                    },
                };

                fetch(process.env.BACKEND_URL + "/api/reservation_by_diner", requestOptions)
                    .then((response) => response.json())
                    .then((result) => {
                        setStore({ dinerReservations: result });
                    });
            },

            DinerDeleteReservation: (reservation_id) => {
                const token = localStorage.getItem("tokenDiner");
                const requestOptions = {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                };
                fetch(`${process.env.BACKEND_URL}/api/delete_reservation_by_diner/${reservation_id}`, requestOptions)
                    .then((response) => response.json())
                    .then(() => {
                        const updatedReservations = getStore().dinerReservations.filter(
                            (reservation) => reservation.id !== reservation_id
                        );
                        setStore({ dinerReservations: updatedReservations });
                    })
                    .catch((error) => {
                        console.error('Error al eliminar la reserva:', error);
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
                console.log("funcion add")
                const requestOptions = {
                    method: "POST",
                    headers: { "content-type": "application/json" },
                    body: JSON.stringify({ fullname, email, telephone, password }),
                };

                fetch(process.env.BACKEND_URL + "/api/diner", requestOptions)
                    .then((response) => {response.json()
                        console.log(response)})
                    
                    .then((data) => {
                        console.log(data)
                        const store = getStore();
                        setStore({ diners: [...store.diners, data] });

                        getActions().getDinerList();
                    });
            },

            dinerLogin: (email, password) => {
                return new Promise((resolve, reject) => {
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

                    fetch(backendUrl, requestOption)
                        .then((response) => {
                            if (response.status === 200) {
                                return response.json();
                            } else {
                                reject("Error de autenticación");
                                return null;
                            }
                        })
                        .then((data) => {
                            if (data) {
                                if (data.msg) {
                                    alert(data.msg);
                                    reject(data.msg);
                                } else {
                                    localStorage.setItem("dinerFullName", data.diner_fullname);
                                    localStorage.setItem("dinerId", data.diner_id);
                                    setStore({ dinerauth: true, dinerFullName: data.diner_fullname });
                                    localStorage.setItem("tokenDiner", data.access_token);

                                    resolve(data);
                                }
                            }
                        })
                        .catch((error) => {
                            console.error("Error en el login:", error);
                            reject("Error de red o servidor");
                        });
                });
            },

            dinerLogout: () => {
                setStore({ dinerauth: false });
                localStorage.removeItem("tokenDiner");
            },

            getAllOwners: () => {
                fetch(process.env.BACKEND_URL + "/api/owners")
                    .then((response) => response.json())
                    .then((data) => {
                        console.log("Datos recibidos:", data);
                        setStore({ owners: data });
                    });
            },


            getSpecificOwner: () => {
                // Recupera il token e l'ownerId dal localStorage
                const token = localStorage.getItem('token');
                const ownerId = localStorage.getItem('ownerId');

                // Verifica se i dati sono disponibili
                if (!token || !ownerId) {
                    console.error("Token o Owner ID non trovato nel localStorage");
                    return;
                }

                console.log("Token:", token);
                console.log("Owner ID:", ownerId);

                // Effettua la richiesta al back-end
                fetch(process.env.BACKEND_URL + "/api/owners/" + ownerId, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    }
                })
                    .then((response) => {
                        if (!response.ok) {
                            throw new Error(`HTTP error! Status: ${response.status}`);
                        }
                        return response.json();
                    })
                    .then((data) => {
                        console.log("Datos recibidos from FRONT specific ownerr:", data);

                        // Salva l'owner nel store (o nella variabile di stato) del front-end
                        setStore({ specificOwner: data });
                    })
                    .catch((error) => {
                        console.error('Error fetching specific owner:', error);
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
                    .then((data) => {
                        if (data.message) {
                            alert(`Error: ${data.message}`);
                        } else {
                            alert("Owner successfully deleted");
                            const store = getStore();
                            setStore({ owners: store.owners.filter((owner) => owner.id !== ownerId) });

                            getActions().getAllOwners();
                        }
                    }) // <--- Chiusura del secondo .then()
                    .catch((error) => {
                        console.error("Error:", error);
                        alert("An unexpected error occurred");
                    }); // <--- Chiusura del .catch()
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
                console.log("Login from actions");
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

                fetch(backendUrl, requestOption)
                    .then((response) => {
                        console.log("Response status:", response.status);
                        return response.json();
                    })
                    .then((data) => {
                        console.log("Dati login ricevuti dal back:", data);
                        if (data.msg) {
                            // Se il server restituisce un messaggio di errore
                            alert(data.msg);
                            setStore({ auth: false });
                        } else {
                            // Salva il token, il nome e l'ID dell'owner nel localStorage
                            localStorage.setItem("token", data.access_token);
                            localStorage.setItem("ownerName", data.owner_name);
                            localStorage.setItem("ownerId", data.owner_id); // Salva ID del owner

                            // Aggiorna lo store globale con i dati dell'owner
                            setStore({
                                auth: true,
                                ownerName: data.owner_name,
                                ownerId: data.owner_id,
                            });

                            console.log("Token:", data.access_token);
                            console.log("Owner ID:", data.owner_id);
                        }
                    })
                    .catch((error) => {
                        console.error("Error en el login:", error);
                        setStore({ auth: false });
                    });
            },


            ownerLogout: () => {
                console.log("logout desde actions");
                setStore({ auth: false });
                localStorage.removeItem("token");
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

            getAllRestaurantCategories: () => {
                fetch(process.env.BACKEND_URL + "/api/restaurant_categories")
                    .then((response) => response.json())
                    .then((data) => {
                        console.log("Dati ricevuti:", data);
                        setStore({ restaurantCategories: data });
                        getActions().getAllCategories();
                        getActions().getAllRestaurants();
                    });
            },

            getSpecificRestaurantCategory: (restaurantCategoryId) => {
                fetch(process.env.BACKEND_URL + "/api/restaurant_categories/" + restaurantCategoryId)
                    .then((response) => response.json())
                    .then((data) => {
                        console.log("Dati ricevuti:", data);
                        setStore({ specificRestaurantCategory: data });
                    });
            },

            addRestaurantCategory: (newRestaurantCategory) => {
                const requestOptions = {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(newRestaurantCategory),
                };

                fetch(process.env.BACKEND_URL + "/api/restaurant_categories", requestOptions)
                    .then((response) => response.json())
                    .then((data) => {

                        const store = getStore();
                        setStore({ restaurantCategories: [...store.restaurantCategories, data] });

                        getActions().getAllRestaurantCategories();
                    });
            },

            deleteRestaurantCategory: (restaurantCategoryId) => {
                const requestOptions = {
                    method: "DELETE",
                    headers: { "Content-Type": "application/json" },
                };

                fetch(process.env.BACKEND_URL + "/api/restaurant_categories/" + restaurantCategoryId, requestOptions)
                    .then((response) => response.json())
                    .then(() => {
                        const store = getStore();
                        setStore({
                            restaurantCategories: store.restaurantCategories.filter(
                                (rc) => rc.id !== restaurantCategoryId
                            )
                        });

                        getActions().getAllRestaurantCategories();
                    });
            },

            modifyRestaurantCategory: (restaurantCategoryId, updatedRestaurantCategory) => {
                console.log("Modifica da actions");

                const requestOptions = {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(updatedRestaurantCategory),
                };

                fetch(process.env.BACKEND_URL + "/api/restaurant_categories/" + restaurantCategoryId, requestOptions)
                    .then((response) => response.json())
                    .then((data) => {
                        const store = getStore();
                        const updatedRestaurantCategories = store.restaurantCategories.map((rc) =>
                            rc.id === restaurantCategoryId ? data : rc
                        );
                        setStore({ restaurantCategories: updatedRestaurantCategories });

                        getActions().getAllRestaurantCategories();
                    });
            },

            getAllRestaurants: () => {
                fetch(process.env.BACKEND_URL + "/api/restaurants")
                    .then((response) => response.json())
                    .then((data) => {
                        console.log("Restaurantes recibidos:", data);
                        setStore({ restaurants: data });
                    });
            },

            getRestaurantById: (restaurantId) => {
                fetch(process.env.BACKEND_URL + "/api/restaurants/" + restaurantId)
                    .then((response) => response.json())
                    .then((data) => {
                        console.log("Datos del restaurante recibidos:", data);
            
                        //  Verifica si store ys tiene los datos
                        const currentData = getStore().specificRestaurant;
                        if (JSON.stringify(currentData) === JSON.stringify(data)) {
                            console.log(" Nessun aggiornamento necessario, i dati sono identici.");
                            return;
                        }
            
                        setStore({ specificRestaurant: data });  // Solo si cambian
            
                        console.log("Estado actualizado:", getStore().specificRestaurant);
                    })
                    .catch((error) => {
                        console.error("Error al obtener el restaurante por ID:", error);
                    });
            },
            

            getRestaurantsForLoggedInOwner: () => {
                const token = localStorage.getItem("token");

                if (!token) {
                    console.error("No hay token disponible");
                    return;
                }

                console.log("Token presente:", token);

                fetch(process.env.BACKEND_URL + "/api/owners/restaurants", {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                })
                    .then(response => {
                        if (!response.ok) {
                            throw new Error("Error al obtener restaurantes");
                        }
                        return response.json();
                    })
                    .then(data => {
                        console.log("Datos recibidos:", data);
                        setStore({ restaurants: data });  // Guardar los rest en store
                    })
                    .catch(error => console.error("Error obteniendo restaurantes por logged in owner:", error));
            },


            // createRestaurant: (newRestaurant, token) => {
            //     return new Promise((resolve, reject) => {
            //         const requestOptions = {
            //             method: "POST",
            //             headers: {
            //                 "Content-Type": "application/json",
            //                 "Authorization": `Bearer ${token}`,
            //             },
            //             body: JSON.stringify(newRestaurant),
            //         };

            //         fetch(process.env.BACKEND_URL + "/api/create_restaurant", requestOptions)
            //             .then((response) => {
            //                 if (!response.ok) {
            //                     reject('Error en la creación del restaurante');
            //                 }
            //                 return response.json();
            //             })
            //             .then((data) => {
            //                 console.log("Dati complet dalla risposta del back:", data);
            //                 console.log("Token ricevuto nella risposta:", data.access_token);
            //                 const store = getStore();
            //                 setStore({ restaurants: [...store.restaurants, data] });
            //                 setStore({ auth: true });
            //                 localStorage.setItem("token", data.access_token);
            //                 localStorage.setItem("ownerId", data.owner_id);
            //                 localStorage.setItem("ownerName", data.owner_name);
            //                 console.log("Token aggiornato nel localStorage:", localStorage.getItem("token")); // Verifica se il token viene aggiornato

                            
            //                 getActions().getRestaurantsForLoggedInOwner();
            //                 resolve();
            //             })
            //             .catch((error) => {
            //                 console.error("Error al crear restaurante:", error);
            //                 reject(error);
            //             });
            //     });
            // },

            createRestaurant: (newRestaurant, token) => {
                return new Promise((resolve, reject) => {
                  const requestOptions = {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                      "Authorization": `Bearer ${token}`, // Asegura que el token se pase en la cabecera
                    },
                    body: JSON.stringify(newRestaurant),
                  };
              
                  // Realiza la petición para crear el restaurante
                  fetch(process.env.BACKEND_URL + "/api/create_restaurant", requestOptions)
                    .then((response) => {
                      if (!response.ok) {
                        reject('Error en la creación del restaurante');
                      }
                      return response.json();
                    })
                    .then((data) => {
                      // Almacena el nuevo restaurante en el store
                      const store = getStore();
                      setStore({ restaurants: [...store.restaurants, data] });
              
                      // Actualiza el token en el localStorage (si se obtiene un nuevo token)
                      if (data.access_token) {
                        localStorage.setItem("token", data.access_token);
                        localStorage.setItem("ownerId", data.owner_id);
                        localStorage.setItem("ownerName", data.owner_name);
                      }
              
                      // Verifica si el token se actualizó correctamente
                      console.log("Token actualizado en localStorage:", localStorage.getItem("token"));
              
                      // Llama a la acción para obtener los restaurantes del dueño
                      getActions().getRestaurantsForLoggedInOwner();
                      resolve();
                    })
                    .catch((error) => {
                      console.error("Error al crear restaurante:", error);
                      reject(error);
                    });
                });
              },
              


            // modifyRestaurant: (restaurantId, updatedRestaurant) => {
            //     const store = getStore();
            //     const token = localStorage.getItem("token");

            //     if (!token) {
            //         alert("You must be logged in to modify a restaurant.");
            //         return;
            //     }

            //     const requestOptions = {
            //         method: "PUT",
            //         headers: {
            //             "Content-Type": "application/json",
            //             "Authorization": `Bearer ${token}`,
            //         },
            //         body: JSON.stringify(updatedRestaurant),
            //     };

            //     fetch(process.env.BACKEND_URL + "/api/restaurants/" + restaurantId, requestOptions)
            //         .then((response) => {
            //             if (!response.ok) {
            //                 throw new Error("Error updating restaurant");
            //             }
            //             return response.json();
            //         })
            //         .then((data) => {
            //             // Aggiorna i ristoranti nel store
            //             const updatedRestaurants = store.restaurants.map((restaurant) =>
            //                 restaurant.id === restaurantId ? data : restaurant
            //             );
            //             setStore({ restaurants: updatedRestaurants });

            //             // Aggiorna la lista dei ristoranti
            //             getActions().getRestaurantsForLoggedInOwner();
            //         })
            //         .catch((error) => {
            //             console.error("Error updating restaurant:", error);
            //         });
            // },


            modifyRestaurant: (restaurantId, updatedRestaurant, token) => {
                const requestOptions = {
                  method: "PUT",
                  headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                  },
                  body: JSON.stringify(updatedRestaurant),
                };
              
                return fetch(`${process.env.BACKEND_URL}/api/restaurants/${restaurantId}`, requestOptions)
                  .then(response => response.json())
                  .then(data => {
                    if (data.error) {
                      throw new Error(data.error);
                    }
                    // Modifica il ristorante nella lista del contesto
                    const updatedRestaurants = getStore().restaurants.map(restaurant =>
                      restaurant.id === restaurantId ? data : restaurant
                    );
                    setStore({ restaurants: updatedRestaurants });
                  })
                  .catch(err => {
                    console.error("Error al modificar el restaurante:", err);
                    throw err;
                  });
              },
              

            deleteRestaurant: (restaurantId) => {
                const store = getStore();
                const token = localStorage.getItem("token");

                if (!token) {
                    alert("You must be logged in to delete a restaurant.");
                    return;
                }

                const requestOptions = {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`, // usa el token guardado en localStorage
                    },
                };

                fetch(process.env.BACKEND_URL + "/api/restaurants/" + restaurantId, requestOptions)
                    .then((response) => response.json())
                    .then(() => {
                        const updatedRestaurants = store.restaurants.filter(
                            (restaurant) => restaurant.id !== restaurantId
                        );
                        setStore({ restaurants: updatedRestaurants });
                        getActions().getRestaurantsForLoggedInOwner();
                    })
                    .catch((error) => {
                        console.error("Error deleting restaurant:", error);
                    });
            },


            getAllReservationsByOwner: () => {
                const store = getStore();
                const token = localStorage.getItem("token");

                fetch(`${process.env.BACKEND_URL}/api/reservation_by_owner`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                    .then(response => {
                        if (!response.ok) {
                            throw new Error("Error fetching reservations");
                        }
                        return response.json();
                    })
                    .then(data => {
                        setStore({ ownerReservations: data });
                    })
                    .catch(err => {
                        console.error("Error fetching reservations:", err);
                    });
            },



            // // Crear una nueva reserva
            // // Obtener reservas de un restaurante
            // getRestaurantReservations: async (restaurant_id) => {
            //     console.log(
            //         `Ejecutando getRestaurantReservations para restaurant_id: ${restaurant_id}`
            //     );
            //     try {
            //         const response = await fetch(
            //             `${process.env.BACKEND_URL}/api/restaurants/${restaurant_id}/reservations`
            //         );
            //         if (!response.ok) {
            //             const errorText = await response.text();
            //             throw new Error(`Error HTTP: ${response.status} - ${errorText}`);

            deleteReservation: function (reservationId) {
                fetch(process.env.BACKEND_URL + "/api/reservations/" + reservationId, {
                    method: "DELETE",
                    headers: {
                        "Authorization": "Bearer " + localStorage.getItem("token")
                    }
                })
                    .then(response => {
                        if (response.ok) {
                            // Filtra e aggiorna le prenotazioni nello store
                            const newReservations = getStore().ownerReservations.filter(res => res.id !== reservationId);
                            setStore({ ownerReservations: newReservations });
                        } else {
                            console.error("Error al eliminar la reserva");
                        }
                    })
                    .catch(error => console.error("Error:", error));
            },

            viewReservation: function (reservationId) {
                console.log("Ver detalles de reserva:", reservationId);
            },


            getReservationsByRestaurant: (restaurantId) => {
                console.log("*****getReservationsByRestaurant");
                
                const token = localStorage.getItem('token');

                fetch(process.env.BACKEND_URL + "/api/restaurant/reservations/" + restaurantId, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`

                    }
                })
                .then((response) => {
                    console.log("Risposta dal server:", response);
                    if (!response.ok) {
                        throw new Error(`Errore HTTP: ${response.status}`);
                    }
                    return response.json();
                })
                .then((data) => {
                    console.log("********* dati ricevuti per il rist dal back:", data); 
                    setStore({ restaurantReservations: data });
                })
                .catch((error) => {
                    setStore({ error: error.message });
                });
            },
            
            

            //             getRestaurantById: (restaurantId) => {
            //     fetch(process.env.BACKEND_URL + "/api/restaurants/" + restaurantId)
            //         .then((response) => response.json())
            //         .then((data) => {
            //             console.log("Datos del restaurante:", data);
            //             setStore({ specificRestaurant: data });  // Aggiorna lo store con i dati del ristorante

            //             // Ottieni lo stato aggiornato dopo la chiamata setStore
            //             const updatedStore = getStore();  // Usa getStore per ottenere lo stato corrente
            //             console.log("Stato aggiornato:", updatedStore.specificRestaurant);
            //         })
            //         .catch((error) => {
            //             console.error("Error al obtener el restaurante:", error);
            //         });
            // },
            
            // updateLocalReservationState: (reservationId, newState) => {
            //     const updatedReservations = getStore().restaurantReservations.map(res =>
            //         res.id === reservationId ? { ...res, state: newState } : res
            //     );
            //     setStore({ restaurantReservations: updatedReservations });
            // },

            updateReservationStatus: (reservationId, newStatus) => {
                return fetch(`${process.env.BACKEND_URL}/api/reservations/${reservationId}/status`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    },
                    body: JSON.stringify({ status: newStatus })
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error("Error al actualizar el estado de la reserva");
                    }
                    return response.json();
                })
                .then(data => {
                    console.log('Estado actualizado:', data);
                    // Aggiorna lo stato nel frontend
                    setStore({
                        restaurantReservations: getStore().restaurantReservations.map(res =>
                            res.id === reservationId ? { ...res, state: newStatus } : res
                        )
                    });
                })
                .catch(error => console.error('Error al actualizar el estado:', error));
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


            changeColor: (index, color) => {
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
