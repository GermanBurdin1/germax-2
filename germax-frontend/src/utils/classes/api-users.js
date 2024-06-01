import { ApiAuth } from "./api-auth";

export class ApiUsers {
    _apiAuth = ApiAuth.getInstance();
    _baseUrl = "http://germax-api/user-management";

    constructor() {}

    async getUsersByPermission(permissionName) {
        return fetch(`${this._baseUrl}/get-users-by-permission.endpoint?permissionName=${permissionName}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${this._apiAuth.getToken()}`,
            },
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                return data.data;
            } else {
                throw new Error(data.message || "Error fetching users");
            }
        })
        .catch(error => {
            console.error("Error fetching users:", error);
            throw error;
        });
    }

    async updateUser(data) {
			const token = this._apiAuth.getToken(); // Убедитесь, что токен правильно извлекается
			console.log("Token being sent:", token); // Логируем токен для отладки
			return fetch(`${this._baseUrl}/update-user.endpoint`, {
					method: "POST",
					headers: {
							"Content-Type": "application/json",
							"Authorization": `Bearer ${token}`, // Убедитесь, что заголовок устанавливается правильно
					},
					body: JSON.stringify(data),
			})
			.then(response => response.json())
			.then(data => {
					if (data.success) {
							return data;
					} else {
							throw new Error(data.message || "Error updating user");
					}
			})
			.catch(error => {
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
						"Authorization": `Bearer ${token}`,
				},
		})
		.then(response => response.json())
		.then(data => {
				if (data.success) {
						return data.data;
				} else {
						throw new Error(data.message || "Error fetching user data");
				}
		})
		.catch(error => {
				console.error("Error fetching user data:", error);
				throw error;
		});
}
}
