export function saveReservationToLocalStorage(reservationId, data) {
    localStorage.setItem(`reservation_${reservationId}`, JSON.stringify(data));
}

export function getReservationFromLocalStorage(reservationId) {
    return JSON.parse(localStorage.getItem(`reservation_${reservationId}`)) || {};
}

function collectDataFromTable(selector, dataAttributes) {
    const rows = document.querySelectorAll(selector);
    const items = [];
    rows.forEach(row => {
        let item = {};
        for (const attr of dataAttributes) {
            if (attr.type === 'text') {
                const cell = row.querySelector(attr.selector);
                item[attr.name] = cell ? cell.textContent.trim() : '';
            } else if (attr.type === 'data') {
                item[attr.name] = row.dataset[attr.name];
            }
            // Добавьте больше условий для других типов данных, если это необходимо
        }
        items.push(item);
    });
    return items;
}

function getAllReservationsAndConflicts() {
	const reservationDataAttributes = [
        {name: 'id', type: 'data'},
        {name: 'user', selector: 'td:nth-child(2)', type: 'text'},
        {name: 'equipment', selector: 'td:nth-child(3)', type: 'text'},
        {name: 'startDate', selector: 'td:nth-child(4)', type: 'text'},
        {name: 'endDate', selector: 'td:nth-child(5)', type: 'text'},
        {name: 'status', selector: 'td:nth-child(6)', type: 'text'},
    ];

    // Определите атрибуты для сбора данных из таблицы конфликтов
    const conflictDataAttributes = [
        {name: 'idRapport', type: 'data'},
        {name: 'typeDeRapport', selector: 'td:nth-child(2)', type: 'text'},
        {name: 'status', selector: 'td:nth-child(3)', type: 'text'},
        {name: 'dateDeclaration', selector: 'td:nth-child(4)', type: 'text'},
        {name: 'dateRamassage', selector: 'td:nth-child(5)', type: 'text'},
        // И другие атрибуты, если они есть в таблице конфликтов
    ];

    // Используйте определенные атрибуты в вызовах функции collectDataFromTable
    const data = {
        reservations: collectDataFromTable("#activeReservations tbody tr, #completedReservations tbody tr", reservationDataAttributes),
        conflicts: collectDataFromTable("#activeConflicts tbody tr, #resolvedConflicts tbody tr", conflictDataAttributes)
    };
    return data;
}

function saveAllDataToLocalStorage(data) {
    localStorage.setItem('allReservationsAndConflicts', JSON.stringify(data));
}

export {getAllReservationsAndConflicts, saveAllDataToLocalStorage}
