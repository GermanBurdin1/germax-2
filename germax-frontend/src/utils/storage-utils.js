function saveReservationToLocalStorage(reservationId, data) {
	console.log('Saving data for', reservationId, data);
    localStorage.setItem(reservationId, JSON.stringify(data));
}

function getReservationFromLocalStorage(trReservation) {
	console.log(trReservation);
    try {
        const item = localStorage.getItem(trReservation.reservationId);
        const parsedItem = JSON.parse(item) || {};  // Возвращаем пустой объект, если item === null
        console.log("Retrieved reservation data:", parsedItem);  // Выводим полученные данные в консоль
        return parsedItem;
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

export {getReservationFromLocalStorage, getAllReservationsAndConflicts, saveAllDataToLocalStorage, saveReservationToLocalStorage}
