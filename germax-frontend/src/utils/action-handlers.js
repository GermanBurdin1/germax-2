import { reinitializeDropdowns, updateActionButtonsForRow } from './dom-utils.js';
import { saveReservationToLocalStorage, getReservationFromLocalStorage } from './storage-utils.js';

// Аттачим обработчики архивирования
export function attachArchiveHandler(button) {
    button.addEventListener("click", function(event) {
        event.preventDefault();
        const row = button.closest("tr");
        const reservationId = row.getAttribute("data-id-rapport"); // или другой атрибут, идентифицирующий резервацию
        const reservationData = saveReservationToLocalStorage(`reservation_${reservationId}`) || {};

        // Обновляем статус архивации и сохраняем изменения
        reservationData.archived = true;
        saveReservationToLocalStorage(`reservation_${reservationId}`, reservationData);

        // Перемещаем строку в таблицу архивированных резерваций
        document.querySelector("#completedReservations tbody").appendChild(row);
        updateActionButtonsForRow(row, true);
        reinitializeDropdowns();

        // Переключаемся на вкладку архивированных резерваций, если необходимо
        new bootstrap.Tab(document.querySelector("#completed-reservations-tab")).show();
    });
}

// Аттачим обработчики восстановления
export function attachRestoreHandler(button) {
    button.addEventListener("click", function(event) {
        event.preventDefault();
        const row = button.closest("tr");
        const reservationId = row.getAttribute("data-id-rapport"); // или другой атрибут, идентифицирующий резервацию
        const reservationData = getReservationFromLocalStorage(`reservation_${reservationId}`) || {};

        // Обновляем статус архивации и сохраняем изменения
        reservationData.archived = false;
        saveToLocalStorage(`reservation_${reservationId}`, reservationData);

        // Перемещаем строку обратно в таблицу активных резерваций
        document.querySelector("#activeReservations tbody").appendChild(row);
        updateActionButtonsForRow(row, false);
        reinitializeDropdowns();

        // Переключаемся на вкладку активных резерваций
        new bootstrap.Tab(document.querySelector("#active-reservations-tab")).show();
    });
}

