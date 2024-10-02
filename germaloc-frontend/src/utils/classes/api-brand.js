import { ApiAuth } from "./api-auth";

export class BrandAPI {
	_apiAuth = ApiAuth.getInstance();
	_baseUrl = "http://germaloc-api/brand";

	constructor() {}

	async getOrCreateBrand({ brandName }) {
		const body = JSON.stringify({
			name: brandName,
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

	async searchBrands(query) {
		const response = await fetch(`${this._baseUrl}/endpoint?name=${encodeURIComponent(query)}`, {
			method: "GET",
			headers: {
				token: this._apiAuth.getToken(),
			},
		});

		const data = await response.json();
		if (!response.ok) {
			throw new Error(data.message || "Failed to search brands");
		}
		return data;
	}
}
