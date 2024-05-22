import { ApiAuth } from "./api-auth";

export class ApiEquipmentRequest {
	_apiAuth = ApiAuth.getInstance();
	_baseUrl = "http://germax-api/equipment_requests";

	constructor() {}

	async createEquipmentRequest({
		modelName,
		comments,
		dateStart,
		dateEnd,
		quantity,
		id_type,
	}) {
		const body = JSON.stringify({
			formRequestItemInfo: {
				modelName,
				comments,
				dateStart,
				dateEnd,
				quantity,
				id_type,
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
				if (data.success && Array.isArray(data.data)) {
					return data;
				} else {
					throw new Error("Invalid response structure");
				}
			})
			.catch((error) => {
				console.error("Error fetching equipment requests:", error);
				return { success: false, data: [] }; // Возвращаем объект с пустым массивом данных в случае ошибки
			});
	}

	async updateEquipmentRequest(updatedData) {
		const body = JSON.stringify(updatedData);
		return fetch(`${this._baseUrl}/update-request`, {
			method: "PUT",
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
				if (data.success) {
					return data.data; // Возвращаем обновленные данные
				} else {
					throw new Error(data.message || "Error updating request");
				}
			})
			.catch((error) => {
				console.error("Error updating request:", error);
				throw error;
			});
	}

	async confirmApproval(approvalData) {
		const body = JSON.stringify(approvalData);
		return fetch(`${this._baseUrl}/confirm-approval`, {
			// Замените URL на соответствующий для подтверждения
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
				if (data.success) {
					return data.data; // Возвращаем обновленные данные
				} else {
					throw new Error(data.message || "Error confirming approval");
				}
			})
			.catch((error) => {
				console.error("Error confirming approval:", error);
				throw error;
			});
	}

	async sendUpdatedDataToUser(updatedData) {
		const body = JSON.stringify(updatedData);
		return fetch(`${this._baseUrl}/send-updated-data-to-user`, {
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
				if (data.success) {
					return data.data;
				} else {
					throw new Error(data.message || "Error sending data to user");
				}
			})
			.catch((error) => {
				console.error("Error sending data to user:", error);
				throw error;
			});
	}

	async createRequest(data) {
		const body = JSON.stringify(data);
		const token = this._apiAuth.getToken();

		return fetch(`${this._baseUrl}/create-request`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				token: token,
			},
			body,
		})
			.then((response) => response.json())
			.catch((error) => {
				console.error("Error in createRequest:", error);
				throw error;
			});
	}

	async getRequestById(requestId) {
		return fetch(`${this._baseUrl}/get-request-by-id?id=${requestId}`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${this._apiAuth.getToken()}`,
			},
		})
			.then((response) => response.json())
			.then((data) => {
				if (data.success) {
					return data.data;
				} else {
					throw new Error(data.message || "Error fetching request");
				}
			})
			.catch((error) => {
				console.error("Error fetching request by ID:", error);
				throw error;
			});
	}
}
