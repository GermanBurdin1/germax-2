import './index.css';
import Dropdown from "bootstrap/js/dist/dropdown";
import Modal from "bootstrap/js/dist/modal";
import Tab from "bootstrap/js/dist/tab";
import { ApiAuth } from '../../../utils/classes/api-auth';

async function fetchPendingUsers(apiAuth) {
	try {
		const pendingUsers = await apiAuth.getPendingUsers();
		return pendingUsers;
	} catch (error) {
		console.error('Error fetching pending users:', error);
		throw error;
	}
}

function createRow(user) {
	const row = document.createElement('tr');
	row.innerHTML = `
		<td>${user.lastname} ${user.firstname}</td>
		<td>${user.email}</td>
		<td>${user.phone}</td>
		<td>—</td> <!-- Dernier équipement loué -->
		<td>—</td> <!-- Date de prise -->
		<td>—</td> <!-- Date de restitution -->
		<td>—</td> <!-- État du matériel rendu -->
		<td>${user.connexion_permission}</td>
		<td>
			<button class="btn btn-success validate-user" data-id="${user.id_user}">Gérer l'inscription</button>
			<button class="btn btn-danger decline-user" data-id="${user.id_user}">Refuser</button>
		</td>
	`;
	return row;
}

function populateTables(pendingUsers, studentTables, teacherTable) {
	pendingUsers.forEach(user => {
		const row = createRow(user);
		if (user.id_permission === 'teacher') {
			teacherTable.appendChild(row);
		} else {
			const faculty = user.faculty;
			if (studentTables[faculty]) {
				studentTables[faculty].appendChild(row);
			}
		}
	});
}

function attachEventHandlers(apiAuth) {
	document.querySelectorAll('.validate-user').forEach(button => {
		button.addEventListener('click', async function () {
			const userId = this.getAttribute('data-id');
			try {
				await apiAuth.updateUserStatus(userId, 'authorized');
				alert('User status updated successfully.');
				location.reload(); // Перезагрузить страницу для обновления данных
			} catch (error) {
				alert('Error updating user status: ' + error);
			}
		});
	});

	document.querySelectorAll('.decline-user').forEach(button => {
		button.addEventListener('click', async function () {
			const userId = this.getAttribute('data-id');
			try {
				await apiAuth.updateUserStatus(userId, 'declined');
				alert('User status updated successfully.');
				location.reload(); // Перезагрузить страницу для обновления данных
			} catch (error) {
				alert('Error updating user status: ' + error);
			}
		});
	});
}

async function init() {
	const apiAuth = ApiAuth.getInstance();

	const studentTables = {
		'Développement informatique': document.querySelector("#devInfoTable tbody"),
		'Systèmes, réseaux et cybersécurité': document.querySelector("#sysReseauTable tbody"),
		'Commerce et Marketing digital': document.querySelector("#comMarketingTable tbody")
	};

	const teacherTable = document.querySelector("#teachersTable tbody");

	// Очищаем существующие строки в таблицах
	Object.values(studentTables).forEach(table => table.innerHTML = '');
	teacherTable.innerHTML = '';

	try {
		const pendingUsers = await fetchPendingUsers(apiAuth);
		populateTables(pendingUsers, studentTables, teacherTable);
		attachEventHandlers(apiAuth);
	} catch (error) {
		console.error('Initialization error:', error);
	}
}

init();

const dropdownElementList = [].slice.call(
	document.querySelectorAll(".dropdown-toggle")
);
const dropdownList = dropdownElementList.map(function (dropdownToggleEl) {
	return new Dropdown(dropdownToggleEl);
});

document.addEventListener("DOMContentLoaded", function () {
	// Инициализация модального окна
	const detailsModal = new Modal(document.getElementById("detailsClientModal"));

	// Обработка кликов по ссылкам для просмотра деталей
	document.querySelectorAll(".view-details").forEach((link) => {
			link.addEventListener("click", function (event) {
					event.preventDefault();

					// Заполнение модального окна данными
					const modalBody = document.querySelector("#detailsClientModal .modal-body");
					modalBody.innerHTML = `
							<div class="container pt-5">
									<div class="row justify-content-center">
											<div class="col-md-8">
													<div class="card mb-5">
															<div class="card-body p-5">
																	<div class="row">
																			<div class="col-md-8">
																					<h2 class="card-title mb-4">Informations du client</h2>
																					<p class="text-muted">Coordonnées: +33 1 23 45 67 89</p>
																					<p class="text-muted">Email: jean.dupont@example.com</p>
																					<p class="text-muted">Adresse: 123, rue de la République, Paris</p>
																					<a href="./modifyInfoClient.html" class="btn btn-primary mt-3">Mettre à jour</a>
																					<hr class="my-4">
																					<h4 class="mb-3">Détails de la location:</h4>
																					<p class="mb-2">Équipement loué: Appareil photo professionnel</p>
																					<p class="mb-2">Modèle: Canon EOS R5</p>
																					<p class="mb-2">Début de location: 01/07/2024</p>
																					<p class="mb-2">Fin de location: 31/07/2024</p>
																					<p class="mb-2">Temps restant: <strong>3 jours</strong></p>
																					<p class="mb-2">Statut de la location: <span class="badge badge-success">Active</span></p>
																					<button type="button" class="btn btn-warning mt-3">Prolonger la location</button>
																					<button type="button" class="btn btn-warning mt-3">Arrêter la location</button>
																			</div>
																			<div class="col-md-4 d-flex align-items-center justify-content-center">
																					<div class="client-photo bg-primary">
																							<i class="far fa-user"></i>
																					</div>
																			</div>
																	</div>
															</div>
													</div>
											</div>
									</div>
							</div>
					`;

					// Показываем модальное окно
					detailsModal.show();
			});
	});
});
