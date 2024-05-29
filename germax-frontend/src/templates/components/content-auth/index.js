import './index.css';
import { getFormData } from "../../../utils/dom-utils";

document.querySelector('.link_2').addEventListener('click', function(event) {
	event.preventDefault();
	switchToRegistration();
});

document.querySelector('.link_1').addEventListener('click', function(event) {
	event.preventDefault();
	switchToLogin();
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
const typePermissionSelect = document.querySelector('select[name="type-permission"]');

typePermissionSelect.addEventListener('change', function() {
	const facultyContainer = document.getElementById('facultyContainer');
	if (this.value === 'student') {
		if (!facultyContainer.hasChildNodes()) {
			const newField = document.createElement('div');
			newField.className = 'inputbox';
			newField.id = 'facultyField';
			newField.innerHTML = `
			<label for="faculty" class="form-label"></label>
			<select class="form-control form-select" name="faculty" id="faculty">
					<option value="" disabled selected>Choisissez votre faculté</option>
					<option value="development">Développement informatique</option>
					<option value="cyber-security">Systèmes, réseaux et cybersécurité</option>
					<option value="digital-marketing">Commerce et Marketing digital</option>
			</select>
			`;
			facultyContainer.appendChild(newField);
		}
	} else {
		facultyContainer.innerHTML = '';
	}
});

document.getElementById('registrationForm').addEventListener('submit', function(event) {
	event.preventDefault(); // Предотвратить стандартную отправку формы

	const formData = new FormData(this);
	for (const [key, value] of formData.entries()) {
		console.log(`${key}: ${value}`);
	}

	const url = 'http://germax-api/auth/register';

	fetch(url, {
			method: 'POST', // Использовать метод POST
			body: formData  // Отправить данные формы
	})
	.then(response => response.json()) // Преобразовать ответ в JSON
	.then(data => {
			console.log('Success:', data); // Вывести данные ответа в консоль
			if (data.success) {
				// Переход на страницу логина
				switchToLogin();
		}
	})
	.catch((error) => {
			console.error('Error:', error); // Вывести ошибку в консоль, если она произошла
	});
});

function switchToLogin() {
	console.log("вызвалась функция");
	document.getElementById('login-container').style.display = 'block';
	document.getElementById('registration-container').style.display = 'none';
	document.querySelector('.link_1').classList.add('active');
	document.querySelector('.link_2').classList.remove('active');
}

function switchToRegistration() {
	document.getElementById('login-container').style.display = 'none';
	document.getElementById('registration-container').style.display = 'block';
	document.querySelector('.link_1').classList.remove('active');
	document.querySelector('.link_2').classList.add('active');
}
