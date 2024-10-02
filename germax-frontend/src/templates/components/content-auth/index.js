import "./index.css";
import Modal from "bootstrap/js/dist/modal";
import { getFormData } from "../../../utils/helpers/dom-utils";

document.querySelector(".link_2").addEventListener("click", function (event) {
	event.preventDefault();
	switchToRegistration();
});

document.querySelector(".link_1").addEventListener("click", function (event) {
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
			console.error("Login error:", error);
			if (
				error &&
				error.error &&
				error.error[0] === "No authorization permission from manager"
			) {
				showAuthorizationPendingModal();
			}
		});
}

function loginLogic(responseData) {
	if (
		responseData.data &&
		responseData.data.connexion_permission === "blocked"
	) {
		showAccessDeniedModal();
	} else {
		localStorage.setItem("authToken", JSON.stringify(responseData.data.token));
		localStorage.setItem("id_user", JSON.stringify(responseData.data.id_user));
		window.location.href = "/page-dashboard";
	}
}

function showAccessDeniedModal() {
	const accessDeniedModal = new Modal(
		document.getElementById("accessDeniedModal")
	);
	accessDeniedModal.show();
}

function showAuthorizationPendingModal() {
	const authorizationPendingModal = new Modal(
		document.getElementById("authorizationPendingModal")
	);

	const modalElement = document.getElementById("authorizationPendingModal");
	modalElement.addEventListener("hidden.bs.modal", function () {
		window.location.href = "/";
	});

	authorizationPendingModal.show();
}

//registration
document.addEventListener("DOMContentLoaded", function () {
	initializeFieldValidation();
	initializeTypePermissionSelect();
	initializeRegistrationForm();
	initializeLinks();
});

function initializeFieldValidation() {
	const fields = [
		{
			id: "inputLastname",
			validate: (value) => /^[a-zA-Z-]+$/.test(value),
			error:
				"Nom est obligatoire et ne doit contenir que des lettres et des tirets",
		},
		{
			id: "inputFirstname",
			validate: (value) => /^[a-zA-Z-]+$/.test(value),
			error:
				"Prénom est obligatoire и ne doit contenir que des lettres и des tirets",
		},
		{
			id: "inputPhone",
			validate: (value) => /^\d{10}$/.test(value),
			error: "Téléphone est obligatoire et doit contenir 10 chiffres",
		},
		{
			id: "inputEmail",
			validate: (value) => /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value),
			error: "Adresse mail invalide",
		},
		{
			id: "inputPassword",
			validate: (value) => validatePassword(value),
			error:
				"Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un symbole spécial",
		},
		{
			id: "confirmPassword",
			validate: (value) =>
				value === document.getElementById("inputPassword").value,
			error: "Les mots de passe ne correspondent pas",
		},
		{
			id: "type-permission",
			validate: (value) => value.length > 0,
			error: "Type d'utilisateur est obligatoire",
		},
	];

	fields.forEach((field) => {
		const input = document.getElementById(field.id);
		if (input) {
			input.addEventListener("blur", function () {
				validateField(field.id, field.validate, field.error);
			});
		}
	});
}

function initializeTypePermissionSelect() {
	const typePermissionSelect = document.querySelector(
		'select[name="type-permission"]'
	);
	typePermissionSelect.addEventListener("change", function () {
		const facultyContainer = document.getElementById("facultyContainer");
		if (this.value === "student") {
			if (!facultyContainer.hasChildNodes()) {
				const newField = document.createElement("div");
				newField.className = "inputbox";
				newField.id = "facultyField";
				newField.innerHTML = `
									<label for="faculty" class="form-label"></label>
									<select class="form-control form-select" name="faculty" id="faculty">
											<option value="" disabled selected>Choisissez votre faculté</option>
											<option value="development">Développement informatique</option>
											<option value="cyber-security">Systèmes, réseaux et cybersécurité</option>
											<option value="digital-marketing">Commerce et Marketing digital</option>
									</select>
									<div class="error-container" id="errorFaculty"></div>
							`;
				facultyContainer.appendChild(newField);
				document
					.getElementById("faculty")
					.addEventListener("blur", function () {
						validateField(
							"faculty",
							(value) => value.length > 0,
							"Filière est obligatoire pour les étudiants"
						);
					});
			}
		} else {
			facultyContainer.innerHTML = "";
		}
	});
}

