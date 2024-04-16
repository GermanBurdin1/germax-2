export function saveReservationToLocalStorage(reservationId, data) {
    localStorage.setItem(`reservation_${reservationId}`, JSON.stringify(data));
}

function getReservationFromLocalStorage(reservationId) {
    try {
        const item = localStorage.getItem(`reservation_${reservationId}`);
        return JSON.parse(item) || {};  // Возвращаем пустой объект, если item === null
    } catch (error) {
        console.error("Failed to parse reservation data from localStorage", error);
        return {};  // Возвращаем пустой объект в случае ошибки разбора JSON
    }
}

function getAllReservationsAndConflicts() {
    const data = JSON.parse(localStorage.getItem('allReservationsAndConflicts'));
    if (data) {
        document.querySelector('#reservationsTable tbody').innerHTML = data.reservationsHTML;
        document.querySelector('#conflictsTable tbody').innerHTML = data.conflictsHTML;
    }
	return data;
}

function saveAllDataToLocalStorage(data) {
    localStorage.setItem('allReservationsAndConflicts', JSON.stringify(data));
}

export {getReservationFromLocalStorage, getAllReservationsAndConflicts, saveAllDataToLocalStorage}
