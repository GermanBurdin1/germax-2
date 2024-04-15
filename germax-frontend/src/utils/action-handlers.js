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


function attachArchiveHandler(button, tableSelector, tabSelector) {
    const row = button.closest("tr");
    const reservationId = row.dataset.idRapport;
    const reservationData = getReservationFromLocalStorage(`reservation_${reservationId}`);
    reservationData.archived = true;
    saveReservationToLocalStorage(`reservation_${reservationId}`, reservationData);

    const targetTableBody = document.querySelector(tableSelector);
    const clonedRow = row.cloneNode(true); // Клонируем строку

    // Удаление оригинальной строки из текущей таблицы
    row.parentNode.removeChild(row);

    // Добавляем клонированную строку в целевую таблицу
    targetTableBody.appendChild(clonedRow);
    updateActionButtonsForRow(clonedRow, true);
    reinitializeDropdowns();

    // Переключение на нужную вкладку
    const tabToShow = document.querySelector(tabSelector);
    if (tabToShow) {
        new Tab(tabToShow).show();
    } else {
        console.error("Tab to show not found for selector:", tabSelector);
    }

    // Сохраняем данные в localStorage
    saveTableToLocalStorage();
}

function saveTableToLocalStorage() {
    const reservationsTable = document.querySelector("#reservationsTable tbody");
    const completedReservationsTable = document.querySelector("#completedReservationsTable tbody");

    saveAllDataToLocalStorage({
        reservationsHTML: reservationsTable.innerHTML,
        completedReservationsHTML: completedReservationsTable.innerHTML
    });
}


function attachRestoreHandler(row, tableSelector) {
    if (!row) {
        console.error("No row to restore.");
        return;
    }

    const reservationId = row.dataset.id; // Получаем ID бронирования из строки

    // Восстанавливаем данные из localStorage
    const reservationData = getReservationFromLocalStorage(`reservation_${reservationId}`);
    reservationData.archived = false;
    saveReservationToLocalStorage(`reservation_${reservationId}`, reservationData);

    const activeReservationsBody = document.querySelector(tableSelector);
    if (activeReservationsBody) {
        activeReservationsBody.appendChild(row); // Добавляем строку обратно в таблицу
        updateActionButtonsForRow(row, false); // Обновляем кнопки на строке
        reinitializeDropdowns(); // Переинициализируем дропдауны, если нужно
    } else {
        console.error("Failed to find the table body: ", tableSelector);
    }

    // Сохраняем изменения в localStorage
    saveTableToLocalStorage();
}



export { attachArchiveHandler, attachRestoreHandler };
