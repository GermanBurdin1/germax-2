import { ApiAuth } from "./api-auth";

export class ApiRental {
	_apiAuth = ApiAuth.getInstance();
	_baseUrl = "http://germax-api/rental";

	constructor() {}

	async createRequestRental(good, { quantity, dateStart, dateEnd, comments }) {
		const body = JSON.stringify({
			formInfo: {
				quantity,
				dateStart,
				dateEnd,
				comments,
			},
			idGood: good.id,
		});

		return fetch(`${this._baseUrl}/create`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				token: this._apiAuth.getToken(),
			},
			body,
		})
			.then((response) => {
				if (!response.ok) {
					return response.json().then((json) => Promise.reject(json));
				}
				return response.json();
			})
			.then((data) => {
				return data;
			})
			.catch((error) => {
				console.error("Error in createRequestRental:", error);
				throw error;
			});
	}

	async createNewItemRental(
		good,
		{ dateStart, dateEnd, accord, id_user, loanStatus }
	) {
		const body = JSON.stringify({
			formInfo: {
				dateStart,
				dateEnd,
				accord,
				id_user,
				loanStatus,
			},
			idGood: good.id,
		});
		console.log("createNewItemRental вызывается с телом,", body);

		return fetch(`${this._baseUrl}/new-item-rental`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				token: this._apiAuth.getToken(),
			},
			body,
		})
			.then((response) => {
				if (!response.ok) {
					return response.json().then((json) => Promise.reject(json));
				}
				return response.json();
			})
			.then((data) => {
				return data;
			})
			.catch((error) => {
				console.error("Error in createRequestRental:", error);
				throw error;
			});
	}

	async getClientRentals() {
		return fetch(`${this._baseUrl}/get-client-rentals`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				token: this._apiAuth.getToken(),
			},
		})
			.then((response) => {
				if (!response.ok) {
					return response.json().then((json) => Promise.reject(json));
				}
				return response.json();
			})
			.then((data) => {
				return data.data;
			})
			.catch((error) => {
				console.error("Error in getClientRentals:", error);
				throw error;
			});
	}

	async getRentals() {
		console.log("функция getRentals вызывается ")
		return fetch(`${this._baseUrl}/`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				token: this._apiAuth.getToken(),
			},
		})
			.then((response) => {
				console.log("response", response)
				if (!response.ok) {
					return response.json().then((json) => Promise.reject(json));
				}
				return response.json();
			})
			.then((data) => {
				console.log("data",data)
				return data.data;
			})
			.catch((error) => {
				console.error("Error in getClientRentals:", error);
				throw error;
			});
	}

	async cancelRental(loanId) {
		const body = JSON.stringify({ loanId });

		return fetch(`${this._baseUrl}/cancel`, {
			method: "PATCH",
			headers: {
				"Content-Type": "application/json",
				token: this._apiAuth.getToken(),
			},
			body,
		})
			.then((response) => {
				if (!response.ok) {
					return response.json().then((json) => Promise.reject(json));
				}
				return response.json();
			})
			.then((data) => {
				return data;
			})
			.catch((error) => {
				console.error("Error in cancelLoan:", error);
				throw error;
			});
	}

	async approveRental(loanId) {
		const body = JSON.stringify({ loanId });
		console.log("body",body)

		return fetch(`${this._baseUrl}/approve`, {
			method: "PATCH",
			headers: {
				"Content-Type": "application/json",
				token: this._apiAuth.getToken(),
			},
			body,
		})
			.then((response) => {
				console.log("response", response)
				if (!response.ok) {
					return response.json().then((json) => Promise.reject(json));
				}
				return response.json();
			})
			.then((data) => {
				console.log("data", data)
				return data;
			})
			.catch((error) => {
				console.error("Error in cancelLoan:", error);
				throw error;
			});
	}
}
