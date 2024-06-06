import { getFormData } from "../../../utils/dom-utils";
import "./index.css";

const loginFormNode = document.getElementById("loginForm");

loginFormNode.addEventListener("submit", function (event) {
	event.preventDefault();
	const formData = getFormData("loginForm");

	loginFetch("http://germax-api/auth/login", formData);
});

function loginFetch(url, data) {
	fetch(url, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(data),
	})
		.then(async (response) => {
			const json = await response.json();
			if (!response.ok) return Promise.reject(json);
			return json;
		})
		.then((data) => {
			loginLogic(data);
		})
		.catch((error) => {
			console.error(error);
		});
}

function loginLogic(responseData) {
	localStorage.setItem("authToken", JSON.stringify(responseData.data.token));
	localStorage.setItem("id_user", JSON.stringify(responseData.data.id_user));
	window.location.href = "/page-dashboard"; // Перенаправить на страницу после входа
}
