import "./index.css";
import Modal from "bootstrap/js/dist/modal";
import Dropdown from "bootstrap/js/dist/dropdown";
// import { initializeCollapseElement } from "../../../utils/bootstrap-components";
import Tab from "bootstrap/js/dist/tab";
import { sortTable, initializeSortingButtons, attachSortTooltips } from "../../../utils/sort";
import {
	handleArchiveAction,
	handleRestoreClick,
} from "../../../utils/components/hide-data";
import {
	reinitializeDropdowns,
	updateActionButtonsForRow,
} from "../../../utils/dom-utils";
import {
	getAllReservationsAndConflicts,
	saveAllDataToLocalStorage,
	getSavedData,
} from "../../../utils/storage-utils";
import {attachEditRowHandlers} from "../../../utils/components/edit-table-admin"

document.addEventListener("DOMContentLoaded", () => {


	//сортировка
	initializeSortingButtons();
	attachSortTooltips();

	// edit-reservation
	const editReservation = "#reservationsTable .edit-reservation";
	const editConflict = ".edit-conflict";
	attachEditRowHandlers(editReservation);
	attachEditRowHandlers(editConflict);

	function setMinMaxDates() {
		const today = new Date();
		const maxDate = new Date(
			today.getFullYear() + 3,
			today.getMonth(),
			today.getDate()
		);

		// Преобразование в формат YYYY-MM-DD
		const formatDate = (date) => date.toISOString().split("T")[0];

		// Установка атрибутов min и max для полей ввода даты
		document
			.querySelectorAll('.edit-mode[type="date"]')
			.forEach((input) => {
				input.setAttribute("min", formatDate(today));
				input.setAttribute("max", formatDate(maxDate));
			});
	}

	window.addEventListener("load", () => {
		setMinMaxDates();

		// Восстановление состояния сортировки для каждой таблицы
		document.querySelectorAll("table").forEach((table) => {
			const tableId = table.id;
			const tbody = table.querySelector("tbody");
			const sortingKey = tableId + "_sortingColumn";
			const orderKey = tableId + "_sortingOrder";
			const sortingColumn = localStorage.getItem(sortingKey);
			const sortingOrder = localStorage.getItem(orderKey);
			if (sortingColumn && sortingOrder) {
				const thElement = table.querySelector(
					`th[data-column="${sortingColumn}"]`
				);

				if (!thElement) {
					console.error(
						`No th element found for column: ${sortingColumn}`
					);
					return;
				}

				const dataType = thElement.getAttribute("data-type");
				if (!dataType) {
					console.error(
						`No data-type attribute found for th element for column: ${sortingColumn}`
					);
					return; // Прерывание дальнейшего выполнения функции
				}

				const isAscending = sortingOrder === "asc";
				sortTable(tbody, sortingColumn, dataType, isAscending);
			}
		});

		// Восстановление состояния резерваций и перенос их между таблицами

		document.querySelectorAll("tr[data-id], tr[data-id-rapport]").forEach((row) => {
			const isConflict = row.hasAttribute("data-id-rapport");
			const uniqueId = isConflict ? row.dataset.idRapport : row.dataset.id;
			const savedData = getSavedData(uniqueId, isConflict);
			if (savedData) {
				// console.log(`Parsed data for ${isConflict ? "conflict" : "reservation"}:`, savedData);

				// Очистка dataset перед обновлением, чтобы избежать дублирования
				Object.keys(row.dataset).forEach(key => delete row.dataset[key]);

				// Обновление данных элемента
				Object.assign(row.dataset, savedData, isConflict ? {idRapport: uniqueId} : {id: uniqueId});
				// console.log("Dataset after update:", JSON.stringify(row.dataset));

				// Обновление текстового содержимого строк
				updateTextContent(row, savedData);
				// console.log("Обновление текстового содержимого для строки:", row);

				// Определение целевой таблицы для перемещения строки
				let targetBodySelector = isConflict ?
					(savedData.archived ? "#resolvedConflicts tbody" : "#conflictsTable tbody") :
					(savedData.archived ? "#completedReservations tbody" : "#activeReservations tbody");

				const targetBody = document.querySelector(targetBodySelector);
				if (targetBody) {
					// console.log("до апенда:", targetBody);
					targetBody.appendChild(row);
					updateActionButtonsForRow(row, savedData.archived);
					// console.log("после апенда:", targetBody);
				} else {
					// console.error("Target table body not found for selector:", targetBodySelector);
				}
			}
		});

		reinitializeDropdowns();
		initializeTabs();

		function updateTextContent(row, data) {
			const cellMapping = data.user ? {
				1: data.user, // Пользователь
				2: data.equipment, // Оборудование
				3: data.startdate, // Дата начала
				4: data.enddate, // Дата окончания
				5: data.status // Статус
			} : {
				1: data.typeDeRapport, // Тип отчета
				2: data.status, // Статус
				3: data.dateDeclaration, // Дата декларации
				4: data.dateRamassage, // Дата сбора
				5: data.conflictDescription, // Описание
				6: data.idUtilisateur, // ID пользователя
				7: data.idPret // ID займа
			};

			Object.entries(cellMapping).forEach(([index, value]) => {
				row.cells[index].textContent = value || "N/A";
			});
		}

	});

	const dropdownElementList = [].slice.call(
		document.querySelectorAll(".dropdown-toggle")
	);
	const dropdownList = dropdownElementList.map(function (dropdownToggleEl) {
		return new Dropdown(dropdownToggleEl);
	});

	// Voir les détails

	// Инициализируем модальное окно один раз и используем его повторно
	const detailsModal = new Modal(document.getElementById("detailsModal"));

	document.querySelectorAll(".view-details").forEach((item) => {
		item.addEventListener("click", function (event) {
			event.preventDefault();
			// Показываем модальное окно
			detailsModal.show();
		});
	});

	// Suppression des réservations

	document.addEventListener("click", function (event) {
		// Проверяем, содержит ли элемент, по которому кликнули, класс delete-action
		if (event.target.classList.contains("delete-action")) {
			event.preventDefault(); // Отменяем действие по умолчанию, если это необходимо
			const rowToDelete = event.target.closest("tr"); // Находим ближайшую строку таблицы
			if (rowToDelete) {
				rowToDelete.remove(); // Удаляем строку
			}
		}
	});

	initializeTabs();
	function initializeTabs() {
		// Инициализируем все вкладки Bootstrap на странице
		const triggerTabList = [].slice.call(
			document.querySelectorAll('a[data-bs-toggle="tab"]')
		);
		triggerTabList.forEach(function (triggerEl) {
			const tabTrigger = new Tab(triggerEl);

			triggerEl.addEventListener("click", function (event) {
				event.preventDefault();
				tabTrigger.show();
				reinitializeDropdowns();
			});
		});
	}

	reinitializeDropdowns();

	// Прикрепляем обработчики архивации к таблице с активными резервациями и конфликтами
	document
		.querySelectorAll("#reservationTabsContent, #conflictTabsContent")
		.forEach((tabContent) => {
			tabContent.addEventListener("click", function (e) {
				if (e.target.classList.contains("archive-action")) {
					e.stopPropagation();
					const activePane =
						tabContent.querySelector(".tab-pane.active");

					if (activePane) {
						handleArchiveAction(e.target, activePane.id);
					}

					const allData = getAllReservationsAndConflicts();
					saveAllDataToLocalStorage(allData);
				}
			});
		});

	// Прикрепляем обработчики восстановления к таблице с завершенными резервациями и конфликтами
	document
		.querySelectorAll(
			"#completedReservationsTable tbody, #resolvedConflictsTable tbody"
		)
		.forEach((tbody) => {
			tbody.addEventListener("click", function (e) {
				if (
					e.target.tagName === "A" &&
					e.target.textContent.trim() === "Rétablir"
				) {
					e.stopPropagation(); // Остановка всплытия события
					handleRestoreClick(e.target);
				}
			});
		});
});
