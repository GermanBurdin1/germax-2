import "./index.css";
import {
	getAdminNav,
	getRentalManagerNav,
	getStockmanNav,
	getStudentNav,
	getTeacherNav,
	getAdminHorizontalNav,
	returnNotificationsModal,
	getManagerHorizontalNav,
	returnSettingsTab,
	getStockmanStudentTeacherHorizontalNav,
	returnSupportModal,
} from "../../../utils/dashboard/components/markup";
import {
	initializeTabsWithoutShow,
	setupTabActivation,
	initializeSingleTab,
	initializeDropdowns,
	initializeDropdown,
	initializeModals,
} from "../../../utils/bootstrap-components";
import {
	returnClientLoans,
	returnLoanRequestModal,
	returnLoanFormModal,
	returnRentalHistoryLoans,
} from "../../../utils/dashboard/loans";
import {
	loansClientHistory,
	rentalClientDetails,
} from "../../../utils/dashboard/clientHistory";

import Modal from "bootstrap/js/dist/modal";

// Импорты для админа
import {
	returnAdminReportsModal,
	returnAdminFeedbackModal,
	returnAdminSettingsModal,
} from "../../../utils/dashboard/adminModals";

import {
	setupCategoryFilterEventListener,
	setupModelSearchEventListener,
	setupBrandFilterEventListener,
} from "../../../utils/dashboard/data/student/booking";
import { ApiAuth } from "../../../utils/classes/api-auth";
import { ApiGoods } from "../../../utils/classes/api-goods";
import { ApiRental } from "../../../utils/classes/api-rental";
import { ApiEquipmentRequest } from "../../../utils/classes/api-equipment-request";

const apiAuth = ApiAuth.getInstance();
const apiGoods = new ApiGoods();
const apiRental = new ApiRental();
const apiEquipmentRequest = new ApiEquipmentRequest();

Promise.all([apiAuth.fetchMeAuthUser(), apiGoods.getAllGoods()]).then(
	([user, goods]) => {
		renderDashboard(user);
	}
);

function initListeners() {
	// Для navbarDropdownMenuLink
	initializeDropdown();
	const notificationsModalPlace = document.getElementById(
		"notificationsModalPlace"
	);
	const supportModalContainer = document.getElementById(
		"supportModalContainer"
	);
	const modalRequestLoan = document.getElementById("modalRequestLoan");
	const modalLoanForm = document.getElementById("modalLoanForm");
	const modalClientLoans = document.getElementById("modalClientLoans");

	// Контейнер модалки для админа
	notificationsModalPlace.innerHTML = returnNotificationsModal();
	supportModalContainer.innerHTML = returnSupportModal();
	modalRequestLoan.innerHTML = returnLoanRequestModal();
	modalLoanForm.innerHTML = returnLoanFormModal();
	modalClientLoans.innerHTML = rentalClientDetails();

	const otherLoansFormModalElement = document.getElementById("loanFormModal");
	const clientLoansHistoryModal = document.getElementById("clientLoansModal");
	const supportModalElement = document.getElementById("supportModal");
	const supportModal = new Modal(supportModalElement);

	let otherLoansFormModal, clientsHistoryModal;

	if (otherLoansFormModalElement) {
		otherLoansFormModal = new Modal(otherLoansFormModalElement);
	} else {
		console.error("loanFormModal element not found");
	}

	if (clientLoansHistoryModal) {
		clientsHistoryModal = new Modal(clientLoansHistoryModal);
	} else {
		console.error("loanFormModal element not found");
	}

	document.addEventListener("click", function (event) {
		const target = event.target.closest("a");
		const targetId = target ? target.id : "";
		const myLoans = document.getElementById("myLoans");
		const clientLoansHistory = document.getElementById("clientLoansHistory");
		const settingsTabContent = document.getElementById("tabPlace");
		// контейнер для админа
		const adminReportsModalContainer =
			document.getElementById("adminReportsModal");
		const adminFeedBackContainer =
			document.getElementById("adminFeedBackModal");
		const adminSettingsContainter = document.getElementById(
			"adminContainerSettingsModal"
		);

		switch (targetId) {
			case "accountLink": // Добавить обработку клика на "Profil"
				event.preventDefault();
				// Повторная загрузка текущего контента при переходе на "Profil"
				myLoans.style.display = "none";
				clientLoansHistory.style.display = "none";
				settingsTabContent.style.display = "none";
				// Другие действия для загрузки профиля
				break;
			case "adminReportsLink":
				event.preventDefault();
				adminReportsModalContainer.innerHTML = returnAdminReportsModal();
				const adminReportsModal = document.getElementById("adminReportModal");
				const initializedAdminReportsModal = new Modal(adminReportsModal);
				initializedAdminReportsModal.show();
				break;
			case "adminFeedBackLink":
				event.preventDefault();
				adminFeedBackContainer.innerHTML = returnAdminFeedbackModal();
				const adminFeedBackModal =
					document.getElementById("adminFeedbackModal");
				const initializedAdminFeedbackModal = new Modal(adminFeedBackModal);
				initializedAdminFeedbackModal.show();
				break;
			case "adminSettingsLink":
				event.preventDefault();
				adminSettingsContainter.innerHTML = returnAdminSettingsModal();
				const adminSettingsModal =
					document.getElementById("adminSettingsModal");
				const initializedAdminSettingsModal = new Modal(adminSettingsModal);
				initializedAdminSettingsModal.show();
				break;
			case "loansRequests":
				event.preventDefault();
				if (myLoans.dataset.visible === "true") {
					myLoans.style.display = "none";
					myLoans.dataset.visible = "false";
				} else {
					hideActiveTabs(myLoans);
					myLoans.style.display = "block";
					myLoans.dataset.visible = "true";
					myLoans.innerHTML = returnClientLoans();
					initializeDropdowns();
					initializeModals();
					loadClientLoans();
				}
				break;
			case "loansRealized":
				event.preventDefault();
				if (clientLoansHistory.dataset.visible === "true") {
					clientLoansHistory.style.display = "none";
					clientLoansHistory.dataset.visible = "false";
				} else {
					hideActiveTabs(clientLoansHistory);
					clientLoansHistory.style.display = "block";
					clientLoansHistory.dataset.visible = "true";
					clientLoansHistory.innerHTML = returnRentalHistoryLoans();
					initializeDropdowns();
					initializeModals();
					loadRentalHistory();
				}
				break;
			case "settings-link":
			case "settings-dropdown-link":
				event.preventDefault();
				if (settingsTabContent.dataset.visible === "true") {
					settingsTabContent.style.display = "none";
					settingsTabContent.dataset.visible = "false";
				} else {
					hideActiveTabs(settingsTabContent);
					settingsTabContent.style.display = "block";
					settingsTabContent.dataset.visible = "true";
					activateSettingsTab();
				}
				break;
			case "navbarDropdownMenuLink":
				break;
			default:
				console.log(`No case for targetId: ${targetId}`);
				break;
		}
	});
}

