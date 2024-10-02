import { ApiAuth } from "./api-auth";

export class ApiUsers {
	_apiAuth = ApiAuth.getInstance();
	_baseUrl = "http://germax-api/user-management";

	constructor() {}

	async getUsersByPermission(permissionName) {
		return fetch(
			`${this._baseUrl}/get-users-by-permission.endpoint?permissionName=${permissionName}`,
			{
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${this._apiAuth.getToken()}`,
				},
			}
		)
			.then((response) => response.json())
			.then((data) => {
				if (data.success) {
					return data.data;
				} else {
					throw new Error(data.message || "Error fetching users");
				}
			})
			.catch((error) => {
				console.error("Error fetching users:", error);
				throw error;
			});
	}

	async updateUser(data) {
		const token = this._apiAuth.getToken();

		const body = JSON.stringify(data);

		return fetch(`${this._baseUrl}/update-user.endpoint`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
			body: body,
		})
			.then((response) => {
				return response.text().then((text) => {
					try {
						return JSON.parse(text);
					} catch (err) {
						console.error("Failed to parse JSON:", err);
						throw new Error("Failed to parse JSON");
					}
				});
			})
			.then((data) => {
				if (data.success) {
					return data;
				} else {
					throw new Error(data.message || "Error updating user");
				}
			})
			.catch((error) => {
				console.error("Error updating user:", error);
				throw error;
			});
	}

	async getUser() {
		const token = this._apiAuth.getToken();
		return fetch(`${this._baseUrl}/get-user.endpoint`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
		})
			.then((response) => response.json())
			.then((data) => {
				if (data.success) {
					return data.data;
				} else {
					throw new Error(data.message || "Error fetching user data");
				}
			})
			.catch((error) => {
				console.error("Error fetching user data:", error);
				throw error;
			});
	}

	async getUserInformationById(userId) {
		const token = this._apiAuth.getToken();
		return fetch(
			`${this._baseUrl}/get-user-information-by-id.endpoint?id_user=${userId}`,
			{
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			}
		)
			.then((response) => response.json())
			.then((data) => {
				if (data.success) {
					return data.data;
				} else {
					throw new Error(data.message || "Error fetching user information");
				}
			})
			.catch((error) => {
				console.error("Error fetching user information:", error);
				throw error;
			});
	}

	async updateUserStatus(userId, status) {
		const token = this._apiAuth.getToken();
		return fetch(`${this._baseUrl}/block-user.endpoint`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify({ id_user: userId, connexion_permission: status }),
		})
			.then((response) => response.json())
			.then((data) => {
				if (data.success) {
					return data;
				} else {
					throw new Error(data.message || "Error updating user status");
				}
			})
			.catch((error) => {
				console.error("Error updating user status:", error);
				throw error;
			});
	}
}
