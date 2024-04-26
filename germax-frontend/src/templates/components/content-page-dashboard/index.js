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
} from "../../../utils/dashboard/components/markup";

import {
	getModalInstance,
	initializeTabsWithoutShow,
	setupTabActivation,
	initializeSingleTab
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
	}

	const modalPlace = document.getElementById("modalPlace"); // Элемент, где будет размещено модальное окно
	modalPlace.innerHTML = returnAdminNotificationsModal();

	const settingsLink = document.getElementById("settings-link");
	const tabPlace = document.getElementById("tabPlace");

	// Получаем экземпляр модального окна
	const notificationsModal = getModalInstance("notificationsModal");

	// Добавляем обработчик на кнопку, которая должна открыть модальное окно
	document
		.querySelector("[data-bs-toggle='modal']")
		.addEventListener("click", () => {
			notificationsModal.show();
		});

	settingsLink.addEventListener("click", (e) => {
		e.preventDefault(); // Предотвратить стандартное действие
		tabPlace.innerHTML = returnSettingsTab();

		initializeTabsWithoutShow("#myTab .nav-link");

		// Добавляем обработчики для активации вкладок
		setupTabActivation("#settings-tab", "#settings-tab");
		setupTabActivation("#general-tab", "#general-tab");

		initializeSingleTab("#general-tab");
	});
});
