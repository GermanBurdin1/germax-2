import { ApiAuth } from "./api-auth";

export class CategoryAPI {
	_apiAuth = ApiAuth.getInstance();
	_baseUrl = "http://germax-api/category";

	constructor() {}

	async addCategory({ categoryName }) {
		const body = JSON.stringify({
			name: categoryName,
		});


		const response = await fetch(`${this._baseUrl}/endpoint`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				token: this._apiAuth.getToken(),
			},
			body,
		});

		const data = await response.json();
		if (!response.ok) {
			throw new Error(data.message || "Failed to add category");
		}
		return data;
	}

	async getCategories() {
		const response = await fetch(`${this._baseUrl}/endpoint`, {
			method: "GET",
			headers: {
				token: this._apiAuth.getToken(),
			},
		});

		const data = await response.json();
		if (!response.ok) {
			throw new Error(data.message || "Failed to fetch categories");
		}
		return data.categories;
	}
}
