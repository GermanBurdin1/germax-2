export class ApiAuth {
	_keyInLocalStorage = "authToken";
	_authUser = null;

	/**
	 * @type {Promise<any>}
	 */
	_fetchMePromise = this._fetchMeAuthUser();
	static _instance = null;

	constructor() {
		if (ApiAuth._instance === null) {
			ApiAuth._instance = this;
		}
		return ApiAuth._instance;
	}

	getToken() {
		const valueInLocalStorage = localStorage.getItem(this._keyInLocalStorage);

		if (valueInLocalStorage === null) return "";

		return JSON.parse(valueInLocalStorage);
	}

	async _fetchMeAuthUser() {
		const token = this.getToken();

		return fetch("http://germax-api/auth/me", {
			method: "GET",
			headers: {
				token: token,
				"Content-Type": "application/json",
			},
		})
			.then((response) => {
				// console.log("HTTP Status:", response.status);
				const json = response.json();
				if (!response.ok) return Promise.reject(json);
				// console.log("Data received:", json);
				return json;
			})
			.then(data => {
				this._authUser = data.data;
			})
			.catch((error) => {
				console.error("Failed to fetch data:", error);
			});
	}

	async fetchMeAuthUser() {
		if (this._authUser === null) {
			await this._fetchMePromise;
		}
		return this._authUser;
	}

	async updateUserStatus(userId, status) {
		const token = this.getToken();

		return fetch('http://germax-api/auth/update_user_status', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${token}`,
			},
			body: JSON.stringify({ user_id: userId, connexion_permission: status }),
		})
		.then(response => response.json())
		.then(data => {
			if (data.status !== 'success') {
				return Promise.reject(data.message);
			}
			return data;
		})
		.catch(error => {
			console.error('Error updating user status:', error);
			throw error;
		});
	}

	static getInstance() {
		if (ApiAuth._instance === null) {
			ApiAuth._instance = new ApiAuth();
		}
		return ApiAuth._instance;
	}

}
