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
	initializeModals,
} from "../../../utils/bootstrap-components";
import { returnClientLoans, returnLoanRequestModal } from "../../../utils/dashboard/loans";
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
	const modalRequestLoan = document.getElementById("modalRequestLoan");
	modalPlace.innerHTML = returnAdminNotificationsModal();
	modalSupport.innerHTML = returnModalSupport();
	modalRequestLoan.innerHTML = returnLoanRequestModal();

	const firstModalElement = document.getElementById('fullScreenModal');
  const secondModalElement = document.getElementById('loanFormModal');
  if (firstModalElement && secondModalElement) {
    const firstModal = new Modal(firstModalElement);
    const secondModal = new Modal(secondModalElement);

    // Обработчик для кнопки, открывающей первое модальное окно
    firstModalElement.addEventListener('shown.bs.modal', () => {
			console.log("обработчик сработал на:",firstModalElement)
      // Кнопка в первом модальном окне, которая откроет второе модальное окно
      const loansRequestButton = firstModalElement.querySelector('#loansRequest');
      if (loansRequestButton) {
        loansRequestButton.addEventListener('click', () => {
          // Скрыть первое модальное окно
          firstModal.hide();
          // Показать второе модальное окно
          secondModal.show();
        });
      }
    });
  }

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
