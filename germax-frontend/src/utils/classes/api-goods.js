import { stringifyParams } from "../stringify-params";
import { ApiAuth } from "./api-auth";

export class ApiGoods {
	_apiAuth = ApiAuth.getInstance();
	_baseUrl = "http://germax-api/goods";

	constructor() {}

	getAllGoods({ typeName = null, modelName = null, statusName = "available" } = {}) {
		const paramsStr = stringifyParams({ typeName, modelName, statusName });

		return fetch(`${this._baseUrl}?${paramsStr}`, {
			method: "GET",
			headers: {
				token: this._apiAuth.getToken(),
			}
		})
			.then((response) => {
				const json = response.json();
				if (!response.ok) return Promise.reject(json);
				return json;
			})
			.then(data => data.data)
	}
}
