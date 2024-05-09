import { ApiAuth } from "./api-auth";

export class ApiRental {
	_apiAuth = ApiAuth.getInstance();
	_baseUrl = "http://germax-api/rental/create";

	constructor() {}

	async createRequestRental(good, { quantity, dateStart, dateEnd, comments }) {
		return fetch(this._baseUrl, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				token: this._apiAuth.getToken(),
			},
			body: {
				formInfo: {
					quantity,
					dateStart,
					dateEnd,
					comments
				},
				idGood: good.id
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
