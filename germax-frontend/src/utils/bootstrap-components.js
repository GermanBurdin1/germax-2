import Modal from "bootstrap/js/dist/modal";
import Dropdown from "bootstrap/js/dist/dropdown";
import { Tab } from "bootstrap";
import Collapse from "bootstrap/js/dist/collapse";

function initializeCollapseElement(
	collapseElement,
	options = { toggle: false }
) {
	console.log("Initialization Collapse pour l'élément:", collapseElement);
	return new Collapse(collapseElement, options);
}

function initializeModal(idModal) {
	new Modal(document.getElementById(idModal));
	console.log("произошла инициализация");
}

function getModalInstance(idModal) {
	const modalElement = document.getElementById(idModal);
	if (modalElement) {
		console.log(`Инициализация модального окна с ID: ${idModal}`);
		try {
			return new Modal(modalElement, {
				keyboard: true, // Использовать настройки по вашему выбору
				backdrop: "static", // 'true', 'false' или 'static'
			});
		} catch (error) {
			console.error("Ошибка при инициализации модального окна:", error);
		}
	} else {
		console.error(`Элемент модального окна с ID ${idModal} не найден.`);
		return null;
	}
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
				console.log("произошло наведение мыши:", bsDropdown);
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
					console.log("ушло наведение мыши:", bsDropdown);
				}
			}
		});
	});
}

function initializeTabs(tabElements) {
	console.log(
		"вызывалась функция initializeTabs с параметрами:",
		tabElements[0],
		tabElements[1]
	);
	tabElements.forEach(function (triggerEl) {
		console.log(triggerEl);
		const tabTrigger = new Tab(triggerEl);
		console.log(tabTrigger);
		triggerEl.addEventListener("click", function (e) {
			console.log("произошла инициализация вкладки:", tabTrigger);
			e.preventDefault();
			tabTrigger.show();
			console.log("произошла инициализация вкладки:", tabTrigger);
		});
	});
}

function initializeTabsWithoutShow(selector) {
	const tabElements = document.querySelectorAll(selector);
	tabElements.forEach(function (triggerEl) {
		new Tab(triggerEl); // Просто инициализируем, не показываем
	});
}

function initializeSingleTab(selector) {
	const tabElement = document.querySelector(selector);
	if (tabElement) {
		const tab = new Tab(tabElement);
		// Убрать ненужный обработчик клика, если вы хотите сразу показать вкладку
		tab.show(); // Показываем вкладку немедленно
		console.log("инициализированный таб элемент:", tabElement);
	} else {
		console.error("Tab element not found for selector:", selector);
	}
}

function setupTabActivation(buttonSelector, tabSelector) {
	const button = document.querySelector(buttonSelector);
	if (button) {
		button.addEventListener("click", function (e) {
			e.preventDefault();
			const tabElement = document.querySelector(tabSelector);
			if (tabElement) {
				const tab = new Tab(tabElement);
				tab.show();
			}
		});
	}
}

function initializeDropdown() {
	const dropdownToggleEl = document.querySelector(".dropdown-toggle");
	if (dropdownToggleEl) {
		const dropdownInstance = new Dropdown(dropdownToggleEl);
		dropdownToggleEl.addEventListener("click", function (event) {
			console.log("dropdownInstance",dropdownInstance);
			event.preventDefault();
			if (dropdownInstance._element.classList.contains("show")) {
				dropdownInstance.hide();
			} else {
				dropdownInstance.show();
			}
		});
	} else {
		console.error("Элемент для инициализации дропдауна не найден.");
	}
}

function initializeDropdowns() {
	const dropdownElements = document.querySelectorAll(".dropdown-toggle");
	dropdownElements.forEach(function (dropdownToggle) {
		const dropdownInstance = new Dropdown(dropdownToggle); // Создаем экземпляр Dropdown для каждого элемента

		// Добавляем обработчик клика для управления состоянием dropdown
		dropdownToggle.addEventListener("click", function (event) {
			event.preventDefault(); // Предотвратим стандартное поведение ссылки
			// Проверяем, открыт ли dropdown
			if (dropdownInstance._element.classList.contains("show")) {
				dropdownInstance.hide();
			} else {
				dropdownInstance.show();
			}
		});
	});
}

function initializeModals() {
	// Делегирование событий для обработки всех кликов по элементам, которые должны открыть модалки
	document.body.addEventListener("click", function (event) {
		console.log("Клик произошел на элементе:", event.target);
		const toggle = event.target.closest('[data-bs-toggle="modal"]');
		if (toggle) {
			const targetModalId = toggle.dataset.bsTarget;
			const targetModal = document.querySelector(targetModalId);
			if (targetModal) {
				console.log("Найден элемент модального окна", targetModal);
				const modalInstance = new Modal(targetModal);
				modalInstance.show();
				// Удаление modal-backdrop после закрытия модального окна
				targetModal.addEventListener('hidden.bs.modal', function () {
					const backdrops = document.querySelectorAll('.modal-backdrop');
					if (backdrops.length > 0) {
							backdrops.forEach(backdrop => backdrop.remove());
					}
			});
			} else {
				console.error("Modal element not found:", targetModalId);
			}
		}
	});
}

export {
	initializeCollapseElement,
	initializeModal,
	getModalInstance,
	initializeHoverDropdowns,
	initializeTabs,
	initializeSingleTab,
	initializeTabsWithoutShow,
	setupTabActivation,
	initializeDropdown,
	initializeDropdowns,
	initializeModals,
};
