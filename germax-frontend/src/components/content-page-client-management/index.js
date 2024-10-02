import "./index.css";
import Dropdown from "bootstrap/js/dist/dropdown";
import Modal from "bootstrap/js/dist/modal";
import Tab from "bootstrap/js/dist/tab";
import { ApiAuth } from "../../utils/classes/api-auth";
import { ApiRental } from "../../utils/classes/api-rental";
import { ApiUsers } from "../../utils/classes/api-users";

const userType = localStorage.getItem("name_permission");
if (userType === "admin") {
	document.getElementById("managers-tab").style.display = "block";
	document.getElementById("stockman-tab").style.display = "block";
}

const apiAuth = ApiAuth.getInstance();
const apiRental = new ApiRental();
const apiUsers = new ApiUsers();

const backArrowContainer = document.getElementById("backArrowContainer");

if (backArrowContainer) {
	const backArrow = document.createElement("a");
	backArrow.href = "javascript:history.back()";
	backArrow.className = "back-arrow";
	backArrow.innerHTML =
		'<i class="fas fa-arrow-left"></i> Retour à la page d\'accueil';
	backArrowContainer.appendChild(backArrow);
} else {
	console.error("Контейнер 'backArrowContainer' не найден.");
}

document
    .getElementById("userSearchInput")
    .addEventListener("input", function (event) {
        const searchTerm = event.target.value.toLowerCase();
        searchUsers(searchTerm);

        if (searchTerm === "") {
            resetTables();
        }
    });

async function fetchPendingUsers(apiAuth) {
	try {
		const pendingUsers = await apiAuth.getPendingUsers();
		return pendingUsers;
	} catch (error) {
		console.error("Error fetching pending users:", error);
		throw error;
	}
}

async function fetchProcessedUsers(apiAuth) {
	try {
		const processedUsers = await apiAuth.getProcessedUsers();
		return processedUsers;
	} catch (error) {
		console.error("Error fetching processed users:", error);
		throw error;
	}
}

