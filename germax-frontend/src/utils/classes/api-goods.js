import { stringifyParams } from "../stringify-params";
import { ApiAuth } from "./api-auth";

export class ApiGoods {
	_apiAuth = ApiAuth.getInstance();
	_baseUrl = "http://germax-api/goods";

	constructor() {}

	async getAllGoods({
		typeName = null,
		modelName = null,
		statusNames = ["available"],
		page = 1,
		limit = 20,
	} = {}) {
		console.log("getAllGoods вызывается");

		// Преобразуем массив статусов в строку, разделенную запятыми
		const paramsStr = stringifyParams({
			typeName,
			modelName,
			statusNames: statusNames.join(","),
			page,
			limit,
		});

		return fetch(`${this._baseUrl}?${paramsStr}`, {
			method: "GET",
			headers: {
				token: this._apiAuth.getToken(),
			},
		})
			.then((response) => {
				const json = response.json();
				if (!response.ok) return Promise.reject(json);
				return json;
			})
			.then((data) => ({
				goods: data.data,
				totalItems: data.totalItems, // Предполагается, что API возвращает это значение
			}));
	}

	async createGood({
		modelName,
		statusId = 4,
		serialNumbers,
		id_type,
		brandName,
		description = "",
		photo = "",
		location = "stock_stockman", // Добавлено поле местоположения
	}) {
		const body = JSON.stringify({
			modelName,
			statusId,
			serialNumbers,
			id_type,
			brandName,
			description,
			photo,
			location, // Добавлено поле местоположения
		});
		// console.log("Sending data to server:", body);

		return fetch(`${this._baseUrl}`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				token: this._apiAuth.getToken(),
			},
			body,
		})
			.then((response) => {
				return response.text().then((text) => {
					// console.log("Received response from server:", text);
					if (!response.ok) {
						return Promise.reject(text);
					}
					return JSON.parse(text);
				});
			})
			.then((data) => {
				return data;
			})
			.catch((error) => {
				console.error("Error in createGood:", error);
				throw error;
			});
	}

	async getUnitsByModelId(modelId) {
		try {
			const response = await fetch(
				`http://germax-api/goods?action=getUnitsByModelId&modelId=${modelId}`,
				{
					method: "GET",
					headers: {
						token: this._apiAuth.getToken(),
						"Content-Type": "application/json",
					},
				}
			);

			if (!response.ok) {
				throw new Error(`Error fetching units: ${response.statusText}`);
			}

			const data = await response.json();
			return data.data;
		} catch (error) {
			console.error("Error fetching units:", error);
			throw error;
		}
	}

	async updateGood({ id_good, modelName, id_type, brandName, photo }) {
		const body = JSON.stringify({
			id_good,
			modelName,
			id_type,
			brandName,
			photo,
		});

		return fetch(`${this._baseUrl}`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
				token: this._apiAuth.getToken(),
			},
			body,
		})
			.then((response) => {
				return response.text().then((text) => {
					if (!response.ok) {
						return Promise.reject(text);
					}
					return JSON.parse(text);
				});
			})
			.then((data) => {
				return data;
			})
			.catch((error) => {
				console.error("Error in updateGood:", error);
				throw error;
			});
	}

	async getGoodById(id_good) {
		try {
			const response = await fetch(
				`http://germax-api/goods?action=getGoodById&id_good=${id_good}`,
				{
					method: "GET",
					headers: {
						token: this._apiAuth.getToken(),
						"Content-Type": "application/json",
					},
				}
			);

			if (!response.ok) {
				throw new Error(`Error fetching good: ${response.statusText}`);
			}

			const data = await response.json();
			return data.data;
		} catch (error) {
			console.error("Error fetching good:", error);
			throw error;
		}
	}

	async sendEquipment(id_good) {
		const body = JSON.stringify({
			id_good,
			action: "send",
		});

		return fetch(`${this._baseUrl}`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				token: this._apiAuth.getToken(),
			},
			body,
		})
			.then((response) => response.json())
			.then((data) => {
				if (!data.success) {
					return Promise.reject(data.message);
				}
				return data;
			})
			.catch((error) => {
				console.error("Error in sendEquipment:", error);
				throw error;
			});
	}

	async confirmReceiving(id_good) {
		const body = JSON.stringify({
			id_good,
			action: "receive",
		});

		return fetch(`${this._baseUrl}`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				token: this._apiAuth.getToken(),
			},
			body,
		})
			.then((response) => response.json())
			.then((data) => {
				if (!data.success) {
					return Promise.reject(data.message);
				}
				return data;
			})
			.catch((error) => {
				console.error("Error in confirmReceiving:", error);
				throw error;
			});
	}

	async confirmHandOver(id_loan, id_good) {
		const body = JSON.stringify({
			id_loan,
			id_good,
			action: "handOver",
		});
		console.log("body sending", body);
		return fetch(`${this._baseUrl}`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				token: this._apiAuth.getToken(),
			},
			body,
		})
			.then((response) => {
				if (!response.ok) {
					return response.text().then((text) => {
						return Promise.reject(
							new Error(`Request failed: ${response.statusText}`)
						);
					});
				}
				return response.json(); // Используем только response.json()
			})
			.then((data) => {
				if (!data.success) {
					return Promise.reject(data.message);
				}
				return data;
			})
			.catch((error) => {
				console.error("Error in confirmHandOver:", error);
				throw error;
			});
	}

	async reportReturn(id_loan, id_good) {
		const body = JSON.stringify({
			id_loan,
			id_good,
			action: "return",
		});
		console.log("body sending", body);
		return fetch(`${this._baseUrl}`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				token: this._apiAuth.getToken(),
			},
			body,
		})
			.then((response) => {
				if (!response.ok) {
					return response.text().then((text) => {
						return Promise.reject(
							new Error(`Request failed: ${response.statusText}`)
						);
					});
				}
				return response.json();
			})
			.then((data) => {
				if (!data.success) {
					return Promise.reject(data.message);
				}
				return data;
			})
			.catch((error) => {
				console.error("Error in reportReturn:", error);
				throw error;
			});
	}
}
