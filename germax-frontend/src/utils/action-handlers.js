import {
	reinitializeDropdowns,
	updateActionButtonsForRow,
} from "./dom-utils.js";
import {
	saveReservationToLocalStorage,
	getReservationFromLocalStorage,
	saveAllDataToLocalStorage,
	getAllReservationsAndConflicts,
} from "./storage-utils.js";
import Tab from "bootstrap/js/dist/tab";

function attachArchiveHandler(button, tableSelector, tabSelector) {
	const row = button.closest("tr");
	let reservationId = row.dataset.id || row.dataset.idRapport;
	if (!reservationId) {
		console.error("No reservation ID found.");
		return;
	}

	const trReservation = {
		reservationId,
		loanUser: row.dataset.user,
		loanEquipment: row.dataset.equipment,
		loanStartDate: row.dataset.startdate,
		loanEndDate: row.dataset.enddate,
		loanStatus: row.dataset.status,
	};

	// Сохранение объекта trReservation в localStorage
    localStorage.setItem(`reservationDetails_${reservationId}`, JSON.stringify(trReservation));

	// Получение данных о резервации из localStorage
	const reservationData = getReservationFromLocalStorage(trReservation);
	reservationData.archived = true;
	reservationData.loanUser = trReservation.loanUser;
	reservationData.loanEquipment = trReservation.loanEquipment;
	reservationData.loanStartDate = trReservation.loanStartDate;
	reservationData.loanEndDate = trReservation.loanEndDate;
	reservationData.loanStatus = trReservation.loanStatus;
	saveReservationToLocalStorage(reservationId, reservationData);

	// Нахождение тела таблицы, куда должна быть перемещена строка
	const targetTableBody = document.querySelector(tableSelector);
	if (targetTableBody) {
		// Перемещение строки в новую таблицу
		targetTableBody.appendChild(row);

		// Обновление кнопок управления для перемещённой строки
		updateActionButtonsForRow(row, true);
		// Переинициализация выпадающих меню (если это необходимо)
		reinitializeDropdowns();

		// Активация соответствующей вкладки
		const tabToShow = document.querySelector(tabSelector);
		if (tabToShow) {
			new Tab(tabToShow).show(); // Bootstrap 5 активация вкладки
		} else {
			console.error("Tab to show not found for selector:", tabSelector);
		}
	} else {
		console.error("Target table body not found:", tableSelector);
	}

	// Сохранение состояния таблицы в localStorage
	saveTableToLocalStorage();
}

function attachRestoreHandler(row, tableSelector) {
	if (!row) {
        console.error("No row to restore.");
        return;
    }

    let reservationId = row.dataset.id || row.dataset.idRapport;
    if (!reservationId) {
        console.error("No reservation ID found.");
        return;
    }

    // Извлечение объекта trReservation из localStorage
    const trReservationJSON = localStorage.getItem(`reservationDetails_${reservationId}`);
    const trReservation = trReservationJSON ? JSON.parse(trReservationJSON) : null;
    if (!trReservation) {
        console.error("Failed to retrieve reservation details from localStorage.");
        return;
    }

    const reservationData = getReservationFromLocalStorage(trReservation);
    if (!reservationData) {
        console.error("Failed to retrieve reservation data from localStorage.");
        return;
    }

	console.log("ПРОВЕРОЧКА:",reservationData);

	// Отмена архивации резервации
	reservationData.archived = false;
	row.dataset.user = reservationData.loanUser;
	row.dataset.equipment = reservationData.loanEquipment;
	row.dataset.startdate = reservationData.loanStartDate;
	row.dataset.enddate = reservationData.loanEndDate;
	row.dataset.status = reservationData.loanStatus;
	console.log(row.dataset.user);

	// Обновление текстовых полей строки
    row.querySelector("td:nth-child(2)").textContent = row.dataset.user;
    row.querySelector("td:nth-child(3)").textContent = row.dataset.equipment;
    row.querySelector(`span[data-name="startdate"]`).textContent = row.dataset.startdate;
    row.querySelector(`span[data-name="enddate"]`).textContent = row.dataset.enddate;
    row.querySelector("td:nth-child(6) span").textContent = row.dataset.status;

	// Сохранение обновленной информации о резервации в localStorage
	saveReservationToLocalStorage(reservationId, reservationData);

	const activeReservationsBody = document.querySelector(tableSelector);
	if (activeReservationsBody) {
		activeReservationsBody.appendChild(row);
		updateActionButtonsForRow(row, false);
		reinitializeDropdowns();
	} else {
		console.error("Failed to find the table body: ", tableSelector);
	}
	saveTableToLocalStorage();
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
	const row = linkElement.closest("tr");
	const tabContent = linkElement.closest(".tab-content");
	const activePane = tabContent.querySelector(".tab-pane.active");

	if (activePane) {
		const tableSelector =
			activePane.id === "completedReservations"
				? "#reservationsTable tbody"
				: activePane.id === "resolvedConflicts"
				? "#conflictsTable tbody"
				: null;

		if (tableSelector) {
			attachRestoreHandler(row, tableSelector);
			const allData = getAllReservationsAndConflicts();
			saveAllDataToLocalStorage(allData);
		} else {
			console.error("Unsupported pane ID or action: ", activePane.id);
		}
	}
}

export {
	handleArchiveAction,
	handleRestoreClick,
};
