import { Dropdown } from "bootstrap";
import { Modal } from "bootstrap";
import "./index.css";
import { ApiRental } from "../../../utils/classes/api-rental";
import { ApiUsers } from "../../../utils/classes/api-users";

const apiRental = new ApiRental();
const apiUsers = new ApiUsers();
let currentPage = 1;
const itemsPerPage = 10;

const backArrowContainer = document.getElementById("backArrowContainer");

if (backArrowContainer) {
	console.log("Контейнер найден. Создаем кнопку 'Retour'");
	const backArrow = document.createElement("a");
	backArrow.href = "javascript:history.back()";
	backArrow.className = "back-arrow";
	backArrow.innerHTML = '<i class="fas fa-arrow-left"></i> Retour à la page d\'accueil';
	backArrowContainer.appendChild(backArrow);
} else {
	console.error("Контейнер 'backArrowContainer' не найден.");
}

document.getElementById("prevPageBtn").addEventListener("click", () => {
	console.log("клик на prevPageBtn");
	if (currentPage > 1) {
		currentPage--;
		refreshRentals();
	}
});

const nextPageBtn = document.getElementById("nextPageBtn");
nextPageBtn.addEventListener("click", () => {
	console.log("клик на nextPageBtn");
	currentPage++;
	refreshRentals();
});
// получить данные которые были отправлены на странице
async function refreshRentals() {
	try {
		const data = await apiRental.getRentals(currentPage, itemsPerPage); // Передаем параметры пагинации
		if (data) {
			console.log("data", data);
			updateBookingsTable(data.data);
			updatePaginationControls(data.totalItems);
		} else {
			console.error("Failed to fetch data");
		}
	} catch (error) {
		console.error("Error:", error);
	}
}

function updateBookingsTable(rentals) {
	const tbody = document
		.getElementById("request-bookings-table")
		.getElementsByTagName("tbody")[0];
	tbody.innerHTML = ""; // Очистить текущие строки таблицы
	rentals.forEach((rental) => {
		const row = tbody.insertRow();
		row.innerHTML = `
        <td>${rental.id_loan}</td>
				<td>${rental.id_user}</td>
        <td>${rental.user_name} ${rental.user_surname}</td>
        <td>${rental.model_name} (${rental.serial_number})</td>
        <td>${rental.date_start}-${rental.date_end}</td>
        <td>${rental.comment || "aucun commentaire"} </td>
        <td>${rental.loan_status}</td>
        <td>bon état</td>
        <td>
            <div class="dropdown">
                <button class="btn btn-secondary dropdown-toggle" type="button" id="actionMenu${
									rental.id_good
								}" data-bs-toggle="dropdown" aria-expanded="false">
                    Choisir une action
                </button>
                <ul class="dropdown-menu" aria-labelledby="actionMenu${
									rental.id_good
								}">
                    ${
											rental.loan_status === "loaned"
												? `
                        <li><a class="dropdown-item info_client" href="#" data-user-id="${rental.id_user}">Voir l'utilisateur</a></li>
                    `
												: rental.loan_status === "loan_request"
												? `
                        <li><a class="dropdown-item manage-rental" href="#">Gérer la location</a></li>
                    `
												: ""
										}
                </ul>
            </div>
        </td>`;
		const manageLinks = row.querySelectorAll(".manage-rental"); // Уточняем селектор, чтобы выбрать только нужную ссылку
		const infoLinks = row.querySelectorAll(".info_client");

		manageLinks.forEach((link) => {
			link.addEventListener("click", function (event) {
				console.log("вызов функции");
				event.preventDefault(); // Предотвратить действие по умолчанию для ссылки
				const modal = new Modal(
					document.getElementById("rentalManagementModal"),
					{}
				);
				document
					.getElementById("approveRentalButton")
					.setAttribute("data-id", rental.id_loan);
				document
					.getElementById("cancelRentalButton")
					.setAttribute("data-id", rental.id_loan);
				modal.show();
				const closeManagementRentalModalButton = document.getElementById(
					"closeManagementRentalModalButton"
				);
				console.log(
					"closeManagementRentalModalButton",
					closeManagementRentalModalButton
				);
				closeManagementRentalModalButton.addEventListener(
					"click",
					function (event) {
						event.preventDefault();
						modal.hide();
					}
				);
			});
		});

		infoLinks.forEach((link) => {
			link.addEventListener("click", async function (event) {
				event.preventDefault(); // Предотвратить действие по умолчанию для ссылки
				const userId = event.target.getAttribute("data-user-id");
				const userInfo = await apiUsers.getUserInformationById(userId);
				displayUserInfoInModal(userInfo);
				const modal = new Modal(document.getElementById("infoClientModal"), {});
				modal.show();
				const closeButton = document.getElementById("closeClientModal");
				closeButton.addEventListener("click", function (event) {
					event.preventDefault();
					modal.hide();
				});
			});
		});
	});
}

function displayUserInfoInModal(userInfo) {
	const modalBody = document.querySelector("#infoClientModal .modal-body");
	modalBody.innerHTML = `
        <div>
            <img src="${
							userInfo.picture || "placeholder.jpg"
						}" alt="User Picture" style="width: 100px; height: 100px;">
            <p><strong>Email:</strong> ${userInfo.email}</p>
            <p><strong>Phone:</strong> ${userInfo.phone}</p>
            <h5>Rental History:</h5>
            <ul>
                ${userInfo.rentals
									.map(
										(rental) => `
                    <li>
                        <p><strong>Dates:</strong> ${rental.date_start} - ${
											rental.date_end
										}</p>
                        <p><strong>Return Date:</strong> ${
													rental.return_date || "N/A"
												}</p>
                        <p><strong>Status:</strong> ${rental.loan_status}</p>
                        <p><strong>State:</strong> ${rental.state}</p>
                    </li>
                `
									)
									.join("")}
            </ul>
        </div>
    `;
}

