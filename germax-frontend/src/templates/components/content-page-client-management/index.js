import "./index.css";
import Dropdown from "bootstrap/js/dist/dropdown";
import Modal from "bootstrap/js/dist/modal";
import Tab from "bootstrap/js/dist/tab";
import { ApiAuth } from "../../../utils/classes/api-auth";
import { ApiRental } from "../../../utils/classes/api-rental";
import { ApiUsers } from "../../../utils/classes/api-users";

const userType = localStorage.getItem("name_permission");

const apiAuth = ApiAuth.getInstance();
const apiRental = new ApiRental();
const apiUsers = new ApiUsers();

document.getElementById('userSearchInput').addEventListener('input', function (event) {
	const searchTerm = event.target.value.toLowerCase();
	searchUsers(searchTerm);
});


async function fetchPendingUsers(apiAuth) {
	try {
		const pendingUsers = await apiAuth.getPendingUsers();
		console.log("Pending Users:", pendingUsers); // Debugging output
		return pendingUsers;
	} catch (error) {
		console.error("Error fetching pending users:", error);
		throw error;
	}
}

async function fetchProcessedUsers(apiAuth) {
	try {
		const processedUsers = await apiAuth.getProcessedUsers();
		console.log("Processed Users:", processedUsers); // Debugging output
		return processedUsers;
	} catch (error) {
		console.error("Error fetching processed users:", error);
		throw error;
	}
}

function createRow(user) {
	const row = document.createElement("tr");
	let dropdownMenuContent;
	console.log("user", user)
	if (user.connexion_permission === "pending") {
		dropdownMenuContent = `
			<li><a class="dropdown-item view-details" href="#" data-bs-toggle="modal" data-bs-target="#authorizationClientModal" data-user-id="${user.id_user}">Gérer la réponse</a></li>
		`;
	} else if (user.connexion_permission === "authorized") {
		dropdownMenuContent = `
			<li><a class="dropdown-item view-details" href="#" data-bs-toggle="modal" data-bs-target="#detailsClientModal" data-user-id="${user.id_user}">Voir les détails</a></li>
		`;
	} else if (user.connexion_permission === "declined") {
		dropdownMenuContent = `
			<li><span class="dropdown-item-text text-muted">Utilisateur refusé</span></li>
		`;
	} else if (user.connexion_permission === "blocked") {
		user.connexion_permission = "bloqué";
		dropdownMenuContent = `
				<li><span class="dropdown-item-text text-muted">Utilisateur bloqué</span></li>
		`;
}

	row.innerHTML = `
		<td>${user.lastname} ${user.firstname}</td>
		<td>${user.email}</td>
		<td>${user.phone}</td>
		<td>${user.connexion_permission}</td>
		<td>
			<div class="dropdown">
				<button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
					Choisir une action
				</button>
				<ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
					${dropdownMenuContent}
				</ul>
			</div>
		</td>
	`;

	const userType = localStorage.getItem("name_permission");
	if (userType === "admin" && user.connexion_permission !== "declined" && user.connexion_permission !== "bloqué") {
		row.querySelector(".dropdown-menu").innerHTML += `
			<li><button class="dropdown-item admin-action" data-user-id="${user.id_user}">Bloquer cet utilisateur</button></li>
		`;
	}
	return row;
}

document.addEventListener("click", function (event) {
	if (event.target.classList.contains("admin-action")) {
		const userId = event.target.getAttribute("data-user-id");
		console.log("Admin action for user ID:", userId);
		openBlockUserModal(userId);
	}
});

function openBlockUserModal(userId) {
	const blockUserModal = new Modal(document.getElementById("blockUserModal"));
	const confirmBlockUserButton = document.getElementById("confirmBlockUser");

	confirmBlockUserButton.setAttribute("data-user-id", userId);
	blockUserModal.show();

	confirmBlockUserButton.addEventListener("click", async () => {
			try {
					await apiUsers.updateUserStatus(userId, "blocked");
					alert("L'utilisateur a été bloqué.");
					blockUserModal.hide();

					// Обновляем статус пользователя в таблице
					const userRow = document.querySelector(`button[data-user-id='${userId}']`).closest("tr");
					userRow.querySelector("td:nth-child(4)").textContent = "blocked";

					// Убираем кнопку блокировки
					const actionDropdown = userRow.querySelector(".dropdown-menu");
					const blockButton = actionDropdown.querySelector(".admin-action");
					if (blockButton) {
							blockButton.remove();
					}
			} catch (error) {
					console.error("Ошибка при блокировке пользователя:", error);
					alert("Ошибка при блокировке пользователя: " + error.message);
			}
	});
}


