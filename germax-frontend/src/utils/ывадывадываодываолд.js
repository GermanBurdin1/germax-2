export function saveReservationToLocalStorage(reservationId, data) {
	localStorage.setItem(`reservation_${reservationId}`, JSON.stringify(data));
}

export function getReservationFromLocalStorage(reservationId) {
	return (
		JSON.parse(localStorage.getItem(`reservation_${reservationId}`)) || {}
	);
}

function saveRowHtmlToLocalStorage(rowId, htmlContent) {
	localStorage.setItem(`row_${rowId}_html`, htmlContent);
}

function getRowHtmlFromLocalStorage(rowId) {
	return localStorage.getItem(`row_${rowId}_html`);
}

function collectDataFromTable(selector, dataAttributes) {
    const rows = document.querySelectorAll(selector);
    const items = [];
    rows.forEach((row) => {
        let item = {};
        dataAttributes.forEach((attr) => {
            if (attr.type === "text") {
                const cell = row.querySelector(attr.selector);
                item[attr.name] = cell ? cell.textContent.trim() : "";
            } else if (attr.type === "data") {
                item[attr.name] = row.dataset[attr.dataName]; // Исправление здесь: использовать dataset
            }
        });
        items.push(item);
    });
    return items;
}


function getAllReservationsAndConflicts() {

	const reservationDataAttributes = [
		{ name: "id", type: "data", dataName: "id" },
		{ name: "user", selector: "td:nth-child(2)", type: "text" },
		{ name: "equipment", selector: "td:nth-child(3)", type: "text" },
		{ name: "startDate", selector: "td:nth-child(4)", type: "text" },
		{ name: "endDate", selector: "td:nth-child(5)", type: "text" },
		{ name: "status", selector: "td:nth-child(6)", type: "text" },
	];

	// Определите атрибуты для сбора данных из таблицы конфликтов
	const conflictDataAttributes = [
		{ name: "idRapport", type: "data", dataName: "idRapport" },
		{ name: "typeDeRapport", selector: "td:nth-child(2)", type: "text" },
		{ name: "status", selector: "td:nth-child(3)", type: "text" },
		{ name: "dateDeclaration", selector: "td:nth-child(4)", type: "text" },
		{ name: "dateRamassage", selector: "td:nth-child(5)", type: "text" },
		// И другие атрибуты, если они есть в таблице конфликтов
	];

	// Собираем данные из таблицы резерваций
	const reservations = collectDataFromTable(
		"#activeReservations tbody tr, #completedReservations tbody tr",
		reservationDataAttributes
	).map((item, index) => {
		return {
			...item,
			id: item.id || generateUniqueId("reservation", index), // Если id нет, генерируем его
		};
	});

	// Собираем данные из таблицы конфликтов
	const conflicts = collectDataFromTable(
		"#activeConflicts tbody tr, #resolvedConflicts tbody tr",
		conflictDataAttributes
	).map((item, index) => {
		return {
			...item,
			idRapport: item.idRapport || generateUniqueId("conflict", index), // Если idRapport нет, генерируем его
		};
	});

	return { reservations, conflicts };
}

function saveAllDataToLocalStorage(data) {
	console.log("Сохраняем данные: ", data);
	if (!data.reservations.length || !data.conflicts.length) {
		console.error("Данные не были собраны: ", data);
	}
	localStorage.setItem("allReservationsAndConflicts", JSON.stringify(data));
}

// Функция создания HTML строк для таблицы резерваций
function createReservationRow(item, index) {
	if (!item || typeof item !== "object" || !item.id) {
		console.error("Invalid item:", item);
		return "";
	}

	return `
			<tr data-id="${index}" data-user="${item.user}" data-equipment="${
		item.equipment
	}" data-startdate="${item.startDate}" data-enddate="${
		item.endDate
	}" data-status="${item.status}">
				<td>${index + 1}</td>
				<td>${item.user}</td>
				<td>${item.equipment}</td>
				<td>
                    <span class="view-mode" data-name="startdate">${
						item.startDate
					}</span>
                    <input type="date" class="edit-mode d-none" name="startdate" value="${
						item.startDate
					}">
                    <span class="error-message d-none"></span>
                </td>
                <td>
                    <span class="view-mode" data-name="enddate">${
						item.endDate
					}</span>
                    <input type="date" class="edit-mode d-none" name="enddate" value="${
						item.endDate
					}">
                    <span class="error-message d-none"></span>
                </td>
                <td>
                    <span class="view-mode">${item.status}</span>
                    <select class="edit-mode d-none">
                        <option value="Actif">Actif</option>
                        <option value="En attente">En attente</option>
                        <option value="Annulé">Annulé</option>
                    </select>
                </td>
                <td>
                    <div class="dropdown">
                        <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton${
							item.id
						}" data-bs-toggle="dropdown" aria-expanded="false">
                            Choisir une action
                        </button>
                        <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton${
							item.id
						}">
                            <li><a class="dropdown-item edit-reservation" href="#">Éditer</a></li>
                            <li><a class="dropdown-item delete-action" href="#">Supprimer</a></li>
                            <li><a class="dropdown-item view-details" href="#" data-bs-toggle="modal" data-bs-target="#detailsModal">Voir les détails</a></li>
                            <li><a class="dropdown-item archive-action" href="#">Archiver</a></li>
                            <li class="dropdown-item d-none restore-action" data-equipment-id="${
								item.id
							}"><a href="#">Rétablir</a></li>
                        </ul>
                    </div>
                </td>
            </tr>
        `;
}