function getStatusName(statusId) {
	switch (statusId) {
		case 1:
			return "disponible";
		case 2:
			return "indisponible";
		case 3:
			return "réservé";
		case 4:
			return "demande de réservation";
		case 5:
			return "annulé";
		default:
			return "Unknown";
	}
}

refreshRentals();

document
	.getElementById("approveRentalButton")
	.addEventListener("click", function () {
		const rentalId = this.getAttribute("data-id");
		console.log("rentalId", rentalId);
		approveRental(rentalId);
	});

document
	.getElementById("cancelRentalButton")
	.addEventListener("click", function () {
		const rentalId = this.getAttribute("data-id");
		cancelRental(rentalId);
	});

function approveRental(loanId) {
	console.log("сработала approveRental", loanId);
	apiRental
		.approveRental(loanId)
		.then((data) => {
			console.log("data какая пришла", data);
			if (data.success) {
				// Обновите интерфейс или уведомите пользователя об успешном одобрении
			} else {
				console.error("Failed to approve rental.");
				// Обработка ошибок сервера или сообщения об ошибке
			}
		})
		.catch((error) => {
			console.error("Error in approveRental:", error);
		});
}

function cancelRental(loanId) {
	const url = "http://germax-api/rental"; // URL, который обрабатывает отмену аренды
	const data = {
		action: "cancel",
		loanId: loanId,
	};

	fetch(url, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(data),
	})
		.then((response) => response.json())
		.then((data) => {
			if (data.success) {
				console.log("Rental canceled successfully.");
				// Обновите интерфейс или уведомите пользователя об успешной отмене
			} else {
				console.error("Failed to cancel rental.");
				// Обработка ошибок сервера или сообщения об ошибке
			}
		})
		.catch((error) => {
			console.error("Error:", error);
		});
}

// Обработчик отправки сообщения об аннулировании аренды
document
	.getElementById("communicationForm")
	.addEventListener("submit", function (event) {
		event.preventDefault();

		const topic = document.getElementById("communicationTopicSelect").value;
		const message = document.getElementById("communicationMessageText").value;

		const notification = createNotification({
			title: `Annulation de réservation`,
			message: `Sujet: ${topic}, Message: ${message}`,
			linkText: "Gestion des locations",
			linkHref: "/page-bookings-management",
		});

		appendNotification(notification);
		showNotificationModal();
	});

function createNotification({ title, message, linkText, linkHref }) {
	return `
    <a href="${linkHref}" class="list-group-item list-group-item-action flex-column align-items-start">
      <div class="d-flex w-100 justify-content-between">
        <h5 class="mb-1">${title}</h5>
      </div>
      <p class="mb-1">${message}</p>
      <small class="text-muted">${new Date().toLocaleString()}</small>
    </a>
  `;
}

function appendNotification(notification) {
	const notificationsList = document.getElementById("notificationsList");
	notificationsList.innerHTML += notification;
}

function showNotificationModal() {
	const notificationsModal = new Modal(
		document.getElementById("notificationsModal"),
		{}
	);
	notificationsModal.show();
}

function updateBookingTable({
	id,
	name,
	equipment,
	quantity,
	dates,
	comment,
	status,
}) {
	const bookingTableBody = document.querySelector("#booking-table tbody");
	bookingTableBody.innerHTML += `
    <tr data-booking-id="${id}">
      <td>${id}</td>
      <td>${name}</td>
      <td>${equipment}</td>
      <td>${quantity}</td>
      <td>${dates}</td>
      <td>${comment}</td>
      <td>${status}</td>
      <td>
        <div class="dropdown">
          <button class="btn btn-secondary dropdown-toggle" type="button" id="actionMenu${id}"
            data-bs-toggle="dropdown" aria-expanded="false">
            Choisir une action
          </button>
          <ul class="dropdown-menu" aria-labelledby="actionMenu${id}">
            <li><a class="dropdown-item" href="#">Voir l'équipement</a></li>
            <li><a class="dropdown-item" href="#">Voir le locataire</a></li>
            <li><a class="dropdown-item" href="#">Gérer la location</a></li>
          </ul>
        </div>
      </td>
    </tr>
  `;
}

document.addEventListener("click", function (event) {
	const target = event.target.closest("a");
	if (!target) return;

	const targetId = target.id;
	const bookingLink = document.getElementById("bookingsLink");

	if (targetId === "cancelRentalButton") {
		event.preventDefault();

		updateBookingTable({
			id: "4",
			name: "Test User",
			equipment: "Ordinateur portable",
			quantity: 1,
			dates: "Date1",
			comment: "Annulation de la réservation",
			status: "Annulé",
		});
	}
});

function updatePaginationControls(totalItems) {
	const totalPages = Math.ceil(totalItems / itemsPerPage);
	document.getElementById(
		"pageInfo"
	).textContent = `Page ${currentPage} of ${totalPages}`;
	document.getElementById("prevPageBtn").disabled = currentPage === 1;
	document.getElementById("nextPageBtn").disabled = currentPage === totalPages;
}


