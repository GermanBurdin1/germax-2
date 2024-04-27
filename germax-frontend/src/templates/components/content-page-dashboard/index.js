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
	getModalInstance,
	initializeTabsWithoutShow,
	setupTabActivation,
	initializeSingleTab,
	initializeDropdown,
	initializeDropdowns,
	initializeModals,
} from "../../../utils/bootstrap-components";
import { returnClientLoans } from "../../../utils/dashboard/loans";
import Modal from "bootstrap/js/dist/modal";

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

	document.addEventListener("click", function (event) {
		// Обработчик для клика по ссылке 'Mes locations'
		if (event.target.matches("#loans")) {
			const myLoans = document.getElementById("myLoans");
			if (myLoans) {
				myLoans.innerHTML = returnClientLoans();
				initializeSingleTab("#activeReservations");
				initializeDropdowns();
				initializeModals();
			}
		}
	});

	const modalPlace = document.getElementById("modalPlace");
	const modalSupport = document.getElementById("modalSupport");
	modalPlace.innerHTML = returnAdminNotificationsModal();
	modalSupport.innerHTML = returnModalSupport();

	const settingsLink = document.getElementById("settings-link");
	const settingsDropdownLink = document.getElementById(
		"settings-dropdown-link"
	);
	const tabPlace = document.getElementById("tabPlace");

	// Обработчики для настроек
	settingsLink.addEventListener("click", (e) => {
		e.preventDefault();
		activateSettingsTab();
	});
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
