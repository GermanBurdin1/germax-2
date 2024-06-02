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
import { ApiNotification } from "../../../utils/classes/api-notification";
import { ApiUsers } from "../../../utils/classes/api-users";
import { UploadAPI } from "../../../utils/classes/api-upload";
import { ApiStatistics } from "../../../utils/classes/api-statistics";

const apiAuth = ApiAuth.getInstance();
const apiGoods = new ApiGoods();
const apiRental = new ApiRental();
const apiEquipmentRequest = new ApiEquipmentRequest();
const apiNotification = new ApiNotification();
const apiUsers = new ApiUsers();
const uploadApi = new UploadAPI();
const apiStatistics = new ApiStatistics();

async function getUserPermission() {
	try {
		const response = await apiAuth.getUserPermission();
		console.log("response", response);
		return response;
	} catch (error) {
		console.error("Error fetching user permission:", error);
		return null;
	}
}

async function initializeDashboard() {
	const userPermission = await getUserPermission();
	console.log("userPermission,", userPermission);
	if (userPermission) {
		const { name_permission } = userPermission;
		localStorage.setItem("name_permission", name_permission);
		displayStatistics(name_permission);
	} else {
		console.error("Failed to fetch user permission data.");
	}
}

// Инициализация дашборда
initializeDashboard();

async function getNotifications(userId) {
	try {
		const notifications = await apiNotification.getNotifications(userId);
		if (notifications.length === 0) {
			console.log("No notifications found.");
		}
		updateNotificationCount(notifications.length);
		displayNotifications(notifications);
	} catch (error) {
		console.error("Ошибка при получении уведомлений:", error);
		console.log(
			"Ошибка при получении уведомлений. Проверьте консоль для подробностей."
		);
	}
}

function updateNotificationCount(count) {
	const notificationCountElement = document.getElementById("notificationCount");
	if (count > 0) {
		notificationCountElement.textContent = count;
		notificationCountElement.style.display = "inline-block";
	} else {
		notificationCountElement.style.display = "none";
	}
}

function displayNotifications(notifications) {
	const notificationsList = document.getElementById("notificationsList");
	notificationsList.innerHTML = "";

	if (notifications.length === 0) {
		const noNotificationsItem = document.createElement("div");
		noNotificationsItem.className = "list-group-item";
		noNotificationsItem.textContent = "No notifications available.";
		notificationsList.appendChild(noNotificationsItem);
		return;
	}

	notifications.forEach((notification) => {
		const notificationItem = document.createElement("a");
		notificationItem.href = "#";
		notificationItem.className =
			"list-group-item list-group-item-action flex-column align-items-start";
		notificationItem.innerHTML = `
					<div class="d-flex w-100 justify-content-between">
							<h5 class="mb-1">${notification.title}</h5>
							<small class="text-muted">${new Date(
								notification.date_notification
							).toLocaleString()}</small>
					</div>
					<p class="mb-1">${notification.message}</p>
					<small class="text-muted">Notification</small>
			`;
		notificationsList.appendChild(notificationItem);
	});
}

async function markNotificationsAsRead(userId) {
	try {
		await apiNotification.markNotificationsAsRead(userId);
		updateNotificationCount(0);
	} catch (error) {
		console.error("Ошибка при отметке уведомлений как прочитанных:", error);
	}
}

Promise.all([apiAuth.fetchMeAuthUser(), apiGoods.getAllGoods()]).then(
	([user, goods]) => {
		renderDashboard(user);
	}
);

