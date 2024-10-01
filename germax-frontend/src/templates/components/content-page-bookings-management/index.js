import { Dropdown } from "bootstrap";
import { Modal } from "bootstrap";
import "./index.css";
import { ApiRental } from "../../../utils/classes/api-rental";
import { ApiUsers } from "../../../utils/classes/api-users";
import { ApiGoods } from "../../../utils/classes/api-goods";

const apiRental = new ApiRental();
const apiUsers = new ApiUsers();
const apiGoods = new ApiGoods();
let currentPage = 1;
const itemsPerPage = 10;
let namePermission = localStorage.getItem("namePermission");

// initialiser le modal en avance
const rentalManagementModalElement = document.getElementById(
	"rentalManagementModal"
);
const rentalManagementModal = new Modal(rentalManagementModalElement);

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

document.getElementById("prevPageBtn").addEventListener("click", () => {
	if (currentPage > 1) {
		currentPage--;
		refreshRentals();
	}
});

const nextPageBtn = document.getElementById("nextPageBtn");
nextPageBtn.addEventListener("click", () => {
	currentPage++;
	refreshRentals();
});


async function refreshRentals() {
	try {
		const data = await apiRental.getRentals(currentPage, itemsPerPage);
		if (data) {
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
	tbody.innerHTML = "";
	rentals.forEach((rental) => {
		let loanStatusText;
		if (rental.loan_status === "loan_request") {
			loanStatusText = "demande de location";
		} else if (rental.loan_status === "loaned") {
			loanStatusText = "équipement loué";
		} else if (rental.loan_status === "approved") {
			loanStatusText = "demande de location approuvée";
		} else if (rental.loan_status === "cancelled") {
			loanStatusText = "Location annulée";
		} else if (rental.loan_status === "returned") {
			loanStatusText = "équipement retourné";
		} else {
			loanStatusText = rental.loan_status;
		}

		const row = tbody.insertRow();
		row.innerHTML = `
			<td>${rental.id_loan}</td>
			<td>${rental.id_user}</td>
			<td>${rental.user_name} ${rental.user_surname}</td>
			<td>${rental.model_name} (${rental.serial_number})</td>
			<td>${rental.date_start}-${rental.date_end}</td>
			<td>${rental.comment || "aucun commentaire"} </td>
			<td>${loanStatusText}</td>
			<td>bon état</td>
			<td>
				<div class="dropdown">
					<button class="btn btn-secondary dropdown-toggle" type="button" id="actionMenu${
						rental.id_good
					}" data-bs-toggle="dropdown" aria-expanded="false">
						Choisir une action
					</button>
					<ul class="dropdown-menu" aria-labelledby="actionMenu${rental.id_good}">
					${
						rental.loan_status === "returned" &&
						namePermission === "rental-manager"
							? `
								<li><a class="dropdown-item info_client" href="#" data-user-id="${rental.id_user}">Voir l'utilisateur</a></li>
							`
							: ""
					}
					${
						rental.loan_status === "loaned" &&
						namePermission === "rental-manager"
							? `<li><a class="dropdown-item report-return" href="#" data-id="${rental.id_loan}">Signaler le retour de l'équipement</a></li>
							 <li><a class="dropdown-item info_client" href="#" data-user-id="${rental.id_user}">Voir l'utilisateur</a></li>`
							: ""
					}
						${
							rental.loan_status === "loan_request"
								? `<li><a class="dropdown-item manage-rental" href="#">Gérer la location</a></li>`
								: ""
						}
						${
							rental.loan_status === "approved"
								? `<li><a class="dropdown-item confirm-hand-over" href="#" data-id="${rental.id_loan}">Confirmer la remise du matériel</a></li>`
								: ""
						}
						${
							rental.loan_status === "cancelled"
								? `<li><a class="dropdown-item info_client" href="#" data-user-id="${rental.id_user}">Voir l'utilisateur</a></li>`
								: ""
						}
					</ul>
				</div>
			</td>`;

		const manageLinks = row.querySelectorAll(".manage-rental");
		const infoLinks = row.querySelectorAll(".info_client");
		const confirmHandOverLinks = row.querySelectorAll(".confirm-hand-over");
		const reportReturnLinks = row.querySelectorAll(".report-return");

		manageLinks.forEach((link) => {
			link.addEventListener("click", function (event) {
				event.preventDefault();
				document
					.getElementById("approveRentalButton")
					.setAttribute("data-id", rental.id_loan);
				document
					.getElementById("cancelRentalButton")
					.setAttribute("data-id", rental.id_loan);
				rentalManagementModal.show();
				const closeManagementRentalModalButton = document.getElementById(
					"closeManagementRentalModalButton"
				);
				closeManagementRentalModalButton.addEventListener(
					"click",
					function (event) {
						event.preventDefault();
						rentalManagementModal.hide();
					}
				);
			});
		});

		infoLinks.forEach((link) => {
			link.addEventListener("click", async function (event) {
				event.preventDefault();
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

		confirmHandOverLinks.forEach((link) => {
			link.addEventListener("click", function (event) {
				event.preventDefault();
				const loanId = this.getAttribute("data-id");
				const goodId = this.closest("tr").getAttribute("data-good-id");
				const confirmButton = document.getElementById("confirmHandOverButton");
				confirmButton.setAttribute("data-id", loanId);
				confirmButton.setAttribute("data-good-id", goodId);
				const confirmHandOverModal = new Modal(
					document.getElementById("confirmHandOverModal")
				);
				confirmHandOverModal.show();
			});
		});

		reportReturnLinks.forEach((link) => {
			link.addEventListener("click", function (event) {
				event.preventDefault();
				const loanId = this.getAttribute("data-id");
				const goodId = this.getAttribute("data-good-id");
				const confirmButton = document.getElementById("confirmReportReturnButton");
				confirmButton.setAttribute("data-id", loanId);
				confirmButton.setAttribute("data-good-id", goodId);
				const reportReturnModal = new Modal(document.getElementById("reportReturnModal"));
				reportReturnModal.show();
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
		approveRental(rentalId);
	});

document
	.getElementById("confirmHandOverButton")
	.addEventListener("click", async function () {
		const loanId = this.getAttribute("data-id");
		const goodId = await getGoodIdByLoanId(loanId);
		confirmHandOver(loanId, goodId);
	});

document
	.getElementById("confirmReportReturnButton")
	.addEventListener("click", async function () {
		alert("Retour de l'\équipement est confirmé.");
		const loanId = this.getAttribute("data-id");
		const goodId = await getGoodIdByLoanId(loanId);
		reportReturn(loanId, goodId);
	});

async function getGoodIdByLoanId(loanId) {
	try {
		const data = await apiRental.getRentals(currentPage, itemsPerPage);
		if (data && data.data) {
			const rental = data.data.find((rental) => rental.id_loan == loanId);
			return rental ? rental.id_good : null;
		} else {
			console.error("Failed to fetch data");
			return null;
		}
	} catch (error) {
		console.error("Error:", error);
		return null;
	}
}

document
	.getElementById("cancelRentalButton")
	.addEventListener("click", function () {
		const rentalId = this.getAttribute("data-id");
		cancelRental(rentalId);
	});

function approveRental(loanId) {
	apiRental
		.approveRental(loanId)
		.then((data) => {
			if (data.success) {
				alert("Votre demande de location a été approuvée.");
				rentalManagementModal.hide();

				const row = document.querySelector(`tr[data-booking-id="${loanId}"]`);
				if (row) {
					row.querySelector("td:nth-child(7)").textContent =
						"demande de location approuvée";

					const dropdownMenu = row.querySelector(`ul.dropdown-menu`);
					const confirmHandOverItem = document.createElement("li");
					confirmHandOverItem.innerHTML = `
								<a class="dropdown-item confirm-hand-over" href="#" data-id="${loanId}">
									Confirmer la remise du matériel
								</a>`;
					dropdownMenu.appendChild(confirmHandOverItem);

					confirmHandOverItem.addEventListener("click", function (event) {
						event.preventDefault();
						const loanId = this.getAttribute("data-id");
						document
							.getElementById("confirmHandOverButton")
							.setAttribute("data-id", loanId);
						const confirmHandOverModal = new Modal(
							document.getElementById("confirmHandOverModal")
						);
						confirmHandOverModal.show();
					});
				}
				refreshRentals();
			} else {
				console.error("Failed to approve rental.");
			}
		})
		.catch((error) => {
			console.error("Error in approveRental:", error);
		});
}

function confirmHandOver(loanId, goodId) {
	apiGoods
		.confirmHandOver(loanId, goodId)
		.then((data) => {
			if (data.success) {
				alert("La remise du matériel a été confirmée.");
				const confirmHandOverModal = Modal.getInstance(
					document.getElementById("confirmHandOverModal")
				);
				confirmHandOverModal.hide();
				refreshRentals();
			} else {
				console.error("Failed to confirm hand over.");
			}
		})
		.catch((error) => {
			console.error("Error in confirmHandOver:", error);
		});
}

function reportReturn(loanId, goodId) {
	apiGoods
		.reportReturn(loanId, goodId)
		.then((data) => {
			if (data.success) {
				alert("Le retour du matériel a été signalé.");
				const reportReturnModal = Modal.getInstance(
					document.getElementById("reportReturnModal")
				);
				reportReturnModal.hide();
				refreshRentals();
			} else {
				console.error("Failed to report return.");
			}
		})
		.catch((error) => {
			console.error("Error in reportReturn:", error);
		});
}


function cancelRental(loanId) {
	apiRental
		.cancelRental(loanId)
		.then((data) => {
			if (data.success) {
				alert(
					"Vous avez refusé la location et l'équipement est disponible pour la location."
				);
				const rentalManagementModal = Modal.getInstance(
					document.getElementById("rentalManagementModal")
				);
				rentalManagementModal.hide();

				const row = document.querySelector(`tr[data-booking-id="${loanId}"]`);
				if (row) {
					row.querySelector("td:nth-child(7)").textContent = "annulé";

					const dropdownMenu = row.querySelector(`ul.dropdown-menu`);
					const contactManagerItem = document.createElement("li");
					contactManagerItem.innerHTML = `
						<li><a class="dropdown-item info_client" href="#" data-user-id="${rental.id_user}">Voir l'utilisateur</a></li>`;
					dropdownMenu.appendChild(contactManagerItem);
				}
				refreshRentals();
			} else {
				console.error("Failed to cancel rental.");
			}
		})
		.catch((error) => {
			console.error("Error in cancelRental:", error);
		});
}

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