function createConflictRow(item) {
	if (!item || typeof item !== "object" || !item.idRapport) {
		console.error("Invalid item:", item);
		return "";
	}
	// Убедитесь, что item.description и другие поля существуют
	return `
			<tr>
				<td>${item.idRapport}</td>
				<td>${item.typeDeRapport}</td>
				<td>${item.status}</td>
				<td>${item.dateDeclaration}</td>
				<td>${item.dateRamassage}</td>
				<td>${item.description || ""}</td>
				<td>${item.idUtilisateur}</td>
				<td>${item.idPret}</td>
				<td>
					<div class="dropdown">
						<button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton${
							item.idRapport
						}" data-bs-toggle="dropdown" aria-expanded="false">
							Choisir une action
						</button>
						<ul class="dropdown-menu" aria-labelledby="dropdownMenuButton${item.idRapport}">
							<li><a class="dropdown-item edit-action" href="#">Éditer</a></li>
							<li><a class="dropdown-item delete-action" href="#">Supprimer</a></li>
							<li><a class="dropdown-item resolve-action" href="#" data-bs-toggle="modal" data-bs-target="#resolveConflictModal">Résoudre le conflit</a></li>
						</ul>
					</div>
				</td>
			</tr>
		`;
}

function restoreDataFromLocalStorage() {
	const rawData = localStorage.getItem("allReservationsAndConflicts");
	if (!rawData) {
		console.error("No data in localStorage");
		return;
	}

	const savedData = JSON.parse(rawData);
	console.log("Восстановленные данные:", savedData);

	if (!savedData.reservations || !savedData.conflicts) {
		console.error("Ошибка в данных: ", savedData);
		return;
	}

	// Validating that the saved data has the required properties and they are arrays
	const reservations = Array.isArray(savedData.reservations)
		? savedData.reservations
		: [];
	const completedReservations = Array.isArray(savedData.completedReservations)
		? savedData.completedReservations
		: [];
	const activeConflicts = Array.isArray(savedData.activeConflicts)
		? savedData.activeConflicts
		: [];
	const resolvedConflicts = Array.isArray(savedData.resolvedConflicts)
		? savedData.resolvedConflicts
		: [];

	// Generate HTML for each table using the corresponding data
	document.querySelector("#activeReservations tbody").innerHTML = reservations
		.map(createReservationRow)
		.join("");
	document.querySelector("#completedReservations tbody").innerHTML =
		completedReservations.map(createReservationRow).join("");
	document.querySelector("#activeConflicts tbody").innerHTML = activeConflicts
		.map(createConflictRow)
		.join("");
	document.querySelector("#resolvedConflicts tbody").innerHTML =
		resolvedConflicts.map(createConflictRow).join("");
}

export {
	getAllReservationsAndConflicts,
	saveAllDataToLocalStorage,
	saveRowHtmlToLocalStorage,
	getRowHtmlFromLocalStorage,
	restoreDataFromLocalStorage,
};

//actions-handlers

import {
	reinitializeDropdowns,
	updateActionButtonsForRow,
} from "./dom-utils.js";
import { saveReservationToLocalStorage,getReservationFromLocalStorage } from "./storage-utils.js";
import {saveRowHtmlToLocalStorage, getRowHtmlFromLocalStorage} from "./storage-utils.js";
import Tab from "bootstrap/js/dist/tab";

// Аттачим обработчики архивирования
function attachArchiveHandler(button, tableSelector, tabSelector) {
	const row = button.closest("tr");
	const reservationId = row.getAttribute("data-id-rapport");

	const rowHtml = row.outerHTML;
    saveRowHtmlToLocalStorage(reservationId, rowHtml);


	// Загружаем данные резервации
	const reservationData = getReservationFromLocalStorage(
		`reservation_${reservationId}`
	);
	reservationData.archived = true;
	saveReservationToLocalStorage(
		`reservation_${reservationId}`,
		reservationData
	);

	const targetTableBody = document.querySelector(tableSelector);
	if (targetTableBody) {
		if (row.parentNode) {
			row.parentNode.removeChild(row); // Удаляем строку из текущего расположения
		}
		targetTableBody.appendChild(row); // Добавляем строку в новое место

		updateActionButtonsForRow(row, true);
		reinitializeDropdowns();

		// Показываем нужную вкладку
		const tabToShow = document.querySelector(tabSelector);
		if (tabToShow) {
			new Tab(tabToShow).show();
		} else {
			console.error("Tab to show not found for selector:", tabSelector);
		}
	} else {
		console.error(
			"Target table body not found for selector:",
			tableSelector
		);
	}
}

function attachRestoreHandler(button, tableSelector) {
	const row = button.closest("tr");
	const reservationId = row.dataset.id;

	const savedHtml = getRowHtmlFromLocalStorage(reservationId);
    if (savedHtml) {
        const newRow = document.createElement('tr');
        newRow.innerHTML = savedHtml;
        document.querySelector(tableSelector).appendChild(newRow);
        updateActionButtonsForRow(newRow, false);
        reinitializeDropdowns();
    } else {
        // Handle the case where HTML was not saved or has been lost
        console.error("Saved HTML not found for reservation:", reservationId);
    }
	// Получаем данные о бронировании из localStorage
	const reservationData = getReservationFromLocalStorage(
		`reservation_${reservationId}`
	);
	reservationData.archived = false; // Снимаем статус архивации

	saveReservationToLocalStorage(
		`reservation_${reservationId}`,
		reservationData
	);

	const activeReservationsBody = document.querySelector(tableSelector);
	activeReservationsBody.appendChild(row);
	updateActionButtonsForRow(row, false);

	reinitializeDropdowns();
}

export { attachArchiveHandler, attachRestoreHandler };
