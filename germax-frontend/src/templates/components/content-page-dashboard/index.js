import "./index.css";
import {
	getAdminNav,
	getRentalManagerNav,
	getStockmanNav,
	getStudentNav,
	getTeacherNav,
	getAdminHorizontalNav,
	returnAdminNotificationsModal,
	getManagerHorizontalNav,
	returnSettingsTab,
	getStockmanStudentTeacherHorizontalNav,
	returnModalSupport,
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
} from "../../../utils/dashboard/loans";
import {
	loansClientHistory,
	rentalClientDetails,
} from "../../../utils/dashboard/clientHistory";

import Modal from "bootstrap/js/dist/modal";

//imorts for admin
import {
	returnAdminReportsModal,
	returnAdminFeedbackModal,
	returnAdminSettingsModal,
} from "../../../utils/dashboard/adminModals";

import {
	setupCategoryFilterEventListener,
	setupModelSearchEventListener,
	setupBrandFilterEventListener,
	returnNewLoanFormModalForTeachersOrStundents,
} from "../../../utils/dashboard/data/student/booking";

document.addEventListener("DOMContentLoaded", function () {
	const authToken = localStorage.getItem("authToken");

	if (authToken) {
		// adjustUIBasedOnUserType(userType);
		fetchAuthUser("http://germax-api/auth/me");
	}
});

