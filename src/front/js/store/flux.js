

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
      user: null,
    },
    actions: {
      // Ejemplo de función (sin cambios)
      exampleFunction: () => {
        getActions().changeColor(0, "green");
      },

      getDinerList: async () => {
        const requestOptions = {
          method: "GET",
          headers: { "content-type": "application/json" },
        };

        try {
          const response = await fetch(
            process.env.BACKEND_URL + "/api/diners/",
            requestOptions
          );
          if (!response.ok)
            throw new Error("Error al obtener la lista de comensales.");
          const result = await response.json();
          setStore({ diners: result });
        } catch (error) {
          console.error(error.message);
        }
      },

      handleDelete: async (id) => {
        const requestOptions = {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        };

        try {
          const response = await fetch(
            process.env.BACKEND_URL + "/api/diner/" + id,
            requestOptions
          );
          if (!response.ok) throw new Error("Error al eliminar el comensal.");
          const updatedDiners = getStore().diners.filter(
            (diner) => diner.id !== id
          );
          setStore({ diners: updatedDiners });
        } catch (error) {
          console.error(error.message);
        }
      },

      handleEdit: async (id, fullname, email, telephone, password) => {
        try {
          const response = await fetch(
            process.env.BACKEND_URL + "/api/diner/" + id,
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
          if (!response.ok) throw new Error("Error al actualizar el comensal.");
          const updatedDiner = await response.json();
          const updatedDiners = getStore().diners.map((diner) =>
            diner.id === updatedDiner.id ? updatedDiner : diner
          );
          setStore({ diners: updatedDiners });
        } catch (error) {
          console.error(error.message);
        }
      },

      DinerForm: async (fullname, email, telephone, password) => {
        const requestOptions = {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ fullname, email, telephone, password }),
        };

        try {
          const response = await fetch(
            process.env.BACKEND_URL + "/api/diner",
            requestOptions
          );
          if (!response.ok) throw new Error("Error al crear el usuario.");
          const result = await response.json();
          setStore({ auth: true });
          localStorage.setItem("token", result.access_token);
        } catch (error) {
          console.error(error.message);
        }
      },

      // Obtener todos los propietarios
      getAllOwners: async () => {
        try {
          const response = await fetch(
            process.env.BACKEND_URL + "/api/owners/"
          );
          if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Error HTTP: ${response.status} - ${errorText}`);
          }
          const data = await response.json();
          console.log("Datos recibidos:", data);
          setStore({ owners: data });
        } catch (error) {
          console.error("Error al obtener propietarios:", error.message);
        }
      },

      // Obtener un propietario específico
      getSpecificOwner: async (ownerId) => {
        try {
          const response = await fetch(
            process.env.BACKEND_URL + "/api/owners/" + ownerId
          );
          if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Error HTTP: ${response.status} - ${errorText}`);
          }
          const data = await response.json();
          console.log("Datos recibidos:", data);
          setStore({ specificOwner: data });
        } catch (error) {
          console.error(
            "Error al obtener propietario específico:",
            error.message
          );
        }
      },

      // Agregar un propietario
      addOwner: async (newOwner) => {
        try {
          const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newOwner),
          };

          const response = await fetch(
            process.env.BACKEND_URL + "/api/owners",
            requestOptions
          );
          if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Error HTTP: ${response.status} - ${errorText}`);
          }

          const data = await response.json();
          setStore({ owners: [...getStore().owners, data] });
        } catch (error) {
          console.error("Error al agregar propietario:", error.message);
        }
      },

      // Eliminar un propietario
      deleteOwner: async (ownerId) => {
        try {
          const requestOptions = {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
          };

          const response = await fetch(
            process.env.BACKEND_URL + "/api/owners/" + ownerId,
            requestOptions
          );
          if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Error HTTP: ${response.status} - ${errorText}`);
          }

          setStore({
            owners: getStore().owners.filter((owner) => owner.id !== ownerId),
          });
        } catch (error) {
          console.error("Error al eliminar propietario:", error.message);
        }
      },

      // Modificar un propietario
      modifyOwner: async (ownerId, updatedOwner) => {
        try {
          const requestOptions = {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedOwner),
          };

          const response = await fetch(
            process.env.BACKEND_URL + "/api/owners/" + ownerId,
            requestOptions
          );
          if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Error HTTP: ${response.status} - ${errorText}`);
          }

          const data = await response.json();
          setStore({
            owners: getStore().owners.map((owner) =>
              owner.id === ownerId ? data : owner
            ),
          });
        } catch (error) {
          console.error("Error al modificar propietario:", error.message);
        }
      },

      getMessage: async () => {
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
          return data;
        } catch (error) {
          console.error(
            "Error al cargar el mensaje del backend:",
            error.message
          );
        }
      },
      getAllReservations: async () => {
        try {
          const response = await fetch(
            process.env.BACKEND_URL + "/api/reservations/"
          ); // URL de tu backend
          if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
          }
          const data = await response.json();
          console.log("Reservas obtenidas:", data); // Para depuración
          setStore({ reservations: data.reservations }); // Actualiza el estado global
        } catch (error) {
          console.error("Error al obtener reservas:", error.message);
        }
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


