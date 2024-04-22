export const sortOrder = {};

function sortTable(tbody, column, dataType, isAscending) {
	const rows = Array.from(tbody.querySelectorAll("tr"));

	let sortedRows = rows.sort((a, b) => {
		let aValue = a.dataset[column];
		let bValue = b.dataset[column];

		switch (dataType) {
			case "number":
				aValue = Number(aValue);
				bValue = Number(bValue);
				break;
			case "date":
				aValue = new Date(aValue);
				bValue = new Date(bValue);
				break;
			case "text":
			default:
				// Сравнение строк как есть
				break;
		}

		if (isAscending) {
			return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
		} else {
			return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
		}
	});

	// Обновляем DOM
	tbody.innerHTML = "";
	sortedRows.forEach((row) => tbody.appendChild(row));
}

function compareNumbers(a, b, order) {
	return order === "asc" ? Number(a) - Number(b) : Number(b) - Number(a);
}

function compareDates(a, b, order) {
	const dateA = new Date(a);
	const dateB = new Date(b);
	return order === "asc" ? dateA - dateB : dateB - dateA;
}

function compareText(a, b, order) {
	return order === "asc" ? a.localeCompare(b) : b.localeCompare(a);
}

function sortByStatus(rows, ascending) {
	// Определение приоритетов статусов
	const statusPriority = {
		Actif: 1,
		"En attente": 2,
		Annulé: 3,
	};

	return rows.sort((a, b) => {
		const priorityA = statusPriority[a.dataset.status] || 999;
		const priorityB = statusPriority[b.dataset.status] || 999;
		return ascending ? priorityA - priorityB : priorityB - priorityA;
	});
}

function setMinMaxDates() {
	const today = new Date();
	const maxDate = new Date(
		today.getFullYear() + 3,
		today.getMonth(),
		today.getDate()
	);

	// Преобразование в формат YYYY-MM-DD
	const formatDate = (date) => date.toISOString().split("T")[0];

	// Установка атрибутов min и max для полей ввода даты
	document.querySelectorAll('.edit-mode[type="date"]').forEach((input) => {
		input.setAttribute("min", formatDate(today));
		input.setAttribute("max", formatDate(maxDate));
	});
}

function initializeSortingButtons() {
	const sortButtons = document.querySelectorAll(".sortButton");
	console.log(`Attaching sorting handlers to ${sortButtons.length} buttons.`);

	sortButtons.forEach((button) => {
		button.addEventListener("click", function () {
			console.log("Sort button clicked.");

			const header = this.closest("th");
			const column = header ? header.getAttribute("data-column") : null;
			const dataType = header ? header.getAttribute("data-type") : null;
			const table = header ? header.closest("table") : null;
			const tbody = table ? table.querySelector("tbody") : null;

			if (!header || !column || !dataType || !table || !tbody) {
				console.error(
					"Failed to retrieve necessary elements for sorting:",
					{
						header,
						column,
						dataType,
						table,
						tbody,
					}
				);
				return;
			}

			console.log(`Sorting column: ${column}, Data type: ${dataType}`);

			const sortingKey = table.id + "_sortingColumn";
			const orderKey = table.id + "_sortingOrder";
			const currentOrder = localStorage.getItem(orderKey);
			const isAscending = currentOrder !== "asc";

			console.log(
				`Current sort order: ${currentOrder}, New sort order: ${
					isAscending ? "asc" : "desc"
				}`
			);

			localStorage.setItem(sortingKey, column);
			localStorage.setItem(orderKey, isAscending ? "asc" : "desc");

			sortTable(tbody, column, dataType, isAscending);
			console.log("Table sorted.");
		});
	});
}

function attachSortTooltips() {
    document.querySelectorAll(".btn-link").forEach((btn) => {
        btn.addEventListener("mouseenter", (e) => {
            const sortType = e.target.closest("th").textContent.trim();
            e.target.title = `Sort by ${sortType}`;
        });
    });
}

export { sortTable, sortByStatus, setMinMaxDates, initializeSortingButtons, attachSortTooltips };
