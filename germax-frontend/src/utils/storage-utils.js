export function saveReservationToLocalStorage(reservationId, data) {
    localStorage.setItem(`reservation_${reservationId}`, JSON.stringify(data));
}

export function getReservationFromLocalStorage(reservationId) {
    return JSON.parse(localStorage.getItem(`reservation_${reservationId}`)) || {};
}

function collectDataFromTable(selector) {
    const rows = document.querySelectorAll(selector);
    const items = [];
    rows.forEach(row => {
        const id = row.dataset.idRapport; // Убедитесь, что у всех таблиц одинаковые атрибуты для ID
        const user = row.querySelector('td:nth-child(2)').textContent.trim();
        const equipment = row.querySelector('td:nth-child(3)').textContent.trim();
        const startDate = row.querySelector('td:nth-child(4)').textContent.trim();
        const endDate = row.querySelector('td:nth-child(5)').textContent.trim();
        const status = row.querySelector('td:nth-child(6)').textContent.trim();
        items.push({ id, user, equipment, startDate, endDate, status });
    });
    return items;
}

function getAllReservationsAndConflicts() {
    const data = {
        reservations: collectDataFromTable("#activeReservations tbody, #completedReservations tbody"),
        conflicts: collectDataFromTable("#activeConflicts tbody, #resolvedConflicts tbody")
    };
    return data;
}

function saveAllDataToLocalStorage(data) {
    localStorage.setItem('allReservationsAndConflicts', JSON.stringify(data));
}

export {getAllReservationsAndConflicts, saveAllDataToLocalStorage}
