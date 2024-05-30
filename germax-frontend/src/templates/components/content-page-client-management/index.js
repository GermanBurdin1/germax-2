import "./index.css";
import Dropdown from "bootstrap/js/dist/dropdown";
import Modal from "bootstrap/js/dist/modal";
import Tab from "bootstrap/js/dist/tab";
import { ApiAuth } from "../../../utils/classes/api-auth";
import { ApiRental } from "../../../utils/classes/api-rental";

const apiAuth = ApiAuth.getInstance();
const apiRental = new ApiRental();

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
	console.log("Created row HTML:", row.innerHTML); // Debugging output
	return row;
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
					const rentals = await apiRental.getClientRentalsByUserId(userId);
					console.log("Rentals:", rentals);
					const rentalDetails = rentals.length > 0 ? rentals[0] : null;
					if (rentalDetails) {
						document.getElementById("equipementLoué").textContent =
							rentalDetails.model_name || "N/A";
						document.getElementById("dateDePrise").textContent =
							rentalDetails.date_start || "N/A";
						document.getElementById("dateDeRestitution").textContent =
							rentalDetails.date_end || "N/A";
						document.getElementById("etatDuMaterielRendu").textContent =
							rentalDetails.status_name || "N/A";
					} else {
						document.getElementById("equipementLoué").textContent = "N/A";
						document.getElementById("dateDePrise").textContent = "N/A";
						document.getElementById("dateDeRestitution").textContent = "N/A";
						document.getElementById("etatDuMaterielRendu").textContent = "N/A";
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

async function init() {
	const apiAuth = ApiAuth.getInstance();

	try {
		await apiAuth.fetchMeAuthUser();
		const pendingUsers = await fetchPendingUsers(apiAuth);
		const processedUsers = await fetchProcessedUsers(apiAuth); // Получение обработанных пользователей

		const studentTables = {
			development: document.querySelector("#devInfoTable tbody"),
			cybersecurity: document.querySelector("#sysReseauTable tbody"),
			marketing: document.querySelector("#comMarketingTable tbody"),
		};

		const teacherTable = document.querySelector("#teachersTable tbody");

		// Проверка наличия таблиц
		console.log("Student Tables:", studentTables);
		console.log("Teacher Table:", teacherTable);

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

		if (pendingUsers && pendingUsers.length > 0) {
			console.log("Pending Users:", pendingUsers);
			populateTables(pendingUsers, studentTables, teacherTable);
		} else {
			console.log("No pending users found.");
		}

		if (processedUsers && processedUsers.length > 0) {
			console.log("Processed Users:", processedUsers);
			populateTables(processedUsers, studentTables, teacherTable);
		} else {
			console.log("No processed users found.");
		}

		attachEventHandlers(apiAuth);
	} catch (error) {
		console.error("Initialization error:", error);
	}
}

init();

const dropdownElementList = [].slice.call(
	document.querySelectorAll(".dropdown-toggle")
);
const dropdownList = dropdownElementList.map(function (dropdownToggleEl) {
	return new Dropdown(dropdownToggleEl);
});

