export function saveReservationToLocalStorage(reservationId, data) {
    localStorage.setItem(`reservation_${reservationId}`, JSON.stringify(data));
}

export function getReservationFromLocalStorage(reservationId) {
    return JSON.parse(localStorage.getItem(`reservation_${reservationId}`)) || {};
}

function saveRowHtmlToLocalStorage(rowId, htmlContent) {
    localStorage.setItem(`row_${rowId}_html`, htmlContent);
}

function getRowHtmlFromLocalStorage(rowId) {
    return localStorage.getItem(`row_${rowId}_html`);
}

function saveAllDataToLocalStorage(data) {
    localStorage.setItem('allReservationsAndConflicts', JSON.stringify(data));
}

function restoreDataFromLocalStorage() {
    // Загрузите сохраненные данные
    const savedData = JSON.parse(localStorage.getItem('allReservationsAndConflicts')) || {};

    // Функция для вставки HTML в таблицу
    function insertHTMLIntoTable(tableSelector, htmlData) {
        const tableBody = document.querySelector(tableSelector);
        tableBody.innerHTML = htmlData || ''; // Если данных нет, вставляется пустая строка
    }

    // Вставьте HTML в таблицы активных и завершенных резерваций
    insertHTMLIntoTable("#activeReservations tbody", savedData.activeReservationsHTML);
    insertHTMLIntoTable("#completedReservations tbody", savedData.completedReservationsHTML);

    // Аналогично для конфликтов
    insertHTMLIntoTable("#activeConflicts tbody", savedData.activeConflictsHTML);
    insertHTMLIntoTable("#resolvedConflicts tbody", savedData.resolvedConflictsHTML);
}

export {getAllReservationsAndConflicts, saveAllDataToLocalStorage, restoreDataFromLocalStorage, saveRowHtmlToLocalStorage, getRowHtmlFromLocalStorage}
