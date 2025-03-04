const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			message: null,
			demo: [
				{
					title: "FIRST",
					background: "white",
					initial: "white"
				},
				{
					title: "SECOND",
					background: "white",
					initial: "white"
				}
			],
			owners: [],
			specificOwner : null
		},
		actions: {
			// Use getActions to call a function within a fuction
			exampleFunction: () => {
				getActions().changeColor(0, "green");
			},
			
			getAllOwners: () => {
				console.log("getallOwners from actions");
				fetch(process.env.BACKEND_URL +"/api/owners")
				.then((response) => response.json())
				.then((data) => {
					console.log("Datos recibidos:", data);
					setStore({"owners" : data})
				})
			},
			
			getSpecificOwner : (ownerId) => { 
				console.log("getOwners from flux")
				fetch(process.env.BACKEND_URL +"/api/owners/" + ownerId)
				.then((response) => response.json())
				.then((data) => {
					console.log("Dati ricevuti:", data);
					setStore({specificOwner : data})
				})	
			},

			addOwner: (newOwner) => {
				console.log("addOwner from actions");

				const requestOptions = {
					method : "POST",
					headers: {"Content-Type" : "application/json"},
					body: JSON.stringify(newOwner)
				}
				
				fetch(process.env.BACKEND_URL +"/api/owners", requestOptions)
				.then((response) => response.json())
				.then((data) => {	
					const store = getStore();
					setStore({owners: [...store.owners, data]})
				});
			},

			deleteOwner: (ownerId) => {
				const requestOptions = {
					method : "DELETE",
					headers: {"Content-Type" : "application/json"},
				} 
				fetch(process.env.BACKEND_URL +"/api/owners/" + ownerId, requestOptions)
				.then((response) => response.json())
				.then((data) => {
					console.log("Owner to delete:", data);
					const store = getStore();
					setStore({owners : store.owners.filter(owner => owner.id !== ownerId)})
				})	
			},

			modifyOwner: (ownerId, updatedOwner) => {
				const requestOptions = {
					method : "PUT",
					headers: {"Content-Type" : "application/json"},
					body: JSON.stringify(updatedOwner)                               // Usa i dati aggiornati
				};

				fetch(process.env.BACKEND_URL +"/api/owners/" + ownerId, requestOptions)
				.then((response) => response.json())            
				.then((data) => {
					console.log("Owner updated:", data);

					const store = getStore();
					// Aggiorna la lista sostituendo l'attore modificato:
					const updatedOwners = store.owners.map(owner => 
						owner.id === ownerId ? data : owner
					);
					setStore({ owners: updatedOwners });
				})	
			},


			getMessage: async () => {
				try{
					// fetching data from the backend
					const resp = await fetch(process.env.BACKEND_URL + "/api/hello")
					const data = await resp.json()
					setStore({ message: data.message })
					// don't forget to return something, that is how the async resolves
					return data;
				}catch(error){
					console.log("Error loading message from backend", error)
				}
			},
			changeColor: (index, color) => {
				//get the store
				const store = getStore();

				//we have to loop the entire demo array to look for the respective index
				//and change its color
				const demo = store.demo.map((elm, i) => {
					if (i === index) elm.background = color;
					return elm;
				});

				//reset the global store
				setStore({ demo: demo });
			}
		}
	};
};

export default getState;
