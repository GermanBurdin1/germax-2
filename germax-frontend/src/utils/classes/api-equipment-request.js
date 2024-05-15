import { ApiAuth } from "./api-auth";

export class ApiEquipmentRequest {
	_apiAuth = ApiAuth.getInstance();
	_baseUrl = "http://germax-api/equipment_requests";

	constructor() {}

	async createEquipmentRequest({
		category,
		modelName,
		comments,
		dateStart,
		dateEnd,
		quantity,
	}) {
		const body = JSON.stringify({
			formRequestItemInfo: {
				category,
				modelName,
				comments,
				dateStart,
				dateEnd,
				quantity,
			},
		});
		console.log("Sending JSON:", body);
		return fetch(`${this._baseUrl}/create-first-request`, {
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

	async getAllRequests() {
		return fetch(`${this._baseUrl}/get-all-requests`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${this._apiAuth.getToken()}`,
			},
		})
			.then((response) => response.json())
			.then((data) => {
				// Убедитесь, что ответ содержит свойство data и оно является массивом
				if (data.success && Array.isArray(data.data)) {
					return data.data;
				} else {
					throw new Error("Invalid response structure");
				}
			})
			.catch((error) => {
				console.error("Error fetching equipment requests:", error);
				return []; // Возвращаем пустой массив в случае ошибки
			});
	}
}