function createRow(user) {
	const row = document.createElement("tr");
	let dropdownMenuContent;
	let connexionPermissionText = user.connexion_permission;
	if (user.connexion_permission === "pending") {
		connexionPermissionText = "validation en cours";
		dropdownMenuContent = `
			<li><a class="dropdown-item view-details" href="#" data-bs-toggle="modal" data-bs-target="#authorizationClientModal" data-user-id="${user.id_user}">Gérer la réponse</a></li>
		`;
	} else if (user.connexion_permission === "authorized") {
		connexionPermissionText = "utilisateur authorisé";
		dropdownMenuContent = `
			<li><a class="dropdown-item view-details" href="#" data-bs-toggle="modal" data-bs-target="#detailsClientModal" data-user-id="${user.id_user}">Voir les détails</a></li>
		`;
	} else if (user.connexion_permission === "declined") {
		connexionPermissionText = "demande d'inscription refusée";
		dropdownMenuContent = `
			<li><span class="dropdown-item-text text-muted">Utilisateur refusé</span></li>
		`;
	} else if (user.connexion_permission === "blocked") {
		connexionPermissionText = "bloqué";
		dropdownMenuContent = `
				<li><span class="dropdown-item-text text-muted">Utilisateur bloqué</span></li>
		`;
	}

	row.innerHTML = `
		<td>${user.lastname} ${user.firstname}</td>
		<td>${user.email}</td>
		<td>${user.phone}</td>
		<td>${connexionPermissionText}</td>
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
	if (
		userType === "admin" &&
		user.connexion_permission !== "declined" &&
		user.connexion_permission !== "bloqué"
	) {
		row.querySelector(".dropdown-menu").innerHTML += `
			<li><button class="dropdown-item admin-action" data-user-id="${user.id_user}">Bloquer cet utilisateur</button></li>
		`;
	}
	return row;
}

document.addEventListener("click", function (event) {
	if (event.target.classList.contains("admin-action")) {
		const userId = event.target.getAttribute("data-user-id");
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
			const userRow = document
				.querySelector(`button[data-user-id='${userId}']`)
				.closest("tr");
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

function populateTables(
	pendingUsers,
	studentTables,
	teacherTable,
	managerTable,
	stockmanTable
) {
	pendingUsers.forEach((user) => {
		const row = createRow(user);
		if (user.id_permission === 2) {
			teacherTable.appendChild(row);
		} else if (user.id_permission === 3 && managerTable) {
			managerTable.appendChild(row);
		} else if (user.id_permission === 4 && stockmanTable) {
			stockmanTable.appendChild(row);
		} else {
			const faculty = user.faculty;
			if (faculty !== "default" && studentTables[faculty]) {
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

			const userData = {
				id_user: userId,
				connexion_permission: "authorized",
				authorization_permission: "1",
			};

			try {
				const response = await apiUsers.updateUser(userData);
				alert("L'utilisateur est ajouté avec succès");
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
				const response = await apiUsers.updateUserStatus(
					userId,
					"declined",
					"0"
				);
				alert("La demande a été refusée.");
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
			"cyber-security": document.querySelector("#sysReseauTable tbody"),
			"digital-marketing": document.querySelector("#comMarketingTable tbody"),
		};

		const teacherTable = document.querySelector("#teachersTable tbody");
		let managerTable, stockmanTable;

		if (userType === "admin") {
			managerTable = document.querySelector("#managersTable tbody");
			stockmanTable = document.querySelector("#stockmanTable tbody");
		}

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
		if (managerTable) {
			managerTable.innerHTML = "";
		} else {
			console.warn("Manager table not found");
		}
		if (stockmanTable) {
			stockmanTable.innerHTML = "";
		} else {
			console.warn("Stockman table not found");
		}

		// Заполняем таблицы
		populateTables(
			allUsers,
			studentTables,
			teacherTable,
			managerTable,
			stockmanTable
		);

		attachEventHandlers(apiAuth);
		resetTables();
	} catch (error) {
		console.error("Initialization error:", error);
	}
}

function searchUsers(searchTerm) {
	const filteredUsers = allUsers.filter((user) => {
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
		"digital-marketing": document.querySelector("#comMarketingTable tbody"),
	};

	const teacherTable = document.querySelector("#teachersTable tbody");
	const managerTable = document.querySelector("#managersTable tbody");
	const stockmanTable = document.querySelector("#stockmanTable tbody");

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
	if (managerTable) {
		managerTable.innerHTML = "";
	} else {
		console.warn("Manager table not found");
	}
	if (stockmanTable) {
		stockmanTable.innerHTML = "";
	} else {
		console.warn("Stockman table not found");
	}

	if (filteredUsers && filteredUsers.length > 0) {
		populateTables(
			filteredUsers,
			studentTables,
			teacherTable,
			managerTable,
			stockmanTable
		);
		filteredUsers.forEach((user) => {
			if (user.id_permission === 2) {
				showTab("teachers-tab", "teachers");
			} else if (user.id_permission === 3) {
				showTab("managers-tab", "managers");
			} else if (user.id_permission === 4) {
				showTab("stockman-tab", "stockman");
			} else {
				showTab("students-tab", "students");
				showTab("devInfo-tab", "devInfo");
			}
		});
	} else {
		resetTables();
	}
}

function resetTables() {
	// Восстанавливаем первоначальный вид таблиц и вкладок
	const studentTables = {
			development: document.querySelector("#devInfoTable tbody"),
			"cyber-security": document.querySelector("#sysReseauTable tbody"),
			"digital-marketing": document.querySelector("#comMarketingTable tbody"),
	};

	const teacherTable = document.querySelector("#teachersTable tbody");
	const managerTable = document.querySelector("#managersTable tbody");
	const stockmanTable = document.querySelector("#stockmanTable tbody");

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
	if (managerTable) {
			managerTable.innerHTML = "";
	} else {
			console.warn("Manager table not found");
	}
	if (stockmanTable) {
			stockmanTable.innerHTML = "";
	} else {
			console.warn("Stockman table not found");
	}

	// Заполняем таблицы всеми пользователями
	populateTables(
			allUsers,
			studentTables,
			teacherTable,
			managerTable,
			stockmanTable
	);

	// Переинициализация вкладок для предотвращения непредвиденного поведения
	const mainTabs = document.querySelectorAll('#myTab .nav-link');
	mainTabs.forEach(tab => tab.classList.remove('active'));
	const mainTabContents = document.querySelectorAll('.tab-content .tab-pane');
	mainTabContents.forEach(content => content.classList.remove('show', 'active'));

	// Отображаем вкладку "Étudiants Développement Informatique"
	document.getElementById("students-tab").classList.add('active');
	document.getElementById("students").classList.add('show', 'active');

	const devInfoTabs = document.querySelectorAll('#students .nav-link');
	devInfoTabs.forEach(tab => tab.classList.remove('active'));
	const devInfoTabContents = document.querySelectorAll('#students .tab-pane');
	devInfoTabContents.forEach(content => content.classList.remove('show', 'active'));

	document.getElementById("devInfo-tab").classList.add('active');
	document.getElementById("devInfo").classList.add('show', 'active');
}



function showTab(tabId, tabContentId) {
	const tabElement = new Tab(document.getElementById(tabId));
	tabElement.show();
	const tabContentElement = document.getElementById(tabContentId);
	if (tabContentElement) {
		tabContentElement.classList.add("show", "active");
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
