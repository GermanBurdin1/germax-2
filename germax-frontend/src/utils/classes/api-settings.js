import { ApiAuth } from "./api-auth";

export class ApiSettings {
  _apiAuth = ApiAuth.getInstance();
  _baseUrl = "http://germax-api/functionality";

  async getSettings() {
    const token = this._apiAuth.getToken();
    console.log("Using token:", token);

    return fetch(`${this._baseUrl}/get-settings`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
    })
    .then(response => response.json())
    .then(data => {
        console.log("Fetched data:", data);
        if (data.success && Array.isArray(data.data)) {
            return data.data;
        } else {
            throw new Error("Invalid response structure");
        }
    })
    .catch(error => {
        console.error("Error fetching settings:", error);
        throw error;
    });
}

	async saveSettings({ id_permission, id_functionality, max_reservations }) {
    const body = JSON.stringify({
      id_permission,
      id_functionality,
      max_reservations,
    });
		console.log("Sending settings data:", body);

    return fetch(`${this._baseUrl}/save-settings`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        token: this._apiAuth.getToken(),
      },
      body,
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then((json) => Promise.reject(json));
        }
        return response.json();
      })
      .then((data) => {
        if (data.success) {
					console.log("Settings saved successfully:", data.message);
          return data.message;
        } else {
          throw new Error(data.message || "Error saving settings");
        }
      })
      .catch((error) => {
        console.error("Error saving settings:", error);
        throw error;
      });
  }
}
