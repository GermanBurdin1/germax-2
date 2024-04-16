import {
	reinitializeDropdowns,
	updateActionButtonsForRow,
} from "./dom-utils.js";
import {
	saveReservationToLocalStorage,
	getReservationFromLocalStorage,
	saveAllDataToLocalStorage,
	getAllDataFromLocalStorage,
} from "./storage-utils.js";
import Tab from "bootstrap/js/dist/tab";


function attachArchiveHandler(button, tableSelector, tabSelector) {
    const row = button.closest("tr");
    const reservationId = row.dataset.id;
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
        targetTableBody.appendChild(row);
        updateActionButtonsForRow(row, true);
        reinitializeDropdowns();

        const tabToShow = document.querySelector(tabSelector);
        if (tabToShow) {
            new Tab(tabToShow).show();
        } else {
            console.error("Tab to show not found for selector:", tabSelector);
        }
    } else {
        console.error("Target table body not found:", tableSelector);
    }
    saveTableToLocalStorage();
}

function attachRestoreHandler(row, tableSelector) {
    if (!row) {
        console.error("No row to restore.");
        return;
    }

    const reservationId = row.dataset.id;
    const reservationData = getReservationFromLocalStorage(
        `reservation_${reservationId}`
    );
    reservationData.archived = false;
    saveReservationToLocalStorage(
        `reservation_${reservationId}`,
        reservationData
    );

    const activeReservationsBody = document.querySelector(tableSelector);
    if (activeReservationsBody) {
        activeReservationsBody.appendChild(row);
        updateActionButtonsForRow(row, false);
        reinitializeDropdowns();
    } else {
        console.error("Failed to find the table body: ", tableSelector);
    }
    saveTableToLocalStorage();
}

function saveTableToLocalStorage() {
	const reservationsTable = document.querySelector(
		"#reservationsTable tbody"
	);
	const completedReservationsTable = document.querySelector(
		"#completedReservationsTable tbody"
	);

	saveAllDataToLocalStorage({
		reservationsHTML: reservationsTable.innerHTML,
		completedReservationsHTML: completedReservationsTable.innerHTML,
	});
}

export { attachArchiveHandler, attachRestoreHandler };
