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
				const json = response.json();
				if (!response.ok) return Promise.reject(json);
				return json;
			})
			.then((data) => {
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

	async updateUserStatus(userId, status, authorization) {
		const token = this.getToken();

		return fetch("http://germax-api/auth/update-user-status", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify({
				user_id: userId,
				connexion_permission: status,
				authorization_permission: authorization,
			}),
		})
			.then((response) => response.json())
			.then((data) => {
				if (data.success !== true) {
					return Promise.reject(
						data.messages ? data.messages.join(", ") : "Unknown error"
					);
				}
				return data;
			})
			.catch((error) => {
				console.error("Error updating user status:", error);
				throw error;
			});
	}

	async getPendingUsers() {
		const token = this.getToken();

		return fetch("http://germax-api/auth/register", {
			method: "GET",
			headers: {
				Authorization: `Bearer ${token}`,
			},
		})
			.then((response) => response.json())
			.then((data) => {
				if (!data.success) {
					return Promise.reject(
						data.messages ? data.messages.join(", ") : "Unknown error"
					);
				}
				return data.data;
			})
			.catch((error) => {
				console.error("Error fetching pending users:", error);
				throw error;
			});
	}

	async getProcessedUsers() {
		const token = this.getToken();

		return fetch("http://germax-api/auth/processed-users", {
			method: "GET",
			headers: {
				Authorization: `Bearer ${token}`,
			},
		})
			.then((response) => response.json())
			.then((data) => {
				if (!data.success) {
					return Promise.reject(
						data.messages ? data.messages.join(", ") : "Unknown error"
					);
				}
				return data.data;
			})
			.catch((error) => {
				console.error("Error fetching processed users:", error);
				throw error;
			});
	}

	async getUserPermission() {
		const token = this.getToken();

		return fetch("http://germax-api/auth/get-user-permission.endpoint", {
			method: "GET",
			headers: {
				Authorization: `Bearer ${token}`,
				"Content-Type": "application/json",
			},
		})
			.then((response) => response.json())
			.then((data) => {
				if (!data.success) {
					return Promise.reject(
						data.message || "Failed to get user permission"
					);
				}
				return data.data;
			})
			.catch((error) => {
				console.error("Error fetching user permission:", error);
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