function loadRentalHistory() {
	const clientLoansHistory = document.getElementById("clientLoansHistory");
	apiRental
		.getClientRentals()
		.then((rentals) => {
			clientLoansHistory.innerHTML = returnRentalHistoryLoans(rentals);
			clientLoansHistory.style.display = "block";
			clientLoansHistory.dataset.visible = "true";
			initializeDropdowns();
			initializeModals();
		})
		.catch((error) => {
			console.error("Failed to load rental history:", error);
		});
}

function loadClientLoans() {
	const myLoans = document.getElementById("myLoans");

	Promise.all([
		apiRental.getClientRentals(),
		apiEquipmentRequest.getAllRequests(),
	])
		.then(([rentals, requests]) => {
			console.log("Rentals:", rentals);
			console.log("Requests:", requests);
			// Допустим, что функция returnClientLoans теперь может обрабатывать оба типа данных
			// Объединяем данные о реальных арендах и запросах в один массив
			myLoans.innerHTML = returnClientLoans(rentals, requests);
			myLoans.style.display = "block";
			myLoans.dataset.visible = "true";
			initializeSingleTab("#activeRequestReservations");
			initializeDropdowns();
			initializeModals();
		})
		.catch((error) => {
			console.error("Failed to load data:", error);
			myLoans.innerHTML = "<p>Error loading data.</p>";
		});
}

function hideActiveTabs(except) {
	const activeTabs = [
		document.getElementById("myLoans"),
		document.getElementById("clientLoansHistory"),
		document.getElementById("tabPlace"),
		document.getElementById("loanFormModal"),
	];

	activeTabs.forEach((tab) => {
		if (tab !== except) {
			tab.style.display = "none";
			tab.dataset.visible = "false";
		}
	});
}

function renderDashboard(responseData) {
	adjustUIBasedOnUserType(responseData.name_permission);
	initListeners();
	setupCategoryFilterEventListener();
	setupModelSearchEventListener();
	setupBrandFilterEventListener();
	updateNotificationsModal(responseData.name_permission);
}

