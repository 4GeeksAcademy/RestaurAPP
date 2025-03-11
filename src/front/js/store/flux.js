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
                console.log("Backend URL:", backendUrl); // Stampa l'URL in console
        
                const requestOption = {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    email: email,
                    password: password,
                  }),
                };
                fetch(process.env.BACKEND_URL + "/api/owners/login", requestOption)
                  .then((response) => {
                    console.log(response.status);
                    if (response.status == 200) {
                      setStore({ auth: true });
                    } else {
                      setStore({ auth: false });
                    }
                    return response.json();
                  })
                  .then((data) => {
                    if (data.msg) {
                      // Si el servidor restituye un mensaje de error (ejemplo "wrong email o password")
                      alert(data.msg); // Muestra el mensaje del servidor del back
                    } else {
                      localStorage.setItem("token", data.access_token);    //guarda el token en el local storage
                      localStorage.setItem("ownerName", data.owner_name);  //guarda el nombre del owner en el local Storage
        
                      setStore({ 
                        auth: true,
                        ownerName: data.owner_name, // Asigna el valor del nombre a la variable del Store 
                      });
        
                      console.log(data.access_token);
                    }
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
