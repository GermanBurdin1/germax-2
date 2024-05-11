import { Dropdown } from "bootstrap";
import { Modal } from "bootstrap";
import { returnAdminNotificationsModal } from "../../../utils/dashboard/data/manager/updates";
import { returnClientLoans,
  returnRentalHistoryLoans } from "../../../utils/dashboard/loans";
import "./index.css";

// получить данные которые были отправлены на странице
function refreshRentals() {
	fetch("http://germax-api/rental", {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
		},
	})
		.then((response) => response.json())
		.then((data) => {
			if (data.success) {
				console.log(data.data);
				updateBookingsTable(data.data);
			} else {
				console.error("Failed to fetch data");
			}
		})
		.catch((error) => console.error("Error:", error));
}

function updateBookingsTable(rentals) {
	const tbody = document
		.getElementById("booking-table")
		.getElementsByTagName("tbody")[0];
	tbody.innerHTML = ""; // Очистить текущие строки таблицы
	rentals.forEach((rental) => {
		const row = tbody.insertRow();
		row.innerHTML = `<td>${rental.id_good}</td>
			<td>${rental.user_name} ${rental.user_surname}</td>
			<td>${rental.model_name}</td>
			<td>1</td>
			<td>${rental.date_start}-${rental.date_end}</td>
			<td>${rental.comment}</td>
			<td>${getStatusName(rental.id_status)}</td>
			<td>
                <div class="dropdown">
                    <button class="btn btn-secondary dropdown-toggle" type="button" id="actionMenu${
											rental.id_good
										}"
                        data-bs-toggle="dropdown" aria-expanded="false">
                        Choisir une action
                    </button>
                    <ul class="dropdown-menu" aria-labelledby="actionMenu${
											rental.id_good
										}">
                        <li><a class="dropdown-item" href="#">Voir l'équipement</a></li>
                        <li><a class="dropdown-item" href="#">Voir le locataire</a></li>
                        <li><a class="dropdown-item manage-rental" href="#">Gérer la location</a></li>
                    </ul>
                </div>
            </td>`;
		const manageLinks = row.querySelectorAll(".manage-rental"); // Уточняем селектор, чтобы выбрать только нужную ссылку
		manageLinks.forEach((link) => {
			link.addEventListener("click", function (event) {
				console.log("вызов функции")
				event.preventDefault(); // Предотвратить действие по умолчанию для ссылки
				const modal = new Modal(
					document.getElementById("rentalManagementModal"),
					{}
				);
				document.getElementById("approveRentalButton").setAttribute("data-id", rental.id_good);
        document.getElementById("cancelRentalButton").setAttribute("data-id", rental.id_good);
				modal.show();
			});
		});
	});
}

function getStatusName(statusId) {
	switch (statusId) {
		case 4:
			return "Pending";
		default:
			return "Unknown";
	}
}

document.addEventListener("DOMContentLoaded", function () {
	refreshRentals();
});

document.getElementById("approveRentalButton").addEventListener("click", function() {
	const rentalId = this.getAttribute("data-id");
	approveRental(rentalId);
});

document.getElementById("cancelRentalButton").addEventListener("click", function() {
	const rentalId = this.getAttribute("data-id");
	cancelRental(rentalId);
});

function approveRental(loanId) {
  const url = "http://germax-api/rental";  // URL, который обрабатывает подтверждение аренды
  const data = {
		action: "approve",
    loanId: loanId,
  };

  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data)
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      console.log("Rental approved successfully.");
      // Обновите интерфейс или уведомите пользователя об успешном одобрении
    } else {
      console.error("Failed to approve rental.");
      // Обработка ошибок сервера или сообщения об ошибке
    }
  })
  .catch(error => {
    console.error("Error:", error);
  });
}

function cancelRental(loanId) {
  const url = "http://germax-api/rental";  // URL, который обрабатывает отмену аренды
  const data = {
		action: "cancel",
    loanId: loanId,
  };

  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data)
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      console.log("Rental canceled successfully.");
      // Обновите интерфейс или уведомите пользователя об успешной отмене
    } else {
      console.error("Failed to cancel rental.");
      // Обработка ошибок сервера или сообщения об ошибке
    }
  })
  .catch(error => {
    console.error("Error:", error);
  });
}


// Обработчик отправки сообщения об аннулировании аренды
document.getElementById("communicationForm").addEventListener("submit", function (event) {
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
  const notificationsModal = new Modal(document.getElementById("notificationsModal"), {});
  notificationsModal.show();
}

function updateBookingTable({ id, name, equipment, quantity, dates, comment, status }) {
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
