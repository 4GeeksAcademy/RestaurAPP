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
				},
			],
			diners: [],
			auth: true
		},
		actions: {
			// Use getActions to call a function within a fuction
			exampleFunction: () => {
				getActions().changeColor(0, "green");
			},
			getDinerList: () => {

				const requestOptions = {
					method: "GET",
					headers: { 'content-type': 'application/json' },

				};

				fetch(process.env.BACKEND_URL + '/api/diners', requestOptions)
					.then((response) => response.json())
					.then((result) => {
						setStore({ diners: result });
					})
			},

			handleDelete: (id) => {
				const requestOptions = {
					method: "DELETE",
					headers: {
						'Content-Type': 'application/json',
					},
				};

				fetch(process.env.BACKEND_URL + '/api/diner/' + id, requestOptions)
					.then((response) => response.json())
					.then((deletedDiner) => {
						const updatedDiners = getStore().diners.filter(diner => diner.id !== id);
						setStore({ diners: updatedDiners });
					})
			},


			handleEdit: (id, fullname, email, telephone, password) => {
				fetch(process.env.BACKEND_URL + '/api/diner/' + id, {
					method: 'PUT',
					body: JSON.stringify({ id, fullname, email, telephone, password }),
					headers: {
						'Content-Type': 'application/json',
					},
				})
					.then((response) => response.json())
					.then((updatedDiner) => {
						const updatedDiners = getStore().diners.map(diner =>
							diner.id === updatedDiner.id ? updatedDiner : diner
						);
						setStore({ diners: updatedDiners });
					})
			},


			DinerForm: (fullname, email, telephone, password) => {
				const requestOptions = {
					method: "POST",
					headers: { 'content-type': 'application/json' },
					body: JSON.stringify({
						"fullname": fullname,
						"email": email,
						"telephone": telephone,
						"password": password

					})
				};

				fetch(process.env.BACKEND_URL + '/api/diner', requestOptions)
					.then((response) => {
						if (!response.ok) {
							throw new Error("Error al crear el usuario. Verifica los datos o intenta más tarde.");
						}
						return response.json();
					})
					.then((result) => {
						setStore({ auth: true });
						localStorage.setItem('token', result.access_token);
					})
			},

			getMessage: async () => {
				try {
					// fetching data from the backend
					const resp = await fetch(process.env.BACKEND_URL + "/api/hello")
					const data = await resp.json()
					setStore({ message: data.message })
					// don't forget to return something, that is how the async resolves
					return data;
				} catch (error) {
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
