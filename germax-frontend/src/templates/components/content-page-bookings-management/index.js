import './index.css';
import Dropdown from "bootstrap/js/dist/dropdown";
import Modal from "bootstrap/js/dist/modal";


function updateBookingsTable(data) {
	const table = document.getElementById('bookings-table-body');
	// Очистите текущие строки таблицы
	table.innerHTML = '';
	// Добавьте новые строки в таблицу на основе данных
	data.bookings.forEach(booking => {
			const row = table.insertRow();
			row.insertCell(0).innerHTML = booking.id;
			row.insertCell(1).innerHTML = booking.userName;
			row.insertCell(2).innerHTML = booking.model;
			row.insertCell(3).innerHTML = booking.comment;
			row.insertCell(4).innerHTML = booking.status;
			// Добавьте другие ячейки по необходимости
	});
}
