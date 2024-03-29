import "./index.css";
import Modal from "bootstrap/js/dist/modal";
import Collapse from "bootstrap/js/dist/collapse";
import Dropdown from "bootstrap/js/dist/dropdown";

document.addEventListener("DOMContentLoaded", () => {
	console.log("Начало выполнения кода внутри DOMContentLoaded");
	const generateReportButton = document.querySelector(
		'button[data-toggle="modal"]'
	);
	// const generateReportModal = new Modal(
	// 	document.getElementById("generateReportModal")
	// );

	// generateReportButton.addEventListener("click", () => {
	// 	generateReportModal.show();
	// });

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

	let sortOrder = {
		id: true,
		user: true,
		startDate: true,
		endDate: true,
		status: true,
	};

	function sortTable(column, dataType) {
		const tbody = document.querySelector("#reservationsTable tbody");
		const rows = Array.from(tbody.querySelectorAll("tr"));

		let sortedRows;
		if (column === "status") {
			sortedRows = sortByStatus(rows, sortOrder[column]);
		} else {
			sortedRows = rows.sort((a, b) => {
				let aValue, bValue;
				if (dataType === "number") {
					aValue = Number(a.dataset[column]);
					bValue = Number(b.dataset[column]);
				} else if (dataType === "date") {
					aValue = new Date(a.dataset[column]);
					bValue = new Date(b.dataset[column]);
				} else {
					// text and others
					aValue = a.dataset[column].toLowerCase();
					bValue = b.dataset[column].toLowerCase();
				}

				if (dataType === "text") {
					return sortOrder[column]
						? aValue < bValue
							? -1
							: 1
						: aValue > bValue
						? -1
						: 1;
				} else {
					return sortOrder[column]
						? aValue - bValue
						: bValue - aValue;
				}
			});
		}

		// Toggle sort order for next click
		sortOrder[column] = !sortOrder[column];

		// Update DOM
		tbody.innerHTML = "";
		sortedRows.forEach((row) => tbody.appendChild(row));
	}

	function sortByStatus(rows, ascending) {
		// Определение приоритетов статусов
		const statusPriority = ascending
			? {
					Actif: 1,
					"En attente": 2,
					Annulé: 3,
			  }
			: {
					Annulé: 1,
					"En attente": 2,
					Actif: 3,
			  };

		return rows.sort((a, b) => {
			const priorityA = statusPriority[a.dataset.status] || 999;
			const priorityB = statusPriority[b.dataset.status] || 999;
			return priorityA - priorityB;
		});
	}

	document
		.getElementById("sortById")
		.addEventListener("click", () => sortTable("id", "number"));
	document
		.getElementById("sortByUser")
		.addEventListener("click", () => sortTable("user", "text"));
	document
		.getElementById("sortByEquipment")
		.addEventListener("click", () => sortTable("equipment", "text")); // Исправлено
	document
		.getElementById("sortByStartDate")
		.addEventListener("click", () => sortTable("startdate", "date"));
	document
		.getElementById("sortByEndDate")
		.addEventListener("click", () => sortTable("enddate", "date"));
	document
		.getElementById("sortByStatus")
		.addEventListener("click", () => sortTable("status", "text"));

	// Всплывающие подсказки для кнопок сортировки
	document.querySelectorAll(".btn-link").forEach((btn) => {
		btn.addEventListener("mouseenter", (e) => {
			const sortType = e.target.closest("th").textContent.trim();
			e.target.title = `Sort by ${sortType}`;
		});
	});

	// edit-reservation

	document.querySelectorAll(".edit-reservation").forEach((item) => {
		item.addEventListener("click", function(event) {
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
		row.querySelectorAll("span.view-mode, .edit-mode").forEach((element) => {
			element.classList.toggle("d-none");
		});
	}

	function initializeRowForEditing(row) {
		const statusSelect = row.querySelector("select.edit-mode");
		if (statusSelect) {
			const currentStatus = row.dataset.status; // Используем dataset для получения текущего статуса
			statusSelect.value = currentStatus;
		}
	}

	function saveChanges(row) {
		// Обновляем данные в DOM и dataset
		const inputs = row.querySelectorAll(".edit-mode");
		inputs.forEach(input => {
			if (input.type === "date") {
				const dateSpan = row.querySelector(`span[data-name="${input.name}"]`);
				dateSpan.textContent = input.value; // Обновляем отображаемую дату
				row.dataset[input.name] = input.value; // Обновляем dataset
			}
		});

		const statusSelect = row.querySelector("select.edit-mode");
		if (statusSelect) {
			const statusSpan = row.querySelector("td:nth-child(6) span");
			statusSpan.textContent = statusSelect.options[statusSelect.selectedIndex].text;
			row.dataset.status = statusSelect.value; // Обновляем dataset
		}

		// Формирование объекта данных для сохранения
		const reservationData = {
			id: row.dataset.id,
			user: row.dataset.user,
			equipment: row.dataset.equipment,
			startDate: row.dataset.startdate,
			endDate: row.dataset.enddate,
			status: row.dataset.status
		};

		// Сохранение в LocalStorage
		localStorage.setItem(`reservation_${reservationData.id}`, JSON.stringify(reservationData));

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
			saveBtn.addEventListener("click", function() {
				saveChanges(row);
			});
			row.querySelector("td:last-child").appendChild(saveBtn);
		}

		if (!row.querySelector(".cancel-changes")) {
			const cancelBtn = document.createElement("button");
			cancelBtn.textContent = "Отменить изменения";
			cancelBtn.classList.add("btn", "btn-danger", "cancel-changes");
			cancelBtn.addEventListener("click", function() {
				toggleElements(row, false);
				row.classList.remove("editing");
				// Удаляем кнопки
				removeSaveCancelButtons(row);
			});
			row.querySelector("td:last-child").appendChild(cancelBtn);
		}
	}

	function removeSaveCancelButtons(row) {
		row.querySelectorAll(".save-changes, .cancel-changes").forEach(button => button.remove());
	}

	window.addEventListener("load", () => {
		document.querySelectorAll("tr[data-id]").forEach(row => {
			const reservationId = row.dataset.id;
			const savedData = localStorage.getItem(`reservation_${reservationId}`);
			if (savedData) {
				const {user, equipment, startDate, endDate, status} = JSON.parse(savedData);
				row.dataset.user = user;
				row.dataset.equipment = equipment;
				row.dataset.startdate = startDate;
				row.dataset.enddate = endDate;
				row.dataset.status = status;

				row.querySelector("td:nth-child(2)").textContent = user;
				row.querySelector("td:nth-child(3)").textContent = equipment;
				row.querySelector(`span[data-name="startdate"]`).textContent = startDate;
				row.querySelector(`span[data-name="enddate"]`).textContent = endDate;
				row.querySelector("td:nth-child(6) span").textContent = status;
			}
		});
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
	console.log("Конец выполнения кода внутри DOMContentLoaded");
});
