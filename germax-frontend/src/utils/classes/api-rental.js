import { ApiAuth } from "./api-auth";

export class ApiRental {
	_apiAuth = ApiAuth.getInstance();
	_baseUrl = "http://germax-api/rental/create";

	constructor() {}

	async createRequestRental(good, { quantity, dateStart, dateEnd, comments }) {
		const body = JSON.stringify({
			formInfo: {
				quantity,
				dateStart,
				dateEnd,
				comments
			},
			idGood: good.id
		});

		return fetch(this._baseUrl, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"token": this._apiAuth.getToken()
			},
			body
		})
			.then((response) => {
				if (!response.ok) {
					return response.json().then((json) => Promise.reject(json));
				}
				return response.json();
			})
			.then((data) => {
				return data; // Здесь возвращается непосредственно весь объект данных
			})
			.catch((error) => {
				console.error("Error in createRequestRental:", error);
				throw error;
			});
	}
}
