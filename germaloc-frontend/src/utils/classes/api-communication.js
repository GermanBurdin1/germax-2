import { ApiAuth } from "./api-auth";
// В разработке
export class ApiCommunications {
    _apiAuth = ApiAuth.getInstance();
    _baseUrl = "http://germaloc-api/communications";

    constructor() {}

    async getMessages(userType) {
        const response = await fetch(`${this._baseUrl}/get-messages?userType=${userType}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${this._apiAuth.getToken()}`,
            },
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || "Failed to fetch messages");
        }
        return data;
    }

    async sendMessage(message) {
        const response = await fetch(`${this._baseUrl}/send-message`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${this._apiAuth.getToken()}`,
            },
            body: JSON.stringify({ message }),
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || "Failed to send message");
        }
        return data;
    }
}
