import {
	reinitializeDropdowns,
	updateActionButtonsForRow,
} from "./dom-utils.js";
import {
	saveReservationToLocalStorage,
	getSavedData,
	saveDataToLocalStorage,
	saveAllDataToLocalStorage,
	getAllReservationsAndConflicts,
} from "./storage-utils.js";
import Tab from "bootstrap/js/dist/tab";

function attachArchiveHandler(button, tableSelector, tabSelector) {
	const row = button.closest("tr");
	const isConflict = row.hasAttribute("data-id-rapport");
	const uniqueId = isConflict ? row.dataset.idRapport : row.dataset.id;

	if (!uniqueId) {
		console.error("No unique ID found for archiving.");
		return;
	}

	// Определяем ключ для сохранения в localStorage
	const storageKey = isConflict
		? `conflict_${uniqueId}`
		: `reservation_${uniqueId}`;

	// Формируем объект для сохранения, в зависимости от того, резервация это или конфликт
	const dataToSave = isConflict
		? {
				// Данные конфликта
				reportType: row.dataset.typeDeRapport,
				reportStatus: row.dataset.status,
				reportDateDeclaration: row.dataset.dateDeclaration,
				reportPickupDate: row.dataset.dateRamassage,
				reportDescription: row.dataset.conflictDescription,
				reportIdUser: row.dataset.idUtilisateur,
				reportIdLoan: row.dataset.idPret,
		  }
		: {
				// Данные резервации
				loanUser: row.dataset.user,
				loanEquipment: row.dataset.equipment,
				loanStartDate: row.dataset.startdate,
				loanEndDate: row.dataset.enddate,
				loanStatus: row.dataset.status,
		  };

	// Добавляем флаг архивации
	dataToSave.archived = true;

	// Сохраняем данные в localStorage
	saveDataToLocalStorage(storageKey, dataToSave);

	// Перемещаем строку в соответствующую таблицу
	const targetTableBody = document.querySelector(tableSelector);
	if (targetTableBody) {
		targetTableBody.appendChild(row);
		updateActionButtonsForRow(row, true);
		reinitializeDropdowns();

		// Активируем соответствующую вкладку
		const tabToShow = document.querySelector(tabSelector);
		if (tabToShow) {
			new Tab(tabToShow).show();
		} else {
			console.error("Tab to show not found for selector:", tabSelector);
		}
	} else {
		console.error("Target table body not found:", tableSelector);
	}

	// Сохраняем состояние таблицы
	saveTableToLocalStorage();
}

function attachRestoreHandler(button) {
	const row = button.closest("tr");
	if (!row) {
		console.error("No row to restore.");
		return;
	}

	const isConflict = row.hasAttribute("data-id-rapport");
	const uniqueId = isConflict ? row.dataset.idRapport : row.dataset.id;
	if (!uniqueId) {
		console.error("No reservation ID found.");
		return;
	}

	// Извлечение данных из localStorage
	const reservationData = getSavedData(uniqueId, isConflict);
	if (!reservationData) {
		console.error(
			"Failed to retrieve reservation details from localStorage."
		);
		return;
	}

	console.log("Retrieved data for restore:", reservationData);

	// Отмена архивации
	reservationData.archived = false;

	// Обновление данных в DOM
	updateRowData(row, reservationData);

	// Определение правильной таблицы для восстановления
	const tableSelector = isConflict
		? "#conflictsTable tbody"
		: "#reservationsTable tbody";
	const targetTableBody = document.querySelector(tableSelector);

	if (targetTableBody) {
		targetTableBody.appendChild(row);
		updateActionButtonsForRow(row, false);
		reinitializeDropdowns();
		activateTab(tableSelector);
	} else {
		console.error("Failed to find the table body: ", tableSelector);
	}
}

