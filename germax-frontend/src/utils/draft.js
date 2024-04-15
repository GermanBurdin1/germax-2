import {
	reinitializeDropdowns,
	updateActionButtonsForRow,
} from "./dom-utils.js";
import {
	saveReservationToLocalStorage,
	getReservationFromLocalStorage,
	saveAllDataToLocalStorage,
	getAllDataFromLocalStorage,
} from "./storage-utils.js";
import Tab from "bootstrap/js/dist/tab";

function getFromLocalStorage(key) {
	try {
		const item = localStorage.getItem(key);
		if (item === null || item === "undefined") {
			// Возвращаем пустой объект, если значение не найдено или равно строке "undefined"
			return {};
		}
		return JSON.parse(item);
	} catch (e) {
		console.error("Error reading from localStorage", e);
		return {}; // Возвращает пустой объект в случае ошибки
	}
}


function attachArchiveHandler(button, tableSelector, tabSelector) {
	const row = button.closest("tr");
	const reservationId = row.getAttribute("data-id-rapport");

	const reservationData = getReservationFromLocalStorage(
		`reservation_${reservationId}`
	);
	reservationData.archived = true;
	saveReservationToLocalStorage(
		`reservation_${reservationId}`,
		reservationData
	);

	const targetTableBody = document.querySelector(tableSelector);
	const isReservationsTable = tableSelector.includes("reservationsTable");

	if (targetTableBody) {
		if (row.parentNode) {
			row.parentNode.removeChild(row);
		}
		targetTableBody.appendChild(row);
		updateActionButtonsForRow(row, true);
		reinitializeDropdowns();

		const tabToShow = document.querySelector(tabSelector);
		if (tabToShow) {
			new Tab(tabToShow).show();
		} else {
			console.error("Tab to show not found for selector:", tabSelector);
		}

		const currentData = getFromLocalStorage("allReservationsAndConflicts");

		if (isReservationsTable) {
			saveAllDataToLocalStorage({
				reservationsHTML: document.querySelector(
					"#reservationsTable tbody"
				).innerHTML,
				conflictsHTML: currentData.conflictsHTML || "",
			});
		} else {
			saveAllDataToLocalStorage({
				reservationsHTML: currentData.reservationsHTML || "",
				conflictsHTML: document.querySelector("#conflictsTable tbody")
					.innerHTML,
			});
		}
	} else {
		console.error(
			"Target table body not found for selector:",
			tableSelector
		);
	}
}

function attachRestoreHandler(button, tableSelector) {
	const row = button.closest("tr");
	const reservationId = row.dataset.id;

	// Получаем данные о бронировании из localStorage
	const reservationData = getReservationFromLocalStorage(
		`reservation_${reservationId}`
	);
	reservationData.archived = false; // Снимаем статус архивации
	saveReservationToLocalStorage(
		`reservation_${reservationId}`,
		reservationData
	);

	const activeReservationsBody = document.querySelector(tableSelector);
	activeReservationsBody.appendChild(row);
	updateActionButtonsForRow(row, false);
	reinitializeDropdowns();

	// Проверяем, принадлежит ли обрабатываемая строка таблице резерваций
	if (tableSelector.includes("reservationsTable")) {
		// Сохраняем изменения только для таблицы резерваций
		saveAllDataToLocalStorage({
			reservationsHTML: document.querySelector("#reservationsTable tbody")
				.innerHTML,
			conflictsHTML: localStorage.getItem("allReservationsAndConflicts")
				? JSON.parse(
						localStorage.getItem("allReservationsAndConflicts")
				  ).conflictsHTML
				: "",
		});
	}
}

export { attachArchiveHandler, attachRestoreHandler };
