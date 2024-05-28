import './index.css';
import { getFormData } from "../../../utils/dom-utils";

document.querySelector('.link_2').addEventListener('click', function(event) {
	event.preventDefault();
	document.getElementById('login-container').style.display = 'none';
	document.getElementById('registration-container').style.display = 'block';
});

document.querySelector('.link_1').addEventListener('click', function(event) {
	event.preventDefault();
	document.getElementById('login-container').style.display = 'block';
	document.getElementById('registration-container').style.display = 'none';
});

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

//registration

document.getElementById('registrationForm').addEventListener('submit', function(event) {
	event.preventDefault(); // Предотвратить стандартную отправку формы

	const formData = new FormData(this); // Собрать данные формы
	const url = 'http://germax-api/src/endpoints/register.php'; // URL PHP скрипта

	fetch(url, {
			method: 'POST', // Использовать метод POST
			body: formData  // Отправить данные формы
	})
	.then(response => response.json()) // Преобразовать ответ в JSON
	.then(data => {
			console.log('Success:', data); // Вывести данные ответа в консоль
			if (data.status === 'success') {
				// Переход на страницу логина
				window.location.href = '/auth/';
		}
	})
	.catch((error) => {
			console.error('Error:', error); // Вывести ошибку в консоль, если она произошла
	});
});

document.getElementById('registrationForm').addEventListener('submit', function(event) {
	event.preventDefault(); // Предотвратить стандартную отправку формы

	const formData = new FormData(this); // Собрать данные формы
	const url = 'http://germax-api/src/endpoints/register.php'; // URL PHP скрипта

	fetch(url, {
			method: 'POST', // Использовать метод POST
			body: formData  // Отправить данные формы
	})
	.then(response => response.json()) // Преобразовать ответ в JSON
	.then(data => {
			console.log('Success:', data); // Вывести данные ответа в консоль
			if (data.status === 'success') {
				// Переход на страницу логина
				window.location.href = '/auth/';
		}
	})
	.catch((error) => {
			console.error('Error:', error); // Вывести ошибку в консоль, если она произошла
	});
});
