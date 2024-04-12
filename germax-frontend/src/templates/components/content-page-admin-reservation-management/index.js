import "./index.css";
import Modal from "bootstrap/js/dist/modal";
import Collapse from "bootstrap/js/dist/collapse";
import Dropdown from "bootstrap/js/dist/dropdown";
import Tab from "bootstrap/js/dist/tab";
import { sortTable } from "../../../utils/sort";
import {COMPLETED_RESERVATIONS_SELECTOR_MANAGEMENT_RESERVATIONS, COMPLETED_RESERVATIONS_SELECTOR_CONFLICTS, ARIA_LABELLED_BY_ACTIVE_RESERVATIONS_TAB, ARIA_LABELLED_BY_ACTIVE_RESERVATIONS_TAB_CONFLICTS} from "../../../utils/const";

document.addEventListener("DOMContentLoaded", () => {
	console.log("Начало выполнения кода внутри DOMContentLoaded");
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
			const tbody = header.closest("table").querySelector("tbody");

			// Определение направления сортировки
			const currentSortingColumn = localStorage.getItem("sortingColumn");
			let isAscending = true; // Значение по умолчанию
			if (currentSortingColumn === column) {
				// Инвертируем направление, если предыдущая сортировка была по этому же столбцу
				isAscending = localStorage.getItem("sortingOrder") !== "asc";
			}
			localStorage.setItem("sortingColumn", column);
			localStorage.setItem("sortingOrder", isAscending ? "asc" : "desc");

			// Вызываем функцию сортировки с обновленными параметрами
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
		document.querySelectorAll("tr[data-id]").forEach((row) => {
			const reservationId = row.dataset.id;
			const savedData = localStorage.getItem(
				`reservation_${reservationId}`
			);
			if (savedData) {
				const reservationData = JSON.parse(savedData);
				row.dataset.user = reservationData.user;
				row.dataset.equipment = reservationData.equipment;
				row.dataset.startdate = reservationData.startDate;
				row.dataset.enddate = reservationData.endDate;
				row.dataset.status = reservationData.status;

				// Обновление текста в строке на основе сохранённых данных
				row.querySelector("td:nth-child(2)").textContent =
					reservationData.user;
				row.querySelector("td:nth-child(3)").textContent =
					reservationData.equipment;
				row.querySelector(`span[data-name="startdate"]`).textContent =
					reservationData.startDate;
				row.querySelector(`span[data-name="enddate"]`).textContent =
					reservationData.endDate;
				row.querySelector("td:nth-child(6) span").textContent =
					reservationData.status;

				// Проверка статуса архивации и перемещение строки в соответствующий раздел
				if (reservationData.archived) {
					const completedReservationsBody = document.querySelector(
						"#completedReservations tbody"
					);
					completedReservationsBody.appendChild(row);
					updateActionButtonsForRow(row, true); // Обновляем кнопки для архивированных строк
				} else {
					const activeReservationsBody = document.querySelector(
						"#activeReservations tbody"
					);
					activeReservationsBody.appendChild(row);
					updateActionButtonsForRow(row, false); // Обновляем кнопки для активных строк
				}
			}
		});

		// Дополнительные функции, такие как reinitializeDropdowns, initializeTabs и прочие
		reinitializeDropdowns();
		initializeTabs();

		// Восстановление состояния сортировки
		const sortingColumn = localStorage.getItem("sortingColumn");
		const sortingOrder = localStorage.getItem("sortingOrder");
		if (sortingColumn && sortingOrder) {
			const isAscending = sortingOrder === "asc";
			const tbody = document.querySelector("#reservationsTable tbody");
			const dataType = document
				.querySelector(`th[data-column="${sortingColumn}"]`)
				.getAttribute("data-type");
			sortTable(tbody, sortingColumn, dataType, isAscending);
		}

		// Инициализация других компонентов страницы
		reinitializeDropdowns();
		initializeTabs();
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
		console.log("клик срабатывает");
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

	function reinitializeDropdowns() {
		document
			.querySelectorAll(".dropdown-toggle")
			.forEach((dropdownToggleEl) => {
				new Dropdown(dropdownToggleEl); // Используйте Dropdown напрямую
			});
		console.log("Dropdown успешно переинициализированы");
	}

	// Назначение обработчиков для кнопок "Архивировать"
	document.querySelectorAll(".archive-action").forEach((button) => {
		attachArchiveHandler(button);
	});

	// Назначение обработчиков для кнопок "Восстановить" (если они изначально присутствуют в DOM)
	document.querySelectorAll(".restore-action").forEach((button) => {
		attachRestoreHandler(button);
	});

	function attachArchiveHandler(button) {
		button.addEventListener("click", function (event) {
			event.preventDefault();
			const row = button.closest("tr");
			const completedReservationsBody = document.querySelector(
				"#completedReservations tbody"
			);
			completedReservationsBody.appendChild(row);

			// Обновляем действия для строки
			updateActionButtonsForRow(row, true);

			// Переключаемся на вкладку 'Завершенные резервации'
			const completedTab = new Tab(
				document.querySelector("#completed-reservations-tab")
			);
			completedTab.show();

			reinitializeDropdowns();

			const reservationId = row.dataset.id;
			const reservationData =
				JSON.parse(
					localStorage.getItem(`reservation_${reservationId}`)
				) || {};
			reservationData.archived = true; // Устанавливаем статус архивации
			localStorage.setItem(
				`reservation_${reservationId}`,
				JSON.stringify(reservationData)
			);

			updateActionButtonsForRow(row, true);
		});
	}

	function attachRestoreHandler(button) {
		button.addEventListener("click", function () {
			const row = button.closest("tr");
			const reservationId = row.dataset.id;
			// Получаем данные о бронировании из localStorage
			const reservationData =
				JSON.parse(
					localStorage.getItem(`reservation_${reservationId}`)
				) || {};

			// Обновляем статус архивации
			reservationData.archived = false; // Указываем, что бронирование больше не архивировано

			// Сохраняем обновлённые данные обратно в localStorage
			localStorage.setItem(
				`reservation_${reservationId}`,
				JSON.stringify(reservationData)
			);

			const activeReservationsBody = document.querySelector(
				"#activeReservations tbody"
			);
			activeReservationsBody.appendChild(row);
			updateActionButtonsForRow(row, false); // Обновляем кнопки для активных строк

			// Не забудьте вызвать функции переинициализации компонентов, если это необходимо
			reinitializeDropdowns();
		});
	}

	function updateActionButtonsForRow(row, archived) {
		// Находим все нужные элементы внутри строки
		const editButton = row.querySelector(".edit-reservation");
		const deleteButton = row.querySelector(".delete-action");
		const detailButton = row.querySelector(".view-details");
		const archiveButton = row.querySelector(".archive-action");
		const restoreButton = row.querySelector(".restore-action a"); // Обратите внимание, что в вашем HTML восстановление обёрнуто в <a>

		// Устанавливаем видимость кнопок в зависимости от того, архивирована ли запись
		if (archived) {
			// Для архивированных записей скрываем кнопки "Редактировать", "Посмотреть детали" и "Архивировать"
			if (editButton) editButton.classList.add("d-none");
			if (detailButton) detailButton.classList.add("d-none");
			if (archiveButton) archiveButton.classList.add("d-none");

			// Показываем кнопку "Восстановить" и "Удалить"
			if (restoreButton)
				restoreButton.parentNode.classList.remove("d-none"); // Используем parentNode, чтобы управлять видимостью <li>
			if (deleteButton) deleteButton.classList.remove("d-none");
		} else {
			// Для активных записей возвращаем видимость кнопок "Редактировать", "Посмотреть детали" и "Архивировать"
			if (editButton) editButton.classList.remove("d-none");
			if (detailButton) detailButton.classList.remove("d-none");
			if (archiveButton) archiveButton.classList.remove("d-none");

			// Скрываем кнопку "Восстановить"
			if (restoreButton) restoreButton.parentNode.classList.add("d-none");
			if (deleteButton) deleteButton.classList.add("d-none"); // Предположим, что кнопку "Удалить" мы хотим показывать только в архиве
		}
	}
});
