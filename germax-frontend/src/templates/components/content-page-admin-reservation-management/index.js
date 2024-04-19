import "./index.css";
import Modal from "bootstrap/js/dist/modal";
import Collapse from "bootstrap/js/dist/collapse";
import Dropdown from "bootstrap/js/dist/dropdown";
import Tab from "bootstrap/js/dist/tab";
import { sortTable } from "../../../utils/sort";
import {
	handleArchiveAction,
	handleRestoreClick,
} from "../../../utils/action-handlers";
import {
	reinitializeDropdowns,
	updateActionButtonsForRow,
} from "../../../utils/dom-utils";
import {
	getAllReservationsAndConflicts,
	saveAllDataToLocalStorage,
	getSavedData,
} from "../../../utils/storage-utils";

document.addEventListener("DOMContentLoaded", () => {
	// restoreDataFromLocalStorage();
	const generateReportButton = document.querySelector(
		'button[data-toggle="modal"]'
	);
	const searchButton = document.querySelector(
		'button[data-bs-toggle="collapse"]'
	);
	let collapseElement = document.getElementById("searchConflictsSection");
	let collapse = new Collapse(collapseElement, {
		toggle: false, // Это говорит о том, что Collapse не должен автоматически переключаться при инициализации
	});

	searchButton.addEventListener("click", () => {
		collapse.toggle(); // Это будет переключать видимость вашего collapse элемента
	});

	const filterUser = document.getElementById("filterUser");
	const filterEquipment = document.getElementById("filterEquipment");
	const filterStatus = document.getElementById("filterStatus");

	function fetchData() {
		const selectedUsers = Array.from(filterUser.selectedOptions)
			.map((option) => option.value)
			.join(",");
		const selectedEquipments = Array.from(filterEquipment.selectedOptions)
			.map((option) => option.value)
			.join(",");
		const selectedStatuses = Array.from(filterStatus.selectedOptions)
			.map((option) => option.value)
			.join(",");

		// Пример URL, который может быть использован для запроса к серверу
		// Необходимо адаптировать URL и параметры в соответствии с вашим API
		const url = `/api/reservations?users=${selectedUsers}&equipments=${selectedEquipments}&status=${selectedStatuses}`;

		fetch(url)
			.then((response) => response.json())
			.then((data) => updateTable(data))
			.catch((error) => console.error("Error fetching data:", error));
	}

	function updateTable(data) {
		const tbody = document.querySelector("#reservationsTable tbody");
		tbody.innerHTML = ""; // Очищаем текущее содержимое таблицы

		// Создаем новые строки таблицы на основе полученных данных
		data.forEach((rowData) => {
			const tr = document.createElement("tr");
			tr.innerHTML = `
                <td>${rowData.id}</td>
                <td>${rowData.user}</td>
                <td>${rowData.equipment}</td>
                <td>${rowData.startDate}</td>
                <td>${rowData.endDate}</td>
                <td>${rowData.status}</td>
                <td><button class="btn btn-primary">Détails</button></td>
            `;
			tbody.appendChild(tr);
		});
	}

	[filterUser, filterEquipment, filterStatus].forEach((filter) => {
		filter.addEventListener("change", fetchData);
	});

	//sort
	document.querySelectorAll(".sortButton").forEach((button) => {
		button.addEventListener("click", function () {
			const header = this.closest("th");
			const column = header.getAttribute("data-column");
			const dataType = header.getAttribute("data-type");
			const table = header.closest("table");
			const tbody = table.querySelector("tbody");

			if (!header || !column || !dataType || !table || !tbody) {
				console.error("One of the elements is not found.");
				return;
			}

			const sortingKey = table.id + "_sortingColumn";
			const orderKey = table.id + "_sortingOrder";
			const isAscending = localStorage.getItem(orderKey) !== "asc";

			localStorage.setItem(sortingKey, column);
			localStorage.setItem(orderKey, isAscending ? "asc" : "desc");

			sortTable(tbody, column, dataType, isAscending);
		});
	});

	// Всплывающие подсказки для кнопок сортировки
	document.querySelectorAll(".btn-link").forEach((btn) => {
		btn.addEventListener("mouseenter", (e) => {
			const sortType = e.target.closest("th").textContent.trim();
			e.target.title = `Sort by ${sortType}`;
		});
	});

	// edit-reservation

	document.querySelectorAll(".edit-reservation").forEach((item) => {
		item.addEventListener("click", function (event) {
			event.preventDefault();
			const row = this.closest("tr");
			row.classList.add("editing");

			// Переключение видимости элементов и установка текущего значения для select
			toggleElements(row, true);
			initializeRowForEditing(row);

			// Добавляем кнопки сохранения и отмены, если они еще не добавлены
			addSaveCancelButtons(row);
		});
	});

	function toggleElements(row, isEditing) {
		row.querySelectorAll("span.view-mode, .edit-mode").forEach(
			(element) => {
				element.classList.toggle("d-none");
			}
		);
	}

	function initializeRowForEditing(row) {
		const statusSelect = row.querySelector("select.edit-mode");
		const startDateInput = row.querySelector('input[name="startdate"]');
		const endDateInput = row.querySelector('input[name="enddate"]');

		// Устанавливаем текущее значение статуса из dataset
		if (statusSelect) {
			const currentStatus = row.dataset.status;
			statusSelect.value = currentStatus;
		}

		// Устанавливаем текущие значения дат из dataset
		if (startDateInput && endDateInput) {
			startDateInput.value = row.dataset.startdate;
			endDateInput.value = row.dataset.enddate;
		}
	}

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

	function saveChanges(row) {
		const inputs = row.querySelectorAll(".edit-mode");
		let isValidDate = true; // Флаг валидности дат
		let startDate = null;
		let endDate = null;

		inputs.forEach((input) => {
			const errorMessageSpan =
				input.nextElementSibling &&
				input.nextElementSibling.classList.contains("error-message")
					? input.nextElementSibling
					: null;

			if (input.type === "date") {
				if (errorMessageSpan) {
					errorMessageSpan.classList.add("d-none");
					errorMessageSpan.textContent = ""; // Очищаем предыдущие сообщения об ошибке
				}

				const dateValue = input.value ? new Date(input.value) : null;
				const minDate = new Date(input.getAttribute("min"));
				const maxDate = new Date(input.getAttribute("max"));

				if (
					dateValue &&
					(isNaN(dateValue.getTime()) ||
						dateValue < minDate ||
						dateValue > maxDate)
				) {
					isValidDate = false;
					if (errorMessageSpan) {
						errorMessageSpan.classList.remove("d-none");
						errorMessageSpan.textContent =
							"La date sélectionnée dépasse les limites autorisées. Veuillez choisir une date à partir d'aujourd'hui et dans les 3 prochaines années.";
					}
				} else if (!dateValue || isNaN(dateValue.getTime())) {
					isValidDate = false;
					if (errorMessageSpan) {
						errorMessageSpan.classList.remove("d-none");
						errorMessageSpan.textContent =
							"La date entrée est invalide.";
					}
				} else {
					// Запоминаем значения даты начала и окончания
					if (input.name === "startdate") {
						startDate = dateValue;
					} else if (input.name === "enddate") {
						endDate = dateValue;
					}
				}
			}
		});

		// Проверка, что дата начала не больше даты окончания
		if (startDate && endDate && startDate > endDate) {
			isValidDate = false;
			// Находим элементы для сообщения об ошибке у конкретных полей даты начала и окончания
			const startErrorMessageSpan = row.querySelector(
				'input[name="startdate"]'
			).nextElementSibling;
			const endErrorMessageSpan = row.querySelector(
				'input[name="enddate"]'
			).nextElementSibling;

			if (startErrorMessageSpan && endErrorMessageSpan) {
				startErrorMessageSpan.classList.remove("d-none");
				startErrorMessageSpan.textContent =
					"La date de début doit être antérieure à la date de fin.";
				endErrorMessageSpan.classList.remove("d-none");
				endErrorMessageSpan.textContent = "";
			}
		}

		if (!isValidDate) return; // Прекращаем выполнение функции, если дата невалидна

		const statusSelect = row.querySelector("select.edit-mode");
		if (statusSelect) {
			const statusSpan = row.querySelector("td:nth-child(6) span");
			statusSpan.textContent =
				statusSelect.options[statusSelect.selectedIndex].text;
			// Обновляем dataset статуса
			row.dataset.status = statusSelect.value;
		}

		// Формирование объекта данных для сохранения
		const reservationData = {
			id: row.dataset.id,
			user: row.dataset.user,
			equipment: row.dataset.equipment,
			startDate: row.dataset.startdate,
			endDate: row.dataset.enddate,
			status: row.dataset.status,
		};

		// Сохранение в LocalStorage
		localStorage.setItem(
			`reservation_${reservationData.id}`,
			JSON.stringify(reservationData)
		);

		// Очистка редактора и возвращение в исходное состояние
		toggleElements(row, false);
		row.classList.remove("editing");
		removeSaveCancelButtons(row);
	}

	function addSaveCancelButtons(row) {
		if (!row.querySelector(".save-changes")) {
			const saveBtn = document.createElement("button");
			saveBtn.textContent = "Сохранить изменения";
			saveBtn.classList.add("btn", "btn-success", "save-changes");
			saveBtn.addEventListener("click", function () {
				saveChanges(row);
			});
			row.querySelector("td:last-child").appendChild(saveBtn);
		}

		if (!row.querySelector(".cancel-changes")) {
			const cancelBtn = document.createElement("button");
			cancelBtn.textContent = "Отменить изменения";
			cancelBtn.classList.add("btn", "btn-danger", "cancel-changes");
			cancelBtn.addEventListener("click", function () {
				toggleElements(row, false);
				row.classList.remove("editing");
				// Удаляем кнопки
				removeSaveCancelButtons(row);
			});
			row.querySelector("td:last-child").appendChild(cancelBtn);
		}
	}

	function removeSaveCancelButtons(row) {
		row.querySelectorAll(".save-changes, .cancel-changes").forEach(
			(button) => button.remove()
		);
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
		console.log("Restoring rows based on saved data...");

		document.querySelectorAll("tr[data-id], tr[data-id-rapport]").forEach((row) => {
			const isConflict = row.hasAttribute("data-id-rapport");
			const uniqueId = isConflict ? row.dataset.idRapport : row.dataset.id;
			const savedData = getSavedData(uniqueId, isConflict);
			console.log(`Данные, полученные из localStorage для ID ${uniqueId}:`, savedData);

			if (savedData) {
				console.log(`Parsed data for ${isConflict ? "conflict" : "reservation"}:`, savedData);

				// Очистка dataset перед обновлением, чтобы избежать дублирования
				Object.keys(row.dataset).forEach(key => delete row.dataset[key]);

				// Обновление данных элемента
				Object.assign(row.dataset, savedData, {id: uniqueId});
				console.log("Dataset after update:", JSON.stringify(row.dataset));

				// Обновление текстового содержимого строк
				updateTextContent(row, savedData);
				console.log("Обновление текстового содержимого для строки:", row);

				// Определение целевой таблицы для перемещения строки
				let targetBodySelector = isConflict ?
					(savedData.archived ? "#resolvedConflicts tbody" : "#conflictsTable tbody") :
					(savedData.archived ? "#completedReservations tbody" : "#activeReservations tbody");

				const targetBody = document.querySelector(targetBodySelector);
				if (targetBody) {
					console.log("до апенда:", targetBody);
					targetBody.appendChild(row);
					updateActionButtonsForRow(row, savedData.archived);
					console.log("после апенда:", targetBody);
				} else {
					console.error("Target table body not found for selector:", targetBodySelector);
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
				1: data.reportType, // Тип отчета
				2: data.reportStatus, // Статус
				3: data.reportDateDeclaration, // Дата декларации
				4: data.reportPickupDate, // Дата сбора
				5: data.reportDescription, // Описание
				6: data.reportIdUser, // ID пользователя
				7: data.reportIdLoan // ID займа
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
