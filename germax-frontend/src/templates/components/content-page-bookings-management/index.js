import { Dropdown } from "bootstrap";
import { Modal } from "bootstrap";
import "./index.css";

// получить данные которые были отправлены на странице
function refreshRentals() {
	fetch("http://germax-api/rental", {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
		},
	})
		.then((response) => response.json())
		.then((data) => {
			if (data.success) {
				console.log(data.data);
				updateBookingsTable(data.data);
			} else {
				console.error("Failed to fetch data");
			}
		})
		.catch((error) => console.error("Error:", error));
}

function updateBookingsTable(rentals) {
	const tbody = document
		.getElementById("booking-table")
		.getElementsByTagName("tbody")[0];
	tbody.innerHTML = ""; // Очистить текущие строки таблицы
	rentals.forEach((rental) => {
		const row = tbody.insertRow();
		row.innerHTML =
			`<td>${rental.id_good}</td>
			<td>${rental.user_name} ${rental.user_surname}</td>
			<td>${rental.model_name}</td>
			<td>1</td>
			<td>${rental.date_start}-${rental.date_end}</td>
			<td>${rental.comment}</td>
			<td>${getStatusName(
				rental.id_status
			)}</td>
			<td>
                <div class="dropdown">
                    <button class="btn btn-secondary dropdown-toggle" type="button" id="actionMenu${rental.id_good}"
                        data-bs-toggle="dropdown" aria-expanded="false">
                        Choisir une action
                    </button>
                    <ul class="dropdown-menu" aria-labelledby="actionMenu${rental.id_good}">
                        <li><a class="dropdown-item" href="#">Voir l'équipement</a></li>
                        <li><a class="dropdown-item" href="#">Voir le locataire</a></li>
                        <li><a class="dropdown-item" href="#">Gérer la location</a></li>
                    </ul>
                </div>
            </td>`;
	});
}

function getStatusName(statusId) {
	switch (statusId) {
			case 4:
					return "Pending";
			default:
					return "Unknown";
	}
}

document.addEventListener("DOMContentLoaded", function () {
	refreshRentals();
});
