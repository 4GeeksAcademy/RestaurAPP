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
            owners: [],
            specificOwner: null,
            origins: [],
            categories: [],
            specificCategory: null,
            restaurantCategories: [],
            specificRestaurantCategory: [],
            restaurants: [],
            specificRestaurant: []
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
                        setStore({ dinerauth: true });
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
                            setStore({ dinerauth: true });
                        } else {
                            setStore({ dinerauth: false });
                        }
                        return response.json();
                    })
                    .then((data) => {
                        if (data.msg) {
                            alert(data.msg);
                        } else {
                            localStorage.setItem("dinerFullName", data.diner_fullname);
                            localStorage.setItem("dinerId", data.diner_id);
                            localStorage.setItem("token", data.access_token);
                            setStore({ dinerauth: true, dinerFullName: data.diner_fullname });
                        }
                    });
            },
            dinerLogout: () => {
                setStore({ dinerauth: false });
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
                        console.log("Datos del restaurante:", data);
                        setStore({ specificRestaurant: data });  // Aggiorna lo store con i dati del ristorante
            
                        // Ottieni lo stato aggiornato dopo la chiamata setStore
                        const updatedStore = getStore();  // Usa getStore per ottenere lo stato corrente
                        console.log("Stato aggiornato:", updatedStore.specificRestaurant);
                    })
                    .catch((error) => {
                        console.error("Error al obtener el restaurante:", error);
                    });
            },


            getRestaurantsForLoggedInOwner: () => {
                const token = localStorage.getItem("token");
            
                if (!token) {
                    console.error("No hay token disponible");
                    return;
                }
            
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
                .catch(error => console.error("Error obteniendo restaurantes:", error));
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
                      getActions().getRestaurantsForLoggedInOwner();
                      resolve(); 
                    })
                    .catch((error) => {
                      console.error("Error al crear restaurante:", error);
                      reject(error);
                    });
                });
              },

              modifyRestaurant: (restaurantId, updatedRestaurant) => {
                const store = getStore();
                const token = localStorage.getItem("token");
            
                if (!token) {
                    alert("You must be logged in to modify a restaurant.");
                    return;
                }
            
                const requestOptions = {
                    method: "PUT",
                    headers: { 
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                    body: JSON.stringify(updatedRestaurant),
                };
            
                fetch(process.env.BACKEND_URL + "/api/restaurants/" + restaurantId, requestOptions)
                    .then((response) => {
                        if (!response.ok) {
                            throw new Error("Error updating restaurant");
                        }
                        return response.json();
                    })
                    .then((data) => {
                        // Aggiorna i ristoranti nel store
                        const updatedRestaurants = store.restaurants.map((restaurant) =>
                            restaurant.id === restaurantId ? data : restaurant
                        );
                        setStore({ restaurants: updatedRestaurants });
            
                        // Aggiorna la lista dei ristoranti
                        getActions().getRestaurantsForLoggedInOwner();
                    })
                    .catch((error) => {
                        console.error("Error updating restaurant:", error);
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
            
            // deleteRestaurant: (restaurantId) => {
            //     const store = getStore();
            //     const actions = getActions();
            
            //     // Verifica se l'utente è autenticato e ha un token valido
            //     if (!store.auth) {
            //         alert("You must be logged in to delete a restaurant.");
            //         return;
            //     }
            
            //     const requestOptions = {
            //         method: "DELETE",
            //         headers: { 
            //             "Content-Type": "application/json",
            //             "Authorization": `Bearer ${store.token}`,
            //         },
            //     };
            
            //     fetch(`${process.env.BACKEND_URL}/api/restaurants/${restaurantId}`, requestOptions)
            //         .then((response) => {
            //             if (!response.ok) {
            //                 throw new Error(`Failed to delete. Status: ${response.status}`);
            //             }
            //             return response.json();
            //         })
            //         .then(() => {
            //             console.log(`Restaurant ${restaurantId} deleted successfully.`);
            //             const updatedRestaurants = store.restaurants.filter(
            //                 (restaurant) => restaurant.id !== restaurantId
            //             );
            //             setStore({ restaurants: updatedRestaurants });
            
            //             // Assicura di ricaricare i dati solo se necessario
            //             actions.getRestaurantsForLoggedInOwner();
            //         })
            //         .catch((error) => {
            //             console.error("Error deleting restaurant:", error);
            //             alert("Failed to delete the restaurant. Please try again.");
            //         });
            // },

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
