import Modal from "bootstrap/js/dist/modal";
import Dropdown from "bootstrap/js/dist/dropdown";
import { Tab } from "bootstrap";

function initializeModal(idModal) {
	new Modal(document.getElementById(idModal));
}

function getModalInstance(idModal) {
	return new Modal(document.getElementById(idModal));
}

// Инициализация и показ/скрытие выпадающего меню при наведении мыши

function initializeHoverDropdowns(dropdowns) {
	dropdowns.forEach((dropdown) => {
		dropdown.addEventListener("mouseenter", (e) => {
			let dropdownToggle = dropdown.querySelector(
				'[data-bs-toggle="dropdown"]'
			);
			if (dropdownToggle) {
				let bsDropdown = new Dropdown(dropdownToggle);
				bsDropdown.show();
				console.log("произошло наведение мыши:",bsDropdown );
			}
		});

		dropdown.addEventListener("mouseleave", (e) => {
			let dropdownToggle = dropdown.querySelector(
				'[data-bs-toggle="dropdown"]'
			);
			if (dropdownToggle) {
				let bsDropdown = Dropdown.getInstance(dropdownToggle);
				if (bsDropdown) {
					bsDropdown.hide();
					console.log("ушло наведение мыши:",bsDropdown );
				}
			}
		});
	});
}

function initializeTabs(tabElements) {
	console.log("вызывалась функция initializeTabs с параметрами:",tabElements[0],tabElements[1] );
    tabElements.forEach(function(triggerEl) {
		console.log(triggerEl);
        const tabTrigger = new Tab(triggerEl);
		console.log(tabTrigger);
        triggerEl.addEventListener("click", function(e) {
			console.log("произошла инициализация вкладки:",tabTrigger );
            e.preventDefault();
            tabTrigger.show();
			console.log("произошла инициализация вкладки:",tabTrigger )
        });
    });
}

function initializeSingleTab(selector) {
    console.log("функция initializeSingleTab сработала");
    const tabElement = document.querySelector(selector);
    console.log("назначен элемент таблицы функции initializeSingleTab", tabElement);
    if (tabElement) {
        const tab = new Tab(tabElement);
        // Убрать ненужный обработчик клика, если вы хотите сразу показать вкладку
        tab.show(); // Показываем вкладку немедленно
        console.log("инициализированный таб элемент:", tabElement);
    } else {
        console.error("Tab element not found for selector:", selector);
    }
}

export { initializeModal, getModalInstance, initializeHoverDropdowns, initializeTabs, initializeSingleTab };