function populateTables(pendingUsers, studentTables, teacherTable) {
	pendingUsers.forEach((user) => {
		const row = createRow(user);
		if (user.id_permission === "teacher") {
			teacherTable.appendChild(row);
		} else {
			const faculty = user.faculty;
			if (studentTables[faculty]) {
				studentTables[faculty].appendChild(row);
			} else {
				console.warn("No table found for faculty:", faculty);
			}
		}
	});
}

function attachEventHandlers(apiAuth) {
	const authorizationClientModal = new Modal(
		document.getElementById("authorizationClientModal")
	);

	const detailsClientModal = new Modal(
		document.getElementById("detailsClientModal")
	);

	let currentPage = 1;
	const itemsPerPage = 3;
	let rentals = [];

	function renderPage(page) {
		const modalBody = document.querySelector("#detailsClientModal .modal-body");
		modalBody.innerHTML = ""; // Очищаем содержимое модального окна

		const startIndex = (page - 1) * itemsPerPage;
		const endIndex = startIndex + itemsPerPage;
		const pageItems = rentals.slice(startIndex, endIndex);

		pageItems.forEach((rental) => {
			const rentalCard = document.createElement("div");
			rentalCard.className = "card mb-3";
			rentalCard.innerHTML = `
				<div class="card-body">
					<h5 class="card-title">Équipement: ${rental.model_name || "N/A"}</h5>
					<p class="card-text"><strong>Date de prise:</strong> ${
						rental.date_start || "N/A"
					}</p>
					<p class="card-text"><strong>Date de restitution:</strong> ${
						rental.date_end || "N/A"
					}</p>
					<p class="card-text"><strong>Date de retour du matériel:</strong> ${
						rental.return_date || "inconnue à ce jour"
					}</p>
					<p class="card-text"><strong>État du matériel rendu:</strong> ${
						rental.status_name || "N/A"
					}</p>
				</div>
			`;
			modalBody.appendChild(rentalCard);
		});

		const pagination = document.createElement("div");
		pagination.className = "d-flex justify-content-between mt-3";

		const prevButton = document.createElement("button");
		prevButton.className = "btn btn-secondary";
		prevButton.textContent = "Previous";
		prevButton.disabled = currentPage === 1;
		prevButton.addEventListener("click", () => {
			if (currentPage > 1) {
				currentPage--;
				renderPage(currentPage);
			}
		});

		const nextButton = document.createElement("button");
		nextButton.className = "btn btn-secondary";
		nextButton.textContent = "Next";
		nextButton.disabled = endIndex >= rentals.length;
		nextButton.addEventListener("click", () => {
			if (endIndex < rentals.length) {
				currentPage++;
				renderPage(currentPage);
			}
		});

		pagination.appendChild(prevButton);
		pagination.appendChild(nextButton);
		modalBody.appendChild(pagination);
	}

	document.querySelectorAll(".view-details").forEach((link) => {
		link.addEventListener("click", async function (event) {
			event.preventDefault();
			const userId = this.getAttribute("data-user-id");
			const targetModal = this.getAttribute("data-bs-target");

			if (targetModal === "#authorizationClientModal") {
				document
					.getElementById("approveUser")
					.setAttribute("data-user-id", userId);
				document
					.getElementById("declineUser")
					.setAttribute("data-user-id", userId);
				authorizationClientModal.show();
			} else if (targetModal === "#detailsClientModal") {
				try {
					rentals = await apiRental.getClientRentalsByUserId(userId);
					console.log("Rentals:", rentals);

					if (rentals.length > 0) {
						currentPage = 1;
						renderPage(currentPage);
					} else {
						const modalBody = document.querySelector(
							"#detailsClientModal .modal-body"
						);
						modalBody.innerHTML =
							'<p class="text-muted">Aucune donnée de location disponible.</p>';
					}

					detailsClientModal.show();
				} catch (error) {
					console.error("Error fetching user rentals:", error);
					alert("Error fetching user rentals: " + error.message);
				}
			}
		});
	});

	document
		.getElementById("approveUser")
		.addEventListener("click", async function () {
			const userId = this.getAttribute("data-user-id");
			console.log("userId", userId);
			try {
				const response = await apiAuth.updateUserStatus(
					userId,
					"authorized",
					"1"
				);
				console.log("API Response:", response);
				alert("User status updated successfully.");
				authorizationClientModal.hide();
				location.reload();
			} catch (error) {
				console.error("Error updating user status:", error);
				alert("Error updating user status: " + error.message);
			}
		});

	document
		.getElementById("declineUser")
		.addEventListener("click", async function () {
			const userId = this.getAttribute("data-user-id");
			try {
				const response = await apiAuth.updateUserStatus(
					userId,
					"declined",
					"0"
				);
				console.log("API Response:", response);
				alert("User status updated successfully.");
				authorizationClientModal.hide();
				location.reload();
			} catch (error) {
				console.error("Error updating user status:", error);
				alert("Error updating user status: " + error.message);
			}
		});
}

