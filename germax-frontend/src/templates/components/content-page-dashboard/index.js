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
	const modalRequestLoan = document.getElementById("modalRequestLoan");
	const modalLoanForm = document.getElementById("modalLoanForm");
	const modalClientLoans = document.getElementById("modalClientLoans");

	modalPlace.innerHTML = returnAdminNotificationsModal();
	modalSupport.innerHTML = returnModalSupport();
	modalRequestLoan.innerHTML = returnLoanRequestModal();
	modalLoanForm.innerHTML = returnLoanFormModal();
	modalClientLoans.innerHTML = rentalClientDetails();

	const firstModalElement = document.getElementById("fullScreenModal");
	const secondModalElement = document.getElementById("loanFormModal");
	const clientLoansHistoryModal = document.getElementById("clientLoansModal");

	let firstModal, secondModal, clientsHistoryModal;

	if (firstModalElement) {
		firstModal = new Modal(firstModalElement);
	} else {
		console.error("fullScreenModal element not found");
	}

	if (secondModalElement) {
		secondModal = new Modal(secondModalElement);
	} else {
		console.error("loanFormModal element not found");
	}

	if (clientLoansHistoryModal) {
		clientsHistoryModal = new Modal(clientLoansHistoryModal);
	} else {
		console.error("loanFormModal element not found");
	}

	console.log(firstModal, secondModal, clientsHistoryModal);

	document.addEventListener("click", function (event) {
		const targetId = event.target.id;
		const myLoans = document.getElementById("myLoans");
		const clientLoansHistory = document.getElementById("clientLoansHistory");
		const settingsTabContent = document.getElementById("tabPlace");

		switch (targetId) {
			case "openFullScreenSearch":
				event.preventDefault();
				event.stopPropagation();
				if (firstModalElement && firstModal) {
					firstModal.show();
				} else {
					console.error(
						"Cannot show the first modal - element or instance is missing."
					);
				}
				break;
			case "loans":
				event.preventDefault();
				// Скрытие истории аренды, если она отображается
				if (clientLoansHistory) {
					clientLoansHistory.style.display = "none";
				}
				// Проверка и отображение текущих аренд, даже если это первый клик
				if (myLoans) {
					myLoans.style.display = "block";
					myLoans.innerHTML = returnClientLoans();
					initializeSingleTab("#activeReservations");
					initializeDropdowns();
					initializeModals();
				} else {
					console.error("Element #myLoans not found.");
				}
				break;
			case "rentalHistoryLink":
				event.preventDefault();
				// Скрытие текущих аренд
				if (myLoans) {
					myLoans.style.display = "none";
				}
				// Отображение истории аренд, если она скрыта
				if (clientLoansHistory) {
					clientLoansHistory.style.display = "block";
					clientLoansHistory.innerHTML = loansClientHistory();
					// Привязка событий к новым ссылкам
					document
						.querySelectorAll("#clientLoansHistory .view-details")
						.forEach((element) => {
							element.addEventListener("click", function (e) {
								e.preventDefault();
								clientsHistoryModal.show();
							});
						});
				} else {
					console.error("clientLoansHistory container not found.");
				}
				break;
			case "loansRequest":
				if (
					firstModalElement &&
					firstModal &&
					typeof firstModal.hide === "function"
				) {
					firstModal.hide();
					firstModalElement.addEventListener(
						"hidden.bs.modal",
						function onModalHidden() {
							if (
								secondModalElement &&
								secondModal &&
								typeof secondModal.show === "function"
							) {
								secondModal.show();
							} else {
								console.error(
									"secondModal is not initialized or show is not a function"
								);
							}
							firstModalElement.removeEventListener(
								"hidden.bs.modal",
								onModalHidden
							);
						},
						{ once: true }
					);
				} else {
					console.error(
						"firstModal is not initialized or hide is not a function"
					);
				}
				break;
			case "settings-link":
			case "settings-dropdown-link":
				event.preventDefault();
				if (typeof activateSettingsTab === "function") {
					if (
						settingsTabContent.style.display === "none" ||
						settingsTabContent.innerHTML === ""
					) {
						activateSettingsTab();
						settingsTabContent.style.display = "block"; // Показать настройки
					} else {
						settingsTabContent.style.display = "none"; // Скрыть настройки
					}
				} else {
					console.error("Function activateSettingsTab() is not defined.");
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
