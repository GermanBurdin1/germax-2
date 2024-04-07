export function saveReservationToLocalStorage(reservationId, data) {
    localStorage.setItem(`reservation_${reservationId}`, JSON.stringify(data));
}

export function getReservationFromLocalStorage(reservationId) {
    return JSON.parse(localStorage.getItem(`reservation_${reservationId}`)) || {};
}
