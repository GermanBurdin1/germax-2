import {
	reinitializeDropdowns,
	updateActionButtonsForRow,
} from "./dom-utils.js";
import { saveReservationToLocalStorage } from "./storage-utils.js";
import Tab from "bootstrap/js/dist/tab";

// Аттачим обработчики архивирования
function attachArchiveHandler(
	button,
	tableSelector, // Селектор таблицы, куда нужно переместить строку
	tabSelector // Селектор вкладки, которую нужно показать после перемещения
) {
	const row = button.closest("tr");
	const reservationId = row.getAttribute("data-id-rapport");

	// Загружаем или создаём данные резервации
	const reservationData =
		saveReservationToLocalStorage(`reservation_${reservationId}`) || {};
	reservationData.archived = true;
	saveReservationToLocalStorage(
		`reservation_${reservationId}`,
		reservationData
	);

	const targetTableBody = document.querySelector(tableSelector);

	if (targetTableBody) {
		if (row.parentNode) {
			row.parentNode.removeChild(row); // Удаляем строку из текущего расположения, если это необходимо
		}
		targetTableBody.appendChild(row); // Добавляем строку в новое место

		updateActionButtonsForRow(row, true); // Обновляем состояние кнопок в строке
		reinitializeDropdowns(); // Переинициализируем компоненты интерфейса

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
	const reservationData =
		JSON.parse(localStorage.getItem(`reservation_${reservationId}`)) || {};

	// Обновляем статус архивации
	reservationData.archived = false; // Указываем, что бронирование больше не архивировано

	// Сохраняем обновлённые данные обратно в localStorage
	localStorage.setItem(
		`reservation_${reservationId}`,
		JSON.stringify(reservationData)
	);

	const activeReservationsBody = document.querySelector(tableSelector);
	activeReservationsBody.appendChild(row);
	updateActionButtonsForRow(row, false); // Обновляем кнопки для активных строк

	// Не забудьте вызвать функции переинициализации компонентов, если это необходимо
	reinitializeDropdowns();
}

export { attachArchiveHandler, attachRestoreHandler };
