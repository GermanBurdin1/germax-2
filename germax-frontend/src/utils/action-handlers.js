import {
	reinitializeDropdowns,
	updateActionButtonsForRow,
} from "./dom-utils.js";
import { saveReservationToLocalStorage,getReservationFromLocalStorage } from "./storage-utils.js";
import Tab from "bootstrap/js/dist/tab";

// Аттачим обработчики архивирования
function attachArchiveHandler(button, tableSelector, tabSelector) {
	const row = button.closest("tr");
	const reservationId = row.getAttribute("data-id-rapport");

	// Загружаем данные резервации
	const reservationData = getReservationFromLocalStorage(
		`reservation_${reservationId}`
	);
	reservationData.archived = true;
	saveReservationToLocalStorage(
		`reservation_${reservationId}`,
		reservationData
	);

	const targetTableBody = document.querySelector(tableSelector);
	if (targetTableBody) {
		if (row.parentNode) {
			row.parentNode.removeChild(row); // Удаляем строку из текущего расположения
		}
		targetTableBody.appendChild(row); // Добавляем строку в новое место

		updateActionButtonsForRow(row, true);
		reinitializeDropdowns();

		// Показываем нужную вкладку
		const tabToShow = document.querySelector(tabSelector);
		if (tabToShow) {
			new Tab(tabToShow).show();
		} else {
			console.error("Tab to show not found for selector:", tabSelector);
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
}

export { attachArchiveHandler, attachRestoreHandler };
