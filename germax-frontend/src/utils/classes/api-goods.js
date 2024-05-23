import { stringifyParams } from "../stringify-params";
import { ApiAuth } from "./api-auth";

export class ApiGoods {
	_apiAuth = ApiAuth.getInstance();
	_baseUrl = "http://germax-api/goods";

	constructor() {}

	getAllGoods({
		typeName = null,
		modelName = null,
		statusName = "available",
	} = {}) {
		console.log("getAllGoods вызывается")
		const paramsStr = stringifyParams({ typeName, modelName, statusName });

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
			.then((data) => data.data);
	}

	async createGood({
		modelName,
		statusId = 4,
		serialNumbers,
		id_type,
		brandName,
		description = "",
		photo = "",
	}) {
		const body = JSON.stringify({
			modelName,
			statusId,
			serialNumbers,
			id_type,
			brandName,
			description,
			photo,
		});
		console.log("Sending data to server:", body);

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
					console.log("Received response from server:", text);
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
}
