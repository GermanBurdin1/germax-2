import { ApiAuth } from "./api-auth";

export class ApiRental {
    _apiAuth = ApiAuth.getInstance();
    _baseUrl = "http://germax-api/rental";

    constructor() {}

    async createRequestRental(good, { quantity, dateStart, dateEnd, comments }) {
        const body = JSON.stringify({
            formInfo: {
                quantity,
                dateStart,
                dateEnd,
                comments
            },
            idGood: good.id
        });

        return fetch(`${this._baseUrl}/create`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "token": this._apiAuth.getToken()
            },
            body
        })
            .then((response) => {
                if (!response.ok) {
                    return response.json().then((json) => Promise.reject(json));
                }
                return response.json();
            })
            .then((data) => {
                return data;
            })
            .catch((error) => {
                console.error("Error in createRequestRental:", error);
                throw error;
            });
    }

    async getClientRentals() {
        return fetch(`${this._baseUrl}/get-client-rentals`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "token": this._apiAuth.getToken()
            }
        })
            .then((response) => {
                if (!response.ok) {
                    return response.json().then((json) => Promise.reject(json));
                }
                return response.json();
            })
            .then((data) => {
                return data.data;
            })
            .catch((error) => {
                console.error("Error in getClientRentals:", error);
                throw error;
            });
    }

		async approveRental(loanId) {
			const body = JSON.stringify({ loanId });

			return fetch(`${this._baseUrl}/approve.php`, {
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
					"token": this._apiAuth.getToken()
				},
				body
			})
				.then((response) => {
					if (!response.ok) {
						return response.json().then((json) => Promise.reject(json));
					}
					return response.json();
				})
				.then((data) => {
					return data;
				})
				.catch((error) => {
					console.error("Error in approveRental:", error);
					throw error;
				});
		}
}