let formChanged = false;
function initListeners() {
	// Для navbarDropdownMenuLink
	// initializeDropdown();
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
		const target = event.target.closest("a, button");
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
		const profileSection = document.getElementById("profileSection");
		const settingsForm = document.getElementById("settingsForm");

		// Логика для отображения профиля по умолчанию
		function showProfile() {
			profileSection.style.display = "block";
			settingsTabContent.style.display = "none";
		}

		function showSettings() {
			profileSection.style.display = "none";
			settingsTabContent.style.display = "block";
		}

		// Определяем, какая вкладка должна быть активна
		const activeTab = localStorage.getItem("activeTab");

		if (activeTab === "settings") {
			showSettings();
		} else {
			showProfile();
		}

		if (settingsForm) {
			settingsForm.addEventListener("input", () => {
				formChanged = true;
			});
		}

		switch (targetId) {
			case "saveChanges":
				event.preventDefault();
				formChanged = false;
				saveUserSettings(showProfile);
				alert("Вы удачно сохранили изменения");
				showProfile();
				localStorage.setItem("activeTab", "profile");
				break;
			case "resetChanges":
				event.preventDefault();
				settingsForm.reset();
				formChanged = false;
				break;
			case "accountLink": // Добавить обработку клика на "Profil"
				event.preventDefault();
				if (formChanged) {
					if (confirm("Вы уверены, что не хотите сохранить изменения?")) {
						formChanged = false;
						showProfile();
					}
				} else {
					showProfile();
				}
				localStorage.setItem("activeTab", "profile");
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
				event.preventDefault();
				if (settingsTabContent.style.display === "block") {
					if (!formChanged) {
						showProfile();
						localStorage.setItem("activeTab", "profile");
					} else {
						settingsTabContent.style.display = "none";
						settingsTabContent.dataset.visible = "false";
					}
				} else {
					hideActiveTabs(settingsTabContent);
					settingsTabContent.style.display = "block";
					settingsTabContent.dataset.visible = "true";
					activateSettingsTab();
					localStorage.setItem("activeTab", "settings");
				}
				break;
			case "navbarDropdownMenuLink":
				break;
			default:
				console.log(`No case for targetId: ${targetId}`);
				const settingsTab = document.getElementById("tabPlace");
				if (
					!formChanged &&
					activeTab === "settings" &&
					!settingsTab.contains(event.target)
				) {
					showProfile();
					localStorage.setItem("activeTab", "profile");
				}
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
			setupCancelLoansModal();
		})
		.catch((error) => {
			console.error("Failed to load rental history:", error);
		});
}

