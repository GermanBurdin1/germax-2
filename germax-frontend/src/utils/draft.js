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
import {
	COMPLETED_RESERVATIONS_SELECTOR_MANAGEMENT_RESERVATIONS,
	COMPLETED_RESERVATIONS_SELECTOR_CONFLICTS,
	ARIA_LABELLED_BY_ACTIVE_RESERVATIONS_TAB,
	ARIA_LABELLED_BY_ACTIVE_RESERVATIONS_TAB_CONFLICTS,
	ACTIVE_RESERVATIONS_TBODY,
	ACTIVE_CONFLICTS_TBODY,
} from "./const.js";

function createArchiveHandlerWrapper(tabSelector) {
	return function (row, tableSelector) {
		if (!row) {
			console.error("No row provided to archive handler.");
			return;
		}
		// Предполагается, что кнопка для архивации находится внутри строки.
		const button = row.querySelector(".archive-action");
		if (!button) {
			console.error("Archive button not found in the row");
			return;
		}
		attachArchiveHandler(button, tableSelector, tabSelector);
	};
}

function createRestoreHandler() {
	return function (row, tableSelector) {
		attachRestoreHandler(row, tableSelector);
	};
}

function reattachEventHandlers(tableSelector, buttonClass, actionHandler) {
    console.log(`Attempting to reattach handlers for table with selector '${tableSelector}' using buttons with class '${buttonClass}'`);
    const table = document.querySelector(tableSelector);
    if (!table) {
        console.error(`Table not found: '${tableSelector}'`);
        return;
    }

    const existingButtons = table.querySelectorAll(buttonClass);
    if (existingButtons.length === 0) {
        console.log(`No '${buttonClass}' buttons found in the table '${tableSelector}'. No reattachment necessary.`);
        return;
    }

    console.log(`Found ${existingButtons.length} '${buttonClass}' button(s) to reattach handlers to in '${tableSelector}'.`);
    existingButtons.forEach((button, index) => {
        button.removeEventListener("click", actionHandler);
        button.addEventListener("click", function (e) {
            e.preventDefault();
            const row = button.closest("tr");
            if (!row) {
                console.error(`No row found for the button with class '${buttonClass}' at index ${index} in table '${tableSelector}'`);
                return;
            }
            actionHandler(row, tableSelector + " tbody");
            console.log(`Handler reattached for '${buttonClass}' button at index ${index} in table '${tableSelector}'`);
        });
    });
}



// Пример использования
reattachEventHandlers(
	"#reservationsTable",
	".archive-action",
	createArchiveHandlerWrapper(ARIA_LABELLED_BY_ACTIVE_RESERVATIONS_TAB)
);
reattachEventHandlers(
	"#reservationsTable",
	".restore-action",
	createRestoreHandler
);
reattachEventHandlers(
	"#conflictsTable",
	".archive-action",
	createArchiveHandlerWrapper(ARIA_LABELLED_BY_ACTIVE_RESERVATIONS_TAB_CONFLICTS)
);
reattachEventHandlers(
	"#conflictsTable",
	".restore-action",
	createRestoreHandler
);

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

	// Перемещаем строку напрямую, не создавая клона
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
	reattachEventHandlers(
		"#reservationsTable",
		".archive-action",
		attachArchiveHandler
	);
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

function attachRestoreHandler(row, tableSelector) {
	if (!row) {
		console.error("No row to restore.");
		return;
	}

	const reservationId = row.dataset.id; // Получаем ID бронирования из строки

	// Восстанавливаем данные из localStorage
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
		activeReservationsBody.appendChild(row); // Добавляем строку обратно в таблицу
		updateActionButtonsForRow(row, false); // Обновляем кнопки на строке
		reinitializeDropdowns(); // Переинициализируем дропдауны, если нужно
	} else {
		console.error("Failed to find the table body: ", tableSelector);
	}

	// Сохраняем изменения в localStorage
	saveTableToLocalStorage();
	reattachEventHandlers(
		"#completedReservationsTable",
		".restore-action",
		attachRestoreHandler
	);
}

export { attachArchiveHandler, attachRestoreHandler };
