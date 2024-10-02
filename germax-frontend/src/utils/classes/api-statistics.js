import { ApiAuth } from "./api-auth";

export class ApiStatistics {
	_apiAuth = ApiAuth.getInstance();
	_baseUrl = "http://germax-api/statistics";

	constructor() {}
	async getManagerStatistics() {
		return fetch(`${this._baseUrl}/get-manager-statistics.endpoint`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${this._apiAuth.getToken()}`,
			},
		})
			.then((response) => response.json())
			.then((data) => {
				if (data.success) {
					return data.statistics;
				} else {
					throw new Error(data.message || "Error fetching statistics");
				}
			})
			.catch((error) => {
				console.error("Error fetching statistics:", error);
				throw error;
			});
	}

	async getStockmanStatistics() {
		return fetch(`${this._baseUrl}/get-stockman-statistics.endpoint`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${this._apiAuth.getToken()}`,
			},
		})
			.then((response) => response.json())
			.then((data) => {
				if (data.success) {
					return data.statistics;
				} else {
					throw new Error(data.message || "Error fetching statistics");
				}
			})
			.catch((error) => {
				console.error("Error fetching statistics:", error);
				throw error;
			});
	}

	async getStudentTeacherStatistics() {
		return fetch(`${this._baseUrl}/get-student-teacher-statistics.endpoint`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${this._apiAuth.getToken()}`,
			},
		})
			.then((response) => response.json())
			.then((data) => {
				if (data.success) {
					return data.statistics;
				} else {
					throw new Error(data.message || "Error fetching statistics");
				}
			})
			.catch((error) => {
				console.error("Error fetching statistics:", error);
				throw error;
			});
	}
}
