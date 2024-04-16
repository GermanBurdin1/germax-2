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

	// Получение данных о резервации из localStorage
	const reservationData = getReservationFromLocalStorage(
		`reservation_${reservationId}`
	);
	reservationData.archived = true;
	// Сохранение изменённых данных о резервации обратно в localStorage
	saveReservationToLocalStorage(
		`reservation_${reservationId}`,
		reservationData
	);

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
		console.log("tabToShow:", tabToShow); // Логирование для отладки
		if (tabToShow) {
			new Tab(tabToShow).show(); // Bootstrap 5 активация вкладки
			console.log("Tab is now shown:", tabToShow);
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

	// Определяем, является ли элемент частью таблицы конфликтов
	let reservationId;
	if (tableSelector.includes("conflictsTable")) {
		// Извлекаем ID из соответствующего атрибута для конфликтов
		reservationId = row.dataset.idRapport;
	} else {
		// Извлекаем ID из data атрибута для резерваций
		reservationId = row.dataset.id;
	}

	if (!reservationId) {
		console.error("No reservation ID found.");
		return;
	}

	const reservationData = getReservationFromLocalStorage(
		`reservation_${reservationId}`
	);
	reservationData.archived = false;
	saveReservationToLocalStorage(
		`reservation_${reservationId}`,
		reservationData
	);

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
	console.log(linkElement);
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
	attachArchiveHandler,
	attachRestoreHandler,
	handleArchiveAction,
	handleRestoreClick,
};
