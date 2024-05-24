import { ApiAuth } from "./api-auth";

export class ApiNotification {
	_apiAuth = ApiAuth.getInstance();
	_baseUrl = "http://germax-api/notifications";

	async getNotifications(userId) {
			return fetch(`${this._baseUrl}/endpoint?action=getNotifications&userId=${userId}`, {
					method: "GET",
					headers: {
							"Content-Type": "application/json",
							Authorization: `Bearer ${this._apiAuth.getToken()}`,
					},
			})
			.then((response) => response.json())
			.then((data) => {
					if (data.success) {
							return data.data;
					} else {
							throw new Error(data.message || "Error fetching notifications");
					}
			})
			.catch((error) => {
					console.error("Error fetching notifications:", error);
					throw error;
			});
	}
}