let managerProposalModal;
function loadClientLoans() {
	const myLoans = document.getElementById("myLoans");

	Promise.all([
		apiRental.getClientRentals(),
		apiEquipmentRequest.getAllRequests(),
	])
		.then(([rentals, requests]) => {
			requests = requests.data;
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
			setupProposalModal();
			setupCancelReservationModal();
			// setupProposalModalBeforeSendingItem();
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
		document.getElementById("profileSection"),
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
	const userId = JSON.parse(localStorage.getItem("id_user"));
	getNotifications(userId);
	// Инициализация notificationsModal перенесена сюда
	loadUserProfile(responseData);
	loadUserNotifications(responseData.name_permission);
	const notificationsModalElement =
		document.getElementById("notificationsModal");
	if (notificationsModalElement) {
		const notificationsModal = new Modal(notificationsModalElement);

		notificationsModalElement.addEventListener(
			"show.bs.modal",
			async function () {
				await markNotificationsAsRead(userId);
			}
		);

		notificationsModalElement.addEventListener("shown.bs.modal", function () {
			const backdrop = document.querySelector(".modal-backdrop");
			if (backdrop) {
				backdrop.remove();
			}
		});
	} else {
		console.error("notificationsModalElement not found");
	}

	setupCancelLoansModal();
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
	const userType = localStorage.getItem("namePermission");
	tabPlace.innerHTML = returnSettingsTab(userType);
	initializeTabsWithoutShow("#myTab .nav-link");
	setupTabActivation("#settings-tab", "#settings-tab");
	setupTabActivation("#general-tab", "#general-tab");
	initializeSingleTab("#general-tab");
}

function setupProposalModal() {
	managerProposalModal = new Modal(
		document.getElementById("managerProposalModal")
	);

	document.querySelector(".table").addEventListener("click", (event) => {
		if (event.target.classList.contains("view-manager-proposal")) {
			event.preventDefault();
			const requestId = event.target.getAttribute("data-id");
			openManagerProposalModal(requestId);
		}
	});

	document
		.getElementById("confirmManagerProposal")
		.addEventListener("click", function () {
			const requestId = this.getAttribute("data-id");
			confirmApproval(requestId);
			managerProposalModal.hide();
		});
}

function openManagerProposalModal(requestId) {
	document
		.getElementById("confirmManagerProposal")
		.setAttribute("data-id", requestId);
	managerProposalModal.show();
}

function confirmApproval(requestId) {
	const row = document.querySelector(`tr[data-id="${requestId}"]`);
	const equipment_status = "equipment_availability_pending";
	const treatment_status = "treated_manager_user";
	const approvalData = {
		id_request: requestId,
		equipment_status,
		treatment_status,
	};
	apiEquipmentRequest
		.confirmApproval(approvalData)
		.then((data) => {
			alert("Le gestionnaire est déjà en train de chercher votre équipement");
			updateTableRowStatus(requestId, "votre matériel est recherché");
		})
		.catch((error) => {
			console.error(
				"Erreur lors de l'envoi des données pour approbation :",
				error
			);
			alert("Erreur lors de l'envoi des données pour approbation.");
		});
}

function updateTableRowStatus(requestId, status) {
	const row = document.querySelector(`tr[data-id="${requestId}"]`);

	if (row) {
		console.log("row4", row.children[4]);
		row.children[4].textContent = status;
	}
}

function setupCancelReservationModal() {
	const cancelReservationModal = new Modal(
		document.getElementById("request--reverse-loan-modal")
	);

	document.querySelector(".table").addEventListener("click", (event) => {
		if (event.target.dataset.bsTarget === "#request--reverse-loan-modal") {
			event.preventDefault();
			const requestId = event.target.closest("tr").getAttribute("data-id");
			document
				.getElementById("request--reverse-loan-modal")
				.setAttribute("data-id", requestId);
			cancelReservationModal.show();
		}
	});

	document
		.getElementById("cancelReservationButton")
		.addEventListener("click", async function () {
			const requestId = document
				.getElementById("request--reverse-loan-modal")
				.getAttribute("data-id");

			if (!requestId) {
				alert("Не удалось получить ID запроса.");
				return;
			}

			try {
				const response = await apiEquipmentRequest.cancelRequest(requestId);

				if (response.success) {
					alert("Reservation cancelled successfully.");
					// Обновляем UI, чтобы отразить отмену
					updateTableRowStatus(requestId, "annulé");
					// Закрываем модальное окно
					cancelReservationModal.hide();
				} else {
					alert("Failed to cancel reservation: " + response.message);
				}
			} catch (error) {
				console.error("Error cancelling reservation:", error);
				alert("An error occurred while cancelling the reservation.");
			}
		});
}

function setupCancelLoansModal() {
	const reverseLoanModalElement = document.getElementById("reverse-loan-modal");
	const cancelLoansModal = new Modal(reverseLoanModalElement);

	document.querySelector(".table").addEventListener("click", (event) => {
		if (event.target.dataset.bsTarget === "#reverse-loan-modal") {
			event.preventDefault();
			const requestId = event.target.closest("tr").getAttribute("data-id");
			const modal = document.getElementById("reverse-loan-modal");
			modal.setAttribute("data-id", requestId);
			cancelLoansModal.show();
		}
	});

	const cancelLoanButton = document.getElementById("cancelLoanButton");
	if (cancelLoanButton) {
		cancelLoanButton.addEventListener("click", async function () {
			const requestId = document
				.getElementById("reverse-loan-modal")
				.getAttribute("data-id");

			if (!requestId) {
				alert("Не удалось получить ID запроса.");
				return;
			}

			try {
				const response = await apiRental.cancelRental(requestId);

				if (response.success) {
					alert("Reservation cancelled successfully.");
					// Обновляем UI, чтобы отразить отмену
					updateTableRowStatus(requestId, "annulé");
					// Закрываем модальное окно
					cancelLoansModal.hide();
				} else {
					alert("Failed to cancel reservation: " + response.message);
				}
			} catch (error) {
				console.error("Error cancelling reservation:", error);
				alert("An error occurred while cancelling the reservation.");
			}
		});
	} else {
		console.error("cancelLoanButton element not found");
	}
}

//личный кабинет
async function loadUserProfile() {
	try {
		const user = await apiUsers.getUser();
		const profileSection = document.getElementById("profileSection");
		const profileGreeting = document.getElementById("profileGreeting");
		const profileAvatar = document.getElementById("profileAvatar");
		const avatarPlaceholder = document.getElementById("avatarPlaceholder");

		const greetingText = `Bonjour, ${user.firstname} ${user.lastname}!`;

		// Очищаем элемент перед началом печати
		profileGreeting.textContent = "";

		function type() {
			let index = 0;
			function typeChar() {
				if (index < greetingText.length) {
					profileGreeting.textContent += greetingText.charAt(index);
					index++;
					setTimeout(typeChar, 150);
				} else {
					profileGreeting.classList.remove("typewriter");
				}
			}
			typeChar();
		}

		type();

		if (user.picture) {
			profileAvatar.src = user.picture;
			profileAvatar.classList.add("show");
			avatarPlaceholder.classList.remove("show");
		} else {
			profileAvatar.classList.remove("show");
			avatarPlaceholder.classList.add("show");
		}

		profileSection.style.display = "block";

		avatarPlaceholder.addEventListener("click", () => {
			const fileInput = document.createElement("input");
			fileInput.type = "file";
			fileInput.accept = "image/*";
			fileInput.onchange = async (event) => {
				const file = event.target.files[0];
				if (file) {
					try {
						const response = await uploadApi.uploadPhoto(file);
						if (response.success) {
							const pictureUrl = response.url;

							// Обновление пользователя с новым URL картинки
							await apiUsers.updateUser({ picture: pictureUrl });

							profileAvatar.src = pictureUrl;
							profileAvatar.classList.add("show");
							avatarPlaceholder.classList.remove("show");
						} else {
							alert("Failed to upload avatar");
						}
					} catch (error) {
						console.error("Error uploading avatar:", error);
						alert("Failed to upload avatar");
					}
				}
			};
			fileInput.click();
		});
	} catch (error) {
		console.error("Error loading user profile:", error);
	}
}

async function saveUserSettings(showProfile) {
	const settingsForm = document.getElementById("settingsForm");
	const data = {};

	if (settingsForm.contactNumber.value)
		data.phone = settingsForm.contactNumber.value;
	if (settingsForm.emailId.value) data.email = settingsForm.emailId.value;
	if (settingsForm.birthDay.value)
		data.date_birth = settingsForm.birthDay.value;
	if (settingsForm.about.value)
		data.useful_information = settingsForm.about.value;

	try {
		const response = await apiUsers.updateUser(data);
		if (response.success) {
			alert(response.message);
			formChanged = false;
			showProfile();
			localStorage.setItem("activeTab", "profile");
		} else {
			throw new Error(response.message);
		}
	} catch (error) {
		console.error("Error saving user settings:", error);
		alert("Failed to save settings");
	}
}

async function getManagerDashboardStatistics() {
	try {
		const statistics = await apiStatistics.getManagerStatistics();
		return statistics;
	} catch (error) {
		console.error("Error fetching statistics:", error);
		return { newUsers: 0, newLoanRequests: 0 };
	}
}

async function getStockmanDashboardStatistics() {
	try {
		const statistics = await apiStatistics.getStockmanStatistics();
		return statistics;
	} catch (error) {
		console.error("Error fetching statistics:", error);
		return { newLoanRequests: 0, newEquipment: 0 };
	}
}

function createNotificationElement(message, linkText, linkHref) {
	const notificationElement = document.createElement("div");
	notificationElement.classList.add("user-notification");
	const linkElement = document.createElement("a");
	linkElement.href = linkHref;
	linkElement.textContent = linkText;
	notificationElement.innerHTML = `${message} `;
	notificationElement.appendChild(linkElement);
	return notificationElement;
}

async function displayStatistics(userType) {
	let statistics;
	const userNotificationsElement = document.getElementById("userNotifications");

	if (userType === "rental-manager") {
		statistics = await getManagerDashboardStatistics();
		const newUsersCount = statistics.newUsers;
		const newLoanRequestsCount = statistics.newLoanRequests;
		userNotificationsElement.innerHTML = "";

		if (newUsersCount > 0) {
			const userMessage = `Il y a ${newUsersCount} ${
				newUsersCount === 1 ? "nouveau" : "nouveaux"
			} ${newUsersCount === 1 ? "utilisateur" : "utilisateurs"} ce mois-ci.`;
			userNotificationsElement.appendChild(
				createNotificationElement(
					userMessage,
					"Voir les utilisateurs",
					"http://germax-frontend/page-client-management/"
				)
			);
		} else {
			userNotificationsElement.innerHTML +=
				"<div class='user-notification'>Il n'y a pas de nouveaux utilisateurs ce mois-ci.</div>";
		}

		if (newLoanRequestsCount > 0) {
			const loanMessage = `Il y a ${newLoanRequestsCount} ${
				newLoanRequestsCount === 1 ? "nouvelle" : "nouvelles"
			} ${
				newLoanRequestsCount === 1 ? "demande de prêt" : "demandes de prêt"
			} ce mois-ci.`;
			userNotificationsElement.appendChild(
				createNotificationElement(
					loanMessage,
					"Voir les demandes",
					"http://germax-frontend/page-bookings-management/"
				)
			);
		} else {
			userNotificationsElement.innerHTML +=
				"<div class='user-notification'>Il n'y a pas de nouvelles demandes de prêt ce mois-ci.</div>";
		}
	} else if (userType === "stockman") {
		statistics = await getStockmanDashboardStatistics();
		const newEquipmentCount = statistics.newEquipment;

		if (newEquipmentCount > 0) {
			const equipmentMessage = `Il y a ${newEquipmentCount} ${
				newEquipmentCount === 1
					? "nouvelle commande d'équipement"
					: "nouvelles commandes d'équipement"
			} ce mois-ci.`;
			userNotificationsElement.appendChild(
				createNotificationElement(
					equipmentMessage,
					"Voir l'équipement",
					"http://germax-frontend/page-order-new-equipment/"
				)
			);
		} else {
			userNotificationsElement.innerHTML +=
				"<div class='user-notification'>Il n'y a pas de nouvelles commandes d'équipement ce mois-ci.</div>";
		}
	} else if (userType === "student" || userType === "teacher") {
		const userId = localStorage.getItem("id_user");
		statistics = await apiRental.getRecentRentals(userId);
		userNotificationsElement.innerHTML =
			"<div class='user-notification'><strong>Vos locations récentes en cours:</strong></div>";
		if (statistics.length > 0) {
			statistics.forEach((rental) => {
				const rentalElement = document.createElement("div");
				rentalElement.classList.add("user-notification");
				rentalElement.innerHTML = `
								<div>
										<strong>Modèle:</strong> ${rental.model_name}<br>
										<strong>Numéro de série:</strong> ${rental.serial_number}<br>
										<strong>Période:</strong> du ${new Date(rental.date_start).toLocaleString(
											"fr-FR"
										)} au ${new Date(rental.date_end).toLocaleString("fr-FR")}
								</div>
						`;
				userNotificationsElement.appendChild(rentalElement);
			});
		} else {
			userNotificationsElement.innerHTML +=
				"<div class='user-notification'>Aucune location récente.</div>";
		}
	}
}

// Извлечение namePermission из localStorage
const userType = localStorage.getItem("namePermission");

if (userType) {
	displayStatistics(userType);
} else {
	console.error("User type is not defined in localStorage.");
}

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

//в разработке
// document
// 	.getElementById("communicationForm")
// 	.addEventListener("submit", async (event) => {
// 		event.preventDefault();

// 		const message = document.getElementById("communicationMessageText").value;

// 		if (!message.trim()) {
// 			alert("Please enter a message.");
// 			return;
// 		}

// 		try {
// 			const data = await apiCommunications.sendMessage(message);

// 			if (data.success) {
// 				alert("Message sent successfully.");
// 				document.getElementById("communicationForm").reset();
// 			} else {
// 				alert("Failed to send message: " + data.message);
// 			}
// 		} catch (error) {
// 			console.error("Error sending message:", error);
// 			alert("An error occurred while sending the message.");
// 		}
// 	});
