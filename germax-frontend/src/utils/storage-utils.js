function saveDataToLocalStorage(key, data) {
    console.log('Saving data for', key, data);
    localStorage.setItem(key, JSON.stringify(data));
}

function getSavedData(uniqueId, isConflict) {
	const storageKey = isConflict
		? `conflict_${uniqueId}`
		: `reservation_${uniqueId}`;
	const savedData = localStorage.getItem(storageKey);
	return savedData ? JSON.parse(savedData) : null;
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

export {getSavedData, saveDataToLocalStorage, getAllReservationsAndConflicts, saveAllDataToLocalStorage}
