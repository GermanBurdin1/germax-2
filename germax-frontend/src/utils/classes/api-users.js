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

    // Добавьте другие методы, если необходимо
}
