import { ApiAuth } from "./api-auth";

export class ApiNotification {
	_apiAuth = ApiAuth.getInstance();
	_baseUrl = "http://germaloc-api/notifications";

	async getNotifications(userId) {
		return fetch(
			`${this._baseUrl}/endpoint?action=getNotifications&userId=${userId}`,
			{
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					"token": `Bearer ${this._apiAuth.getToken()}`,
				},
			}
		)
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

	async markNotificationsAsRead(userId) {
		return fetch(`${this._baseUrl}/mark-notifications-as-read.endpoint`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"token": `Bearer ${this._apiAuth.getToken()}`,
			},
			body: JSON.stringify({ userId }),
		})
			.then((response) => response.json())
			.then((data) => {
				if (!data.success) {
					throw new Error(
						data.message || "Error marking notifications as read"
					);
				}
			})
			.catch((error) => {
				console.error("Error marking notifications as read:", error);
				throw error;
			});
	}

	async createNotification(notification) {
		return fetch(`${this._baseUrl}/create-notification`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"token": `Bearer ${this._apiAuth.getToken()}`,
			},
			body: JSON.stringify(notification),
		})
			.then((response) => response.json())
			.then((data) => {
				if (!data.success) {
					throw new Error(data.message || "Error creating notification");
				}
			})
			.catch((error) => {
				console.error("Error creating notification:", error);
				throw error;
			});
	}
}