// Для менеджеров
function getManagerNotifications() {
	return [
		{
			title: "Annulation de réservation",
			message: "Un étudiant a annulé sa réservation.",
			linkText: "Gestion des locations",
			linkHref: "/page-bookings-management",
			timestamp: new Date().toLocaleString(),
		},
		{
			title: "Problème de location",
			message: "Un étudiant a signalé un problème de location.",
			linkText: "Voir les détails",
			linkHref: "/page-loans-management",
			timestamp: new Date().toLocaleString(),
		},
	];
}

// Для студентов и enseignants
function getStudentTeacherNotifications() {
	return [
		{
			title: "Fin de la période de location",
			message:
				"Votre période de location pour l'équipement XYZ se termine bientôt.",
			linkText: "Voir les détails",
			linkHref: "/page-loans-details",
			timestamp: new Date().toLocaleString(),
		},
		{
			title: "Prolonger la réservation",
			message: "Vous pouvez prolonger votre réservation pour l'équipement ABC.",
			linkText: "Prolonger la réservation",
			linkHref: "/page-extend-loan",
			timestamp: new Date().toLocaleString(),
		},
	];
}

// Создаем динамические уведомления для модального окна
function createNotificationsList(notifications) {
	return notifications
		.map(
			(notification) => `
      <a href="${notification.linkHref}" class="list-group-item list-group-item-action flex-column align-items-start">
        <div class="d-flex w-100 justify-content-between">
          <h5 class="mb-1">${notification.title}</h5>
          <small class="text-muted">${notification.timestamp}</small>
        </div>
        <p class="mb-1">${notification.message}</p>
        <small class="text-muted">${notification.linkText}</small>
      </a>
    `
		)
		.join("");
}

function updateNotificationsModal(userType) {
	let notifications = [];
	if (userType === "rental-manager") {
		notifications = getManagerNotifications();
	} else {
		notifications = getStudentTeacherNotifications();
	}

	const notificationsList = document.getElementById("notificationsList");
	notificationsList.innerHTML = createNotificationsList(notifications);
}

function adjustUIBasedOnUserType(userType) {
	const dynamicMenu = document.getElementById("dynamicMenu");
	dynamicMenu.innerHTML = "";
	const horizontalNavbar = document.getElementById("horizontalNavbar");
	horizontalNavbar.innerHTML = "";
	let verticalNav = "";
	let horizontalNav = "";

	switch (userType) {
		case "admin":
			verticalNav = getAdminNav();
			horizontalNav = getAdminHorizontalNav();
			break;
		case "rental-manager":
			horizontalNav = getManagerHorizontalNav();
			verticalNav = getRentalManagerNav();
			break;
		case "stockman":
			horizontalNav = getStockmanStudentTeacherHorizontalNav();
			verticalNav = getStockmanNav();
			break;
		case "student":
			horizontalNav = getStockmanStudentTeacherHorizontalNav();
			verticalNav = getStudentNav();
			break;
		case "teacher":
			horizontalNav = getStockmanStudentTeacherHorizontalNav();
			verticalNav = getTeacherNav();
			break;
		default:
			console.log("Unknown user type");
	}

	dynamicMenu.innerHTML = verticalNav;
	horizontalNavbar.innerHTML = horizontalNav;

	// Обновление содержимого уведомлений в зависимости от типа пользователя
	// updateNotificationsModal(userType);
}

function activateSettingsTab() {
	tabPlace.innerHTML = returnSettingsTab();
	initializeTabsWithoutShow("#myTab .nav-link");
	setupTabActivation("#settings-tab", "#settings-tab");
	setupTabActivation("#general-tab", "#general-tab");
	initializeSingleTab("#general-tab");
}


function confirmApproval(requestId) {
  const row = document.querySelector(`tr[data-id="${requestId}"]`);
  // Здесь можно добавить логику для отправки данных на сервер для согласования

  // Пример логики отправки данных на сервер:
  const approvalData = {
    id_request: requestId,
    // Добавьте дополнительные данные, если необходимо
  };

  apiEquipmentRequest.confirmApproval(approvalData)
    .then((data) => {
      alert("Данные успешно подтверждены и отправлены на согласование!");
      // Обновите статус строки или выполните другие действия
      updateTableRowStatus(requestId, "approved");
    })
    .catch((error) => {
      console.error("Ошибка при отправке данных на согласование:", error);
      alert("Ошибка при отправке данных на согласование.");
    });
}

function updateTableRowStatus(requestId, status) {
  const row = document.querySelector(`tr[data-id="${requestId}"]`);

  if (row) {
    row.children[6].textContent = status; // Предполагается, что статус находится в 7-м столбце (индекс 6)
  }
}
