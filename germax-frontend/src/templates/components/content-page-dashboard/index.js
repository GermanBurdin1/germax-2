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
	getStockmanHorizontalNav,
	returnModalSupport
} from "../../../utils/dashboard/components/markup";

import {
	getModalInstance,
	initializeTabsWithoutShow,
	setupTabActivation,
	initializeSingleTab,
	initializeDropdown,
} from "../../../utils/bootstrap-components";

document.addEventListener("DOMContentLoaded", function () {
	const userType = localStorage.getItem("userType");
	if (userType) {
		adjustUIBasedOnUserType(userType);
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
				horizontalNav = getStockmanHorizontalNav()
				verticalNav = getStockmanNav();
				break;
			case "student":
				verticalNav = getStudentNav();
				break;
			case "teacher":
				verticalNav = getTeacherNav();
				break;
			default:
				console.log("Unknown user type");
		}
		dynamicMenu.innerHTML = verticalNav; // Вставка подготовленного контента в меню
		horizontalNavbar.innerHTML = horizontalNav;
		initializeDropdown();
	}

	const modalPlace = document.getElementById("modalPlace");
	const modalSupport = document.getElementById("modalSupport");
	modalPlace.innerHTML = returnAdminNotificationsModal();
	modalSupport.innerHTML = returnModalSupport();

	const settingsLink = document.getElementById("settings-link");
	const settingsDropdownLink = document.getElementById(
		"settings-dropdown-link"
	);
	const tabPlace = document.getElementById("tabPlace");

	// Получаем экземпляр модального окна
	const notificationsModal = getModalInstance("notificationsModal");

	// Добавляем обработчик на кнопку, которая должна открыть модальное окно
	document
		.querySelector("[data-bs-toggle='modal']")
		.addEventListener("click", () => {
			notificationsModal.show();
		});

	// Обработчик для ссылки в горизонтальном меню
	settingsLink.addEventListener("click", (e) => {
		e.preventDefault();
		activateSettingsTab();
	});

	// Обработчик для ссылки в выпадающем меню
	settingsDropdownLink.addEventListener("click", (e) => {
		e.preventDefault();
		activateSettingsTab();
	});

	function activateSettingsTab() {
		tabPlace.innerHTML = returnSettingsTab();
		initializeTabsWithoutShow("#myTab .nav-link");
		setupTabActivation("#settings-tab", "#settings-tab");
		setupTabActivation("#general-tab", "#general-tab");
		initializeSingleTab("#general-tab");
	}
});
