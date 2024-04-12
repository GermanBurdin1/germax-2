import {
	reinitializeDropdowns,
	updateActionButtonsForRow,
} from "./dom-utils.js";
import {
	saveReservationToLocalStorage,
	getReservationFromLocalStorage,
} from "./storage-utils.js";
import Tab from "bootstrap/js/dist/tab";

// Аттачим обработчики архивирования
function attachArchiveHandler(
	button,
	tableSelector,
	selectorCompletedReservationsTab
) {
	button.addEventListener("click", function (event) {
		event.preventDefault();
		const row = button.closest("tr");
		const reservationId = row.getAttribute("data-id-rapport"); // или другой атрибут, идентифицирующий резервацию
		const reservationData =
			saveReservationToLocalStorage(`reservation_${reservationId}`) || {};

		// Обновляем статус архивации и сохраняем изменения
		reservationData.archived = true;
		saveReservationToLocalStorage(
			`reservation_${reservationId}`,
			reservationData
		);

		// Перемещаем строку в таблицу архивированных резерваций
		document.querySelector(tableSelector).appendChild(row);
		updateActionButtonsForRow(row, true);
		reinitializeDropdowns();

		// Переключаемся на вкладку архивированных резерваций, если необходимо
		new Tab(
			document.querySelector(selectorCompletedReservationsTab)
		).show();
	});
}

function attachRestoreHandler(button, tableSelector) {
	button.addEventListener("click", function () {
		const row = button.closest("tr");
		const reservationId = row.dataset.id;
		// Получаем данные о бронировании из localStorage
		const reservationData =
			JSON.parse(localStorage.getItem(`reservation_${reservationId}`)) ||
			{};

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
	});
}

export { attachArchiveHandler, attachRestoreHandler };
