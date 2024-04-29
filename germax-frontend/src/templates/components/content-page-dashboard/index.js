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
import Modal from "bootstrap/js/dist/modal";

document.addEventListener("DOMContentLoaded", function () {
	const authToken = localStorage.getItem("authToken");

	if (authToken) {
		// adjustUIBasedOnUserType(userType);
		fetchAuthUser("http://germax-api/auth/me");
	}
});

// function initListeners() {
// 	const modalPlace = document.getElementById("modalPlace");
// 	const modalSupport = document.getElementById("modalSupport");
// 	const modalRequestLoan = document.getElementById("modalRequestLoan");
// 	const modalLoanForm = document.getElementById("modalLoanForm");

// 	modalPlace.innerHTML = returnAdminNotificationsModal();
// 	modalSupport.innerHTML = returnModalSupport();
// 	modalRequestLoan.innerHTML = returnLoanRequestModal();
// 	// Предполагаем, что returnLoanFormModal() - это ваша функция для генерации модального окна
// 	modalLoanForm.innerHTML = returnLoanFormModal();

// 	document.addEventListener("click", function (event) {
// 		// Обработчик для клика по ссылке 'Mes locations'
// 		console.log(event.target);
// 		if (event.target.matches("#loans")) {
// 			const myLoans = document.getElementById("myLoans");
// 			if (myLoans) {
// 				myLoans.innerHTML = returnClientLoans();
// 				initializeSingleTab("#activeReservations");
// 				initializeDropdowns();
// 				initializeModals();
// 			}
// 		}
// 	});

// 	const firstModalElement = document.getElementById("fullScreenModal");
// 	const secondModalElement = document.getElementById("loanFormModal");

// 	if (firstModalElement && secondModalElement) {
// 		const firstModal = new Modal(firstModalElement);
// 		const secondModal = new Modal(secondModalElement); // Пересоздаем экземпляр для secondModal

// 		console.log("firstModal and secondModal", firstModal, secondModal);
// 		console.log("содержимое firstModalElement:",firstModalElement);

// 		document.addEventListener("click", (event) => {
// 			console.log("проверка клика",event.target)
// 			if (event.target.matches("#loansRequest")) {
// 				if (firstModal._isShown) {
// 					console.log("Attempting to hide firstModal");
// 					// Проверка, открыто ли модальное окно
// 					firstModal.hide();
// 				} else {
// 					console.log("firstModal is not shown");
// 				}

// 				firstModalElement.addEventListener(
// 					"hidden.bs.modal",
// 					function onModalHidden() {
// 						// Показываем второе модальное окно
// 						secondModal.show();
// 						console.log(
// 							"Событие secondModal.show для второго модального окна вызывается."
// 						);

// 						// Удаляем обработчик события, чтобы он не сработал повторно
// 						firstModalElement.removeEventListener(
// 							"hidden.bs.modal",
// 							onModalHidden
// 						);
// 					},
// 					{ once: true }
// 				);
// 				console.log("firstModal перед hide", firstModal);
// 			}
// 		});
// 	}

// 	const settingsLink = document.getElementById("settings-link");
// 	const settingsDropdownLink = document.getElementById(
// 		"settings-dropdown-link"
// 	);
// 	const tabPlace = document.getElementById("tabPlace");

// 	if (settingsLink === null) {
// 		throw new Error("#settings-link not found");
// 	}

// 	if (settingsDropdownLink === null) {
// 		throw new Error("#settings-dropdown-link not found");
// 	}

// 	if (tabPlace === null) {
// 		throw new Error("#tabPlace not found");
// 	}

// 	// Обработчики для настроек
// 	settingsLink.addEventListener("click", (e) => {
// 		e.preventDefault();
// 		activateSettingsTab();
// 	});
// 	settingsDropdownLink.addEventListener("click", (e) => {
// 		e.preventDefault();
// 		activateSettingsTab();
// 	});
// }
function initListeners() {
	const modalPlace = document.getElementById("modalPlace");
	const modalSupport = document.getElementById("modalSupport");
	const modalRequestLoan = document.getElementById("modalRequestLoan");
	const modalLoanForm = document.getElementById("modalLoanForm");

	modalPlace.innerHTML = returnAdminNotificationsModal();
	modalSupport.innerHTML = returnModalSupport();
	modalRequestLoan.innerHTML = returnLoanRequestModal();
	modalLoanForm.innerHTML = returnLoanFormModal();

	const firstModalElement = document.getElementById("fullScreenModal");
	const secondModalElement = document.getElementById("loanFormModal");

	let firstModal, secondModal;

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

	console.log(firstModal, secondModal);

	document.addEventListener("click", function (event) {
		const targetId = event.target.id;

		switch (targetId) {
			case "openFullScreenSearch":
				event.preventDefault();
				event.stopPropagation();
				console.log("Trying to open fullScreenModal");
				console.log("fullScreenModal element:", firstModalElement);
				console.log("fullScreenModal instance:", firstModal);
				if (firstModalElement && firstModal) {
					firstModal.show();
				} else {
					console.error(
						"Cannot show the first modal - element or instance is missing."
					);
				}
				break;
			case "loans":
				const myLoans = document.getElementById("myLoans");
				if (myLoans) {
					myLoans.innerHTML = returnClientLoans();
					initializeSingleTab("#activeReservations");
					initializeDropdowns();
					initializeModals();
				} else {
					console.error("Element #myLoans not found.");
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
				if (typeof activateSettingsTab === "function") {
					activateSettingsTab();
				} else {
					console.error("Function activateSettingsTab() is not defined.");
				}
				break;
			case "navbarDropdownMenuLink":
				initializeDropdown();
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
