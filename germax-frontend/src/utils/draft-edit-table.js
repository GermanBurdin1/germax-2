// function initializeRowForEditing(row) {
// 	const statusSelect = row.querySelector("select.edit-mode");
// 	const startDateInput = row.querySelector('input[name="startdate"]');
// 	const endDateInput = row.querySelector('input[name="enddate"]');

// 	// Устанавливаем текущее значение статуса из dataset
// 	if (statusSelect) {
// 		const currentStatus = row.dataset.status;
// 		statusSelect.value = currentStatus;
// 	}

// 	// Устанавливаем текущие значения дат из dataset
// 	if (startDateInput && endDateInput) {
// 		startDateInput.value = row.dataset.startdate;
// 		endDateInput.value = row.dataset.enddate;
// 	}
// }


// function saveChanges(row) {
// 	const inputs = row.querySelectorAll(".edit-mode");
// 	let isValidDate = true; // Флаг валидности дат
// 	let startDate = null;
// 	let endDate = null;

// 	inputs.forEach((input) => {
// 		const errorMessageSpan =
// 			input.nextElementSibling &&
// 			input.nextElementSibling.classList.contains("error-message")
// 				? input.nextElementSibling
// 				: null;

// 		if (input.type === "date") {
// 			if (errorMessageSpan) {
// 				errorMessageSpan.classList.add("d-none");
// 				errorMessageSpan.textContent = ""; // Очищаем предыдущие сообщения об ошибке
// 			}

// 			const dateValue = input.value ? new Date(input.value) : null;
// 			const minDate = new Date(input.getAttribute("min"));
// 			const maxDate = new Date(input.getAttribute("max"));

// 			if (
// 				dateValue &&
// 				(isNaN(dateValue.getTime()) ||
// 					dateValue < minDate ||
// 					dateValue > maxDate)
// 			) {
// 				isValidDate = false;
// 				if (errorMessageSpan) {
// 					errorMessageSpan.classList.remove("d-none");
// 					errorMessageSpan.textContent =
// 						"La date sélectionnée dépasse les limites autorisées. Veuillez choisir une date à partir d'aujourd'hui et dans les 3 prochaines années.";
// 				}
// 			} else if (!dateValue || isNaN(dateValue.getTime())) {
// 				isValidDate = false;
// 				if (errorMessageSpan) {
// 					errorMessageSpan.classList.remove("d-none");
// 					errorMessageSpan.textContent = "La date entrée est invalide.";
// 				}
// 			} else {
// 				// Запоминаем значения даты начала и окончания
// 				if (input.name === "startdate") {
// 					startDate = dateValue;
// 				} else if (input.name === "enddate") {
// 					endDate = dateValue;
// 				}
// 			}
// 		}
// 	});

// 	// Проверка, что дата начала не больше даты окончания
// 	if (startDate && endDate && startDate > endDate) {
// 		isValidDate = false;
// 		// Находим элементы для сообщения об ошибке у конкретных полей даты начала и окончания
// 		const startErrorMessageSpan = row.querySelector(
// 			'input[name="startdate"]'
// 		).nextElementSibling;
// 		const endErrorMessageSpan = row.querySelector(
// 			'input[name="enddate"]'
// 		).nextElementSibling;

// 		if (startErrorMessageSpan && endErrorMessageSpan) {
// 			startErrorMessageSpan.classList.remove("d-none");
// 			startErrorMessageSpan.textContent =
// 				"La date de début doit être antérieure à la date de fin.";
// 			endErrorMessageSpan.classList.remove("d-none");
// 			endErrorMessageSpan.textContent = "";
// 		}
// 	}

// 	if (!isValidDate) return; // Прекращаем выполнение функции, если дата невалидна

// 	const statusSelect = row.querySelector("select.edit-mode");
// 	if (statusSelect) {
// 		const statusSpan = row.querySelector("td:nth-child(6) span");
// 		statusSpan.textContent =
// 			statusSelect.options[statusSelect.selectedIndex].text;
// 		// Обновляем dataset статуса
// 		row.dataset.status = statusSelect.value;
// 	}

// 	// Формирование объекта данных для сохранения
// 	const reservationData = {
// 		id: row.dataset.id,
// 		user: row.dataset.user,
// 		equipment: row.dataset.equipment,
// 		startDate: row.dataset.startdate,
// 		endDate: row.dataset.enddate,
// 		status: row.dataset.status,
// 	};

// 	//TODO: нужно будет переписать
// 	const conflictData = {
// 		id: row.dataset.id,
// 		user: row.dataset.user,
// 		equipment: row.dataset.equipment,
// 		startDate: row.dataset.startdate,
// 		endDate: row.dataset.enddate,
// 		status: row.dataset.status,
// 	};

// 	// Сохранение в LocalStorage
// 	saveDataToLocalStorage(`reservation_${reservationData.id}`, reservationData);
// 	saveDataToLocalStorage(`conflict_${conflictData.id}`, conflictData);

// 	// Очистка редактора и возвращение в исходное состояние
// 	toggleElements(row, false);
// 	row.classList.remove("editing");
// 	removeSaveCancelButtons(row);
// }

// function removeSaveCancelButtons(row) {
// 	row
// 		.querySelectorAll(".save-changes, .cancel-changes")
// 		.forEach((button) => button.remove());
// }


// function saveDataToLocalStorage(row, data) {
// 	const key = `row_data_${row.dataset.id}`;
// 	localStorage.setItem(key, JSON.stringify(data));
// }