function updateRowData(row, data) {
	if (data.loanUser) {
		// Для обычной резервации
		row.dataset.user = data.loanUser;
		row.dataset.equipment = data.loanEquipment;
		row.dataset.startdate = data.loanStartDate;
		row.dataset.enddate = data.loanEndDate;
		row.dataset.status = data.loanStatus;
	} else {
		// Для конфликтов
		row.dataset.typeDeRapport = data.reportType;
		row.dataset.status = data.reportStatus;
		row.dataset.dateDeclaration = data.reportDateDeclaration;
		row.dataset.dateRamassage = data.reportPickupDate;
		row.dataset.conflictDescription = data.reportDescription;
		row.dataset.idUtilisateur = data.reportIdUser;
		row.dataset.idPret = data.reportIdLoan;
	}

	// Обновление текста в ячейках на основе новых данных
	updateTextCells(row, data);
}

function updateTextCells(row, data) {
	// Обновление текстового содержимого в зависимости от данных
	if (data.loanUser) {
		row.cells[1].textContent = data.loanUser;
		row.cells[2].textContent = data.loanEquipment;
		row.cells[3].textContent = data.loanStartDate;
		row.cells[4].textContent = data.loanEndDate;
		row.cells[5].textContent = data.loanStatus;
	} else {
		row.cells[1].textContent = data.reportType || "N/A";
		row.cells[2].textContent = data.reportStatus || "N/A";
		row.cells[3].textContent = data.reportDateDeclaration || "N/A";
		row.cells[4].textContent = data.reportPickupDate || "N/A";
		row.cells[5].textContent = data.reportDescription || "N/A";
		row.cells[6].textContent = data.reportIdUser || "N/A";
		row.cells[7].textContent = data.reportIdLoan || "N/A";
	}
}

function saveTableToLocalStorage() {
	const reservationsTable = document.querySelector(
		"#reservationsTable tbody"
	);
	const completedReservationsTable = document.querySelector(
		"#completedReservationsTable tbody"
	);

	const conflictsTable = document.querySelector("#conflictsTable tbody");
	const resolvedConflictsTable = document.querySelector(
		"#resolvedConflicts tbody"
	);

	saveAllDataToLocalStorage({
		reservationsHTML: reservationsTable.innerHTML,
		completedReservationsHTML: completedReservationsTable.innerHTML,
		conflictsHTML: conflictsTable.innerHTML,
		resolvedConflictsHTML: resolvedConflictsTable.innerHTML,
	});
}

function handleArchiveAction(button, activePaneId) {
	switch (activePaneId) {
		case "activeReservations":
			attachArchiveHandler(
				button,
				"#completedReservations tbody", // Селектор для таблицы завершенных резерваций
				"#completed-reservations-tab" // Селектор вкладки для завершенных резерваций
			);
			break;
		case "activeConflicts":
			attachArchiveHandler(
				button,
				"#resolvedConflicts tbody", // Селектор для таблицы решенных конфликтов
				"#resolved-conflicts-tab" // Селектор вкладки для решенных конфликтов
			);
			break;
		case "completedReservations":
			console.log("Already completed reservation");
			break;
		case "resolvedConflicts":
			console.log(
				"Action for resolved conflicts might need different logic"
			);
			break;
		default:
			console.error("Unexpected active pane ID:", activePaneId);
	}
}

function handleRestoreClick(linkElement) {
	// Находим строку из элемента, вызвавшего событие
	const button = linkElement.closest("tr");

	if (!button) {
		console.error("No button found to restore from.");
		return;
	}

	// Вызов функции восстановления с кнопкой вместо строки
	attachRestoreHandler(button);
}

function activateTab(tableSelector) {
	let tabSelector;
	if (tableSelector === "#conflictsTable tbody") {
		tabSelector = "#active-conflicts-tab";
	} else if (tableSelector === "#reservationsTable tbody") {
		tabSelector = "#active-reservations-tab";
	}

	if (tabSelector) {
		const tabElement = document.querySelector(tabSelector);
		if (tabElement) {
			console.log(
				"Tab before activation:",
				tabElement.classList.contains("active")
			);
			new Tab(tabElement).show();
			console.log(
				"Tab after activation:",
				tabElement.classList.contains("active")
			);
		} else {
			console.error(`Tab element ${tabSelector} not found.`);
		}
	} else {
		console.error("No tab selector defined.");
	}
}

export { handleArchiveAction, handleRestoreClick };
