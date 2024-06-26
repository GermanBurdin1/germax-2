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

	async createEquipmentRequestFromManager({
		modelName,
		comments,
		quantity,
		id_type,
		id_user,
	}) {
		const body = JSON.stringify({
			formRequestItemInfo: {
				modelName,
				comments,
				quantity,
				id_type,
				id_user,
			},
		});
		console.log("Sending JSON:", body);
		return fetch(`${this._baseUrl}/create-first-request-from-manager`, {
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

	async getAllRequests(page = 1, itemsPerPage = 10) {
		const url = `${this._baseUrl}/get-all-requests?page=${page}&itemsPerPage=${itemsPerPage}`;
		return fetch(url, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${this._apiAuth.getToken()}`,
			},
			cache: "no-store",
		})
			.then((response) => {
				return response.text().then((text) => {
					let jsonData;
					try {
						jsonData = JSON.parse(text);
						if (jsonData.data) {
						}

						return jsonData;
					} catch (error) {
						console.error("Error parsing JSON:", error);
						console.log("Invalid JSON response:", text);
						throw error;
					}
					return jsonData;
				});
			})
			.then((data) => {
				if (data.success && Array.isArray(data.data)) {
					return data;
				} else {
					throw new Error("Invalid response structure");
				}
			})
			.catch((error) => {
				console.error("Error fetching equipment requests:", error);
				return { success: false, data: [], totalItems: 0 }; // Возвращаем объект с пустым массивом данных в случае ошибки
			});
	}

	async getAllRequestsByUser(requestId) {
		return fetch(`${this._baseUrl}/get-all-requests-by-user?id=${requestId}`, {
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
		// console.log("Request body:", body); // Логируем тело запроса
		return fetch(`${this._baseUrl}/update-request`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
				token: this._apiAuth.getToken(),
			},
			body,
		})
			.then((response) => {
				console.log("Raw response:", response); // Логируем необработанный ответ
				if (!response.ok) {
					return response.json().then((json) => {
						console.log("Error response JSON:", json); // Логируем тело ошибки
						return Promise.reject(json);
					});
				}
				return response.json();
			})
			.then((data) => {
				console.log("Response data:", data); // Логируем данные ответа
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

	async cancelRequest(requestId) {
		const body = JSON.stringify({ id_request: requestId });
		try {
			const response = await fetch(`${this._baseUrl}/cancel-request`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					token: this._apiAuth.getToken(),
				},
				body,
			});

			if (!response.ok) {
				const errorText = await response.text();
				throw new Error(
					`HTTP error! Status: ${response.status}, Message: ${errorText}`
				);
			}

			const data = await response.json();

			if (!data.success) {
				throw new Error(data.message || "Failed to cancel request");
			}

			return data;
		} catch (error) {
			console.error("Error cancelling request:", error);
			throw error;
		}
	}
}