let allUsers = [];

async function init() {
	const apiAuth = ApiAuth.getInstance();

	try {
			await apiAuth.fetchMeAuthUser();
			const pendingUsers = await fetchPendingUsers(apiAuth);
			const processedUsers = await fetchProcessedUsers(apiAuth); // Получение обработанных пользователей

			// Сохраняем всех пользователей в одной переменной, если они существуют
			if (pendingUsers && pendingUsers.length > 0) {
					allUsers = [...pendingUsers];
			}
			if (processedUsers && processedUsers.length > 0) {
					allUsers = [...allUsers, ...processedUsers];
			}

			const studentTables = {
					development: document.querySelector("#devInfoTable tbody"),
					cybersecurity: document.querySelector("#sysReseauTable tbody"),
					marketing: document.querySelector("#comMarketingTable tbody"),
			};

			const teacherTable = document.querySelector("#teachersTable tbody");

			// Очищаем существующие строки в таблицах
			Object.values(studentTables).forEach((table) => {
					if (table) {
							table.innerHTML = "";
					} else {
							console.warn("Table not found");
					}
			});
			if (teacherTable) {
					teacherTable.innerHTML = "";
			} else {
					console.warn("Teacher table not found");
			}

			// Заполняем таблицы
			populateTables(allUsers, studentTables, teacherTable);

			attachEventHandlers(apiAuth);
	} catch (error) {
			console.error("Initialization error:", error);
	}
}

function searchUsers(searchTerm) {
	const filteredUsers = allUsers.filter(user => {
			return (
					user.lastname.toLowerCase().includes(searchTerm) ||
					user.firstname.toLowerCase().includes(searchTerm) ||
					user.email.toLowerCase().includes(searchTerm) ||
					user.phone.toLowerCase().includes(searchTerm) ||
					user.connexion_permission.toLowerCase().includes(searchTerm)
			);
	});

	const studentTables = {
			development: document.querySelector("#devInfoTable tbody"),
			cybersecurity: document.querySelector("#sysReseauTable tbody"),
			marketing: document.querySelector("#comMarketingTable tbody"),
	};

	const teacherTable = document.querySelector("#teachersTable tbody");

	// Очищаем существующие строки в таблицах
	Object.values(studentTables).forEach((table) => {
			if (table) {
					table.innerHTML = "";
			} else {
					console.warn("Table not found");
			}
	});
	if (teacherTable) {
			teacherTable.innerHTML = "";
	} else {
			console.warn("Teacher table not found");
	}

	if (filteredUsers && filteredUsers.length > 0) {
			console.log("Filtered Users:", filteredUsers);
			populateTables(filteredUsers, studentTables, teacherTable);
	} else {
			console.log("No users found for the search term.");
	}
}

init();

const dropdownElementList = [].slice.call(
	document.querySelectorAll(".dropdown-toggle")
);
const dropdownList = dropdownElementList.map(function (dropdownToggleEl) {
	return new Dropdown(dropdownToggleEl);
});

const logoutButton = document.getElementById("logoutButton");

if (logoutButton) {
	logoutButton.addEventListener("click", function (event) {
		event.preventDefault();
		logout();
	});
}

function logout() {
	// Удаляем данные аутентификации из localStorage
	localStorage.removeItem("authToken");
	localStorage.removeItem("id_user");

	// Перенаправляем пользователя на корневую страницу сайта
	window.location.href = "/"; // Перенаправить на корневую страницу
}
