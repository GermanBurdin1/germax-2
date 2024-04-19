import {
	reinitializeDropdowns,
	updateActionButtonsForRow,
} from "./dom-utils.js";
import {
	getSavedData,
	saveDataToLocalStorage,
	saveAllDataToLocalStorage,
} from "./storage-utils.js";
import Tab from "bootstrap/js/dist/tab";

function attachArchiveHandler(button, tableSelector, tabSelector) {
	const row = button.closest("tr");
	console.log(row);
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

	console.log("данные до формирования объекта:", row.dataset);
	// Формируем объект для сохранения, в зависимости от того, резервация это или конфликт
	const dataToSave = isConflict
		? {
				// Данные конфликта
				typeDeRapport: row.dataset.typeDeRapport,
				status: row.dataset.status,
				dateDeclaration: row.dataset.dateDeclaration,
				dateRamassage: row.dataset.dateRamassage,
				conflictDescription: row.dataset.conflictDescription,
				idUtilisateur: row.dataset.idUtilisateur,
				idPret: row.dataset.idPret,
		  }
		: {
				// Данные резервации
				user: row.dataset.user,
				equipment: row.dataset.equipment,
				startdate: row.dataset.startdate,
				enddate: row.dataset.enddate,
				status: row.dataset.status,
		  };

	console.log("объект перед отправлением:", dataToSave);
	console.log("Данные перед отправлением:", row.dataset);
	// Добавляем флаг архивации
	dataToSave.archived = true;

	// Сохраняем данные в localStorage
	saveDataToLocalStorage(storageKey, dataToSave);

	// Перемещаем строку в соответствующую таблицу
	const targetTableBody = document.querySelector(tableSelector);
	if (targetTableBody) {
		targetTableBody.appendChild(row);
		console.log("объект после перемещения:", dataToSave);
		console.log("Данные после перемещения строки:", row.dataset);
		updateActionButtonsForRow(row, true);
		reinitializeDropdowns();
		console.log("Данные после обновления UI:", row.dataset);

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
	console.log("проверка строки перед восстановлением",row);
    const isConflict = row.hasAttribute("data-id-rapport");
	console.log(isConflict);
    const uniqueId = isConflict ? row.dataset.idRapport : row.dataset.id;
	console.log(uniqueId);
    if (!uniqueId) {
        console.error("No reservation ID found.");
        return;
    }

    // Извлечение данных из localStorage
    const reservationData = getSavedData(uniqueId, isConflict);
    if (!reservationData) {
        console.error("Failed to retrieve reservation details from localStorage.");
        return;
    }
    console.log("Data retrieved from localStorage:", reservationData);

    // Обновление данных в DOM и снятие флага архивации
    const updatedData = {
        ...reservationData,
        archived: false,
    };
    updateRowData(row, updatedData);
    console.log("Data after updating the DOM:", row.dataset);

    // Сохраняем обновленные данные обратно в localStorage
    saveDataToLocalStorage(
        isConflict ? `conflict_${uniqueId}` : `reservation_${uniqueId}`,
        updatedData
    );

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
        console.log("Data after reinserting the row and UI updates:", row.dataset);
        console.log("Data after reinserting the row and UI updates:", updatedData);
    } else {
        console.error("Failed to find the table body: ", tableSelector);
    }
}


function updateRowData(row, data) {
	delete row.dataset.user;
	delete row.dataset.equipment;
	delete row.dataset.startdate;
	delete row.dataset.enddate;
	delete row.dataset.status;
	delete row.dataset.typeDeRapport;
	delete row.dataset.dateDeclaration;
	delete row.dataset.dateRamassage;
	delete row.dataset.conflictDescription;
	delete row.dataset.idUtilisateur;
	delete row.dataset.idPret;

	if (data.user) {
		// Для обычной резервации
		row.dataset.user = data.user;
		row.dataset.equipment = data.equipment;
		row.dataset.startdate = data.startdate;
		row.dataset.enddate = data.enddate;
		row.dataset.status = data.status;
	} else {
		// Для конфликтов
		row.dataset.typeDeRapport = data.typeDeRapport;
		row.dataset.status = data.status;
		row.dataset.dateDeclaration = data.dateDeclaration;
		row.dataset.dateRamassage = data.dateRamassage;
		row.dataset.conflictDescription = data.conflictDescription;
		row.dataset.idUtilisateur = data.idUtilisateur;
		row.dataset.idPret = data.idPret;
	}

	// Обновление текста в ячейках на основе новых данных
	updateTextCells(row, data);
}

function updateTextCells(row, data) {
	// Обновление текстового содержимого в зависимости от данных
	if (data.user) {
		row.cells[1].textContent = data.user;
		row.cells[2].textContent = data.equipment;
		row.cells[3].textContent = data.startdate;
		row.cells[4].textContent = data.enddate;
		row.cells[5].textContent = data.status;
	} else {
		row.cells[1].textContent = data.typeDeRapport || "N/A";
		row.cells[2].textContent = data.status || "N/A";
		row.cells[3].textContent = data.dateDeclaration || "N/A";
		row.cells[4].textContent = data.dateRamassage || "N/A";
		row.cells[5].textContent = data.conflictDescription || "N/A";
		row.cells[6].textContent = data.idUtilisateur || "N/A";
		row.cells[7].textContent = data.idPret || "N/A";
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
			new Tab(tabElement).show();
		} else {
			console.error(`Tab element ${tabSelector} not found.`);
		}
	} else {
		console.error("No tab selector defined.");
	}
}

export { handleArchiveAction, handleRestoreClick };