function initListeners() {
	//для navbarDropdownMenuLink
	initializeDropdown();
	const modalPlace = document.getElementById("modalPlace");
	const modalSupport = document.getElementById("modalSupport");
	const modalNewStudentOrTeacherRequest = document.getElementById(
		"modalNewStudentOrTeacherRequest"
	);
	const modalRequestLoan = document.getElementById("modalRequestLoan");
	const modalLoanForm = document.getElementById("modalLoanForm");
	const modalClientLoans = document.getElementById("modalClientLoans");
	// контейнер модалки для админа

	modalNewStudentOrTeacherRequest.innerHTML =
		returnNewLoanFormModalForTeachersOrStundents();
	modalPlace.innerHTML = returnAdminNotificationsModal();
	modalSupport.innerHTML = returnModalSupport();
	modalRequestLoan.innerHTML = returnLoanRequestModal();
	modalLoanForm.innerHTML = returnLoanFormModal();
	modalClientLoans.innerHTML = rentalClientDetails();

	const bookEquipmentModalElement = document.getElementById("fullScreenModal");
	const newLoanFormModalElement = document.getElementById("newLoanFormModal");
	const otherLoansFormModalElement = document.getElementById("loanFormModal");
	const clientLoansHistoryModal = document.getElementById("clientLoansModal");

	let bookEquipmentModal,
		otherLoansFormModal,
		clientsHistoryModal,
		newLoanFormModal;

	if (bookEquipmentModalElement) {
		bookEquipmentModal = new Modal(bookEquipmentModalElement);
	} else {
		console.error("fullScreenModal element not found");
	}

	if (newLoanFormModalElement) {
		newLoanFormModal = new Modal(newLoanFormModalElement);
	} else {
		console.error("newLoanFormModalElement element not found");
	}

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
		if (event.target.closest(".reservation-modal-btn")) {
			// Если кликнули по кнопке reservation-modal-btn
			const button = event.target;
			const modelName = button.getAttribute("data-model");
			const modalTitle = document.querySelector(
				"#newLoanFormModal .modal-title"
			);
			modalTitle.textContent = `Demande de location pour ${modelName}`;

			// Закрываем bookEquipmentModal перед показом newLoanFormModal
			if (bookEquipmentModal && typeof bookEquipmentModal.hide === "function") {
				bookEquipmentModal.hide();
				bookEquipmentModalElement.addEventListener(
					"hidden.bs.modal",
					function onModalHidden() {
						newLoanFormModal.show();
						bookEquipmentModalElement.removeEventListener(
							"hidden.bs.modal",
							onModalHidden
						);
					},
					{ once: true }
				);
			} else {
				// Если bookEquipmentModal недоступен или не имеет метода hide, просто показываем newLoanFormModal
				newLoanFormModal.show();
			}

			event.stopPropagation();
			return;
		}

		const target = event.target.closest("a"); // Найдем ближайший элемент <a>
		const targetId = target ? target.id : ""; // Получаем ID этого элемента, если он есть
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
			// кейсы админа
			case "adminReportsLink":
				event.preventDefault();
				console.log("клик на reportslink");
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
				console.log(initializedAdminFeedbackModal);
				initializedAdminFeedbackModal.show();
				break;
			case "adminSettingsLink":
				event.preventDefault();
				console.log("привет");
				adminSettingsContainter.innerHTML = returnAdminSettingsModal();
				console.log(adminSettingsContainter);
				const adminSettingsModal =
					document.getElementById("adminSettingsModal");
				const initializedAdminSettingsModal = new Modal(adminSettingsModal);
				console.log(initializedAdminSettingsModal);
				initializedAdminSettingsModal.show();
				break;
			case "openFullScreenSearch":
				event.preventDefault();
				event.stopPropagation();
				if (bookEquipmentModalElement && bookEquipmentModal) {
					bookEquipmentModal.show();
				} else {
					console.error(
						"Cannot show the first modal - element or instance is missing."
					);
				}
				break;
			case "loans":
				event.preventDefault();
				if (myLoans.dataset.visible === "true") {
					myLoans.style.display = "none";
					myLoans.dataset.visible = "false";
				} else {
					hideActiveTabs(myLoans);
					myLoans.style.display = "block";
					myLoans.dataset.visible = "true";
					myLoans.innerHTML = returnClientLoans();
					initializeSingleTab("#activeReservations");
					initializeDropdowns();
					initializeModals();
				}
				break;
			case "rentalHistoryLink":
				event.preventDefault();
				if (clientLoansHistory.dataset.visible === "true") {
					clientLoansHistory.style.display = "none";
					clientLoansHistory.dataset.visible = "false";
				} else {
					hideActiveTabs(clientLoansHistory);
					clientLoansHistory.style.display = "block";
					clientLoansHistory.dataset.visible = "true";
					clientLoansHistory.innerHTML = loansClientHistory();
					document
						.querySelectorAll("#clientLoansHistory .view-details")
						.forEach((element) => {
							element.addEventListener("click", function (e) {
								e.preventDefault();
								clientsHistoryModal.show();
							});
						});
				}
				break;
			case "loansRequest":
				hideActiveTabs();
				if (
					bookEquipmentModalElement &&
					bookEquipmentModal &&
					typeof bookEquipmentModal.hide === "function"
				) {
					bookEquipmentModal.hide();
					bookEquipmentModalElement.addEventListener(
						"hidden.bs.modal",
						function onModalHidden() {
							if (
								otherLoansFormModalElement &&
								otherLoansFormModal &&
								typeof otherLoansFormModal.show === "function"
							) {
								otherLoansFormModal.show();
							} else {
								console.error(
									"otherLoansFormModal is not initialized or show is not a function"
								);
							}
							bookEquipmentModalElement.removeEventListener(
								"hidden.bs.modal",
								onModalHidden
							);
						},
						{ once: true }
					);
				} else {
					console.error(
						"bookEquipmentModal is not initialized or hide is not a function"
					);
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
			tab.dataset.visible = "false"; // Устанавливаем, что вкладка не видима
		}
	});
}

function fetchAuthUser(url) {
	const token = JSON.parse(localStorage.getItem("authToken"));

	if (!token) {
		console.error("No token found, please login first");
		return;
	}

	fetch(url, {
		method: "GET",
		headers: {
			token: token,
			"Content-Type": "application/json",
		},
	})
		.then(async (response) => {
			const json = await response.json();
			if (!response.ok) return Promise.reject(json);
			return json;
		})
		.then((data) => {
			renderDashboard(data);
		})
		.catch((error) => {
			console.error("Failed to fetch data:", error);
		});
}

function renderDashboard(responseData) {
	adjustUIBasedOnUserType(responseData.data.name_permission);
	initListeners();
	// фильтрация оборудования, поиск для studentsAndTeacher
	setupCategoryFilterEventListener();
	setupModelSearchEventListener();
	setupBrandFilterEventListener();
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
}

function activateSettingsTab() {
	tabPlace.innerHTML = returnSettingsTab();
	initializeTabsWithoutShow("#myTab .nav-link");
	setupTabActivation("#settings-tab", "#settings-tab");
	setupTabActivation("#general-tab", "#general-tab");
	initializeSingleTab("#general-tab");
}