function initializeRegistrationForm() {
	document
		.getElementById("registrationForm")
		.addEventListener("submit", function (event) {
			event.preventDefault();

			let isValid = true;

			const fields = [
				{
					id: "inputLastname",
					validate: (value) => /^[a-zA-Z-]+$/.test(value),
					error:
						"Nom est obligatoire et ne doit contenir que des lettres et des tirets",
				},
				{
					id: "inputFirstname",
					validate: (value) => /^[a-zA-Z-]+$/.test(value),
					error:
						"Prénom est obligatoire и ne doit contenir que des lettres et des tirets",
				},
				{
					id: "inputPhone",
					validate: (value) => /^\d{10}$/.test(value),
					error: "Téléphone est obligatoire и doit contenir 10 chiffres",
				},
				{
					id: "inputEmail",
					validate: (value) => /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value),
					error: "Adresse mail invalide",
				},
				{
					id: "inputPassword",
					validate: (value) => value.length > 0,
					error: "Mot de passe est obligatoire",
				},
				{
					id: "confirmPassword",
					validate: (value) =>
						value === document.getElementById("inputPassword").value,
					error: "Les mots de passe ne correspondent pas",
				},
				{
					id: "type-permission",
					validate: (value) => value.length > 0,
					error: "Type d'utilisateur est obligatoire",
				},
			];

			fields.forEach((field) => {
				if (!validateField(field.id, field.validate, field.error)) {
					isValid = false;
				}
			});

			const typePermissionSelect = document.querySelector(
				'select[name="type-permission"]'
			);
			if (typePermissionSelect.value === "student") {
				if (
					!validateField(
						"faculty",
						(value) => value.length > 0,
						"Filière est obligatoire для студентов"
					)
				) {
					isValid = false;
				}
			}

			if (!isValid) {
				return;
			}

			const formData = new FormData(this);
			const url = "http://germax-api/auth/register";

			fetch(url, {
				method: "POST",
				body: formData,
			})
				.then((response) => response.json())
				.then((data) => {
					if (data.success) {
						let message;
						const userType = typePermissionSelect.value;
						if (userType === "student" || userType === "teacher") {
							message =
								"Le manager reviendra vers vous dans les meilleurs délais!";
						} else {
							message =
								"L'administrateur reviendra vers vous dans les meilleurs délais!";
						}
						alert(message);
						window.location.href = "/";
					}
				})
				.catch((error) => {
					console.error("Error:", error);
				});
		});
}

function initializeLinks() {
	document.querySelector(".link_2").addEventListener("click", function (event) {
		event.preventDefault();
		switchToRegistration();
	});

	document.querySelector(".link_1").addEventListener("click", function (event) {
		event.preventDefault();
		switchToLogin();
	});
}

function validateField(fieldId, validateFn, errorMessage) {
	const field = document.getElementById(fieldId);
	if (!field) {
		console.error(`Field not found: ${fieldId}`);
		return false;
	}

	let value;
	if (field.tagName === "SELECT") {
		value = field.value;
	} else {
		value = field.value.trim();
	}

	const errorContainer = document.getElementById(
		`error${capitalizeFirstLetter(fieldId)}`
	);
	clearErrors(fieldId);

	if (!validateFn(value)) {
		setError(fieldId, errorMessage);
		return false;
	}
	return true;
}

function validatePassword(password) {
	const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
	return passwordRegex.test(password);
}

function setError(fieldId, errorMessage) {
	const field = document.getElementById(fieldId);
	const errorContainer = document.getElementById(
		`error${capitalizeFirstLetter(fieldId)}`
	);
	if (errorContainer) {
		const errorSpan = document.createElement("span");
		errorSpan.className = "error-message";
		errorSpan.textContent = errorMessage;
		errorContainer.appendChild(errorSpan);
		field.classList.add("input-error");
		errorContainer.classList.add("error-shake");
		setTimeout(() => {
			errorContainer.classList.remove("error-shake");
		}, 1000);
	} else {
		console.error(`Error container not found for field: ${fieldId}`);
	}
}

function clearErrors(fieldId) {
	const errorContainer = document.getElementById(
		`error${capitalizeFirstLetter(fieldId)}`
	);
	if (errorContainer) {
		errorContainer.innerHTML = "";
	}
	const field = document.getElementById(fieldId);
	if (field) {
		field.classList.remove("input-error");
	}
}

function capitalizeFirstLetter(string) {
	return string.charAt(0).toUpperCase() + string.slice(1);
}

function switchToLogin() {
	document.getElementById("login-container").style.display = "block";
	document.getElementById("registration-container").style.display = "none";
	document.querySelector(".link_1").classList.add("active");
	document.querySelector(".link_2").classList.remove("active");
}

function switchToRegistration() {
	document.getElementById("login-container").style.display = "none";
	document.getElementById("registration-container").style.display = "block";
	document.querySelector(".link_1").classList.remove("active");
	document.querySelector(".link_2").classList.add("active");
}
