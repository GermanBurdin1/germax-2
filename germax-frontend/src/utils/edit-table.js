import {saveDataToLocalStorage} from './storage-utils';

function attachEditRowHandlers(rowHandler) {
	document.querySelectorAll(rowHandler).forEach((item) => {
		console.log("item для equipment management:",)
		item.addEventListener("click", function (event) {
			event.preventDefault();

			const row = this.closest("tr");
			row.classList.add("editing"); // Добавляем класс для визуального отображения режима редактирования

			// Переключение видимости элементов и установка текущего значения для select
			toggleElements(row, true); // Функция должна переключать видимость элементов
			initializeRowForEditing(row); // Функция для инициализации данных строки для редактирования

			// Добавление кнопок "Сохранить" и "Отменить", если они еще не были добавлены
			addSaveCancelButtons(row); // Функция добавляет или проверяет наличие необходимых кнопок
		});
	});
}

function toggleElements(row, isEditing) {
	const viewModeElements = Array.from(row.querySelectorAll(".view-mode"));
	const editModeElements = Array.from(row.querySelectorAll(".edit-mode"));

	if (isEditing) {
		console.log("View Mode Elements:", viewModeElements);
		console.log("Edit Mode Elements:", editModeElements);
		viewModeElements.forEach((element) => element.classList.add("d-none"));
		editModeElements.forEach((element) => element.classList.remove("d-none"));
	} else {
		viewModeElements.forEach((element) => element.classList.remove("d-none"));
		editModeElements.forEach((element) => element.classList.add("d-none"));
	}
}

function initializeRowForEditing(row) {
	const statusSelect = row.querySelector("select.edit-mode");
	const startDateInput = row.querySelector('input[name="startdate"]');
	const endDateInput = row.querySelector('input[name="enddate"]');

	// Устанавливаем текущее значение статуса из dataset
	if (statusSelect) {
		const currentStatus = row.dataset.status;
		statusSelect.value = currentStatus;
	}

	// Устанавливаем текущие значения дат из dataset
	if (startDateInput && endDateInput) {
		startDateInput.value = row.dataset.startdate;
		endDateInput.value = row.dataset.enddate;
	}
}

function addSaveCancelButtons(row) {
	if (!row.querySelector(".save-changes")) {
		const saveBtn = document.createElement("button");
		saveBtn.textContent = "Sauvegarder les changements";
		saveBtn.classList.add("btn", "btn-success", "save-changes");
		saveBtn.addEventListener("click", function () {
			saveChanges(row);
		});
		row.querySelector("td:last-child").appendChild(saveBtn);
	}

	if (!row.querySelector(".cancel-changes")) {
		const cancelBtn = document.createElement("button");
		cancelBtn.textContent = "Annuler les changements";
		cancelBtn.classList.add("btn", "btn-danger", "cancel-changes");
		cancelBtn.addEventListener("click", function () {
			toggleElements(row, false);
			row.classList.remove("editing");
			// Удаляем кнопки
			removeSaveCancelButtons(row);
		});
		row.querySelector("td:last-child").appendChild(cancelBtn);
	}
}

function saveChanges(row) {
	const inputs = row.querySelectorAll(".edit-mode");
	let isValidDate = true; // Флаг валидности дат
	let startDate = null;
	let endDate = null;

	inputs.forEach((input) => {
		const errorMessageSpan =
			input.nextElementSibling &&
			input.nextElementSibling.classList.contains("error-message")
				? input.nextElementSibling
				: null;

		if (input.type === "date") {
			if (errorMessageSpan) {
				errorMessageSpan.classList.add("d-none");
				errorMessageSpan.textContent = ""; // Очищаем предыдущие сообщения об ошибке
			}

			const dateValue = input.value ? new Date(input.value) : null;
			const minDate = new Date(input.getAttribute("min"));
			const maxDate = new Date(input.getAttribute("max"));

			if (
				dateValue &&
				(isNaN(dateValue.getTime()) ||
					dateValue < minDate ||
					dateValue > maxDate)
			) {
				isValidDate = false;
				if (errorMessageSpan) {
					errorMessageSpan.classList.remove("d-none");
					errorMessageSpan.textContent =
						"La date sélectionnée dépasse les limites autorisées. Veuillez choisir une date à partir d'aujourd'hui et dans les 3 prochaines années.";
				}
			} else if (!dateValue || isNaN(dateValue.getTime())) {
				isValidDate = false;
				if (errorMessageSpan) {
					errorMessageSpan.classList.remove("d-none");
					errorMessageSpan.textContent = "La date entrée est invalide.";
				}
			} else {
				// Запоминаем значения даты начала и окончания
				if (input.name === "startdate") {
					startDate = dateValue;
				} else if (input.name === "enddate") {
					endDate = dateValue;
				}
			}
		}
	});

	// Проверка, что дата начала не больше даты окончания
	if (startDate && endDate && startDate > endDate) {
		isValidDate = false;
		// Находим элементы для сообщения об ошибке у конкретных полей даты начала и окончания
		const startErrorMessageSpan = row.querySelector(
			'input[name="startdate"]'
		).nextElementSibling;
		const endErrorMessageSpan = row.querySelector(
			'input[name="enddate"]'
		).nextElementSibling;

		if (startErrorMessageSpan && endErrorMessageSpan) {
			startErrorMessageSpan.classList.remove("d-none");
			startErrorMessageSpan.textContent =
				"La date de début doit être antérieure à la date de fin.";
			endErrorMessageSpan.classList.remove("d-none");
			endErrorMessageSpan.textContent = "";
		}
	}

	if (!isValidDate) return; // Прекращаем выполнение функции, если дата невалидна

	const statusSelect = row.querySelector("select.edit-mode");
	if (statusSelect) {
		const statusSpan = row.querySelector("td:nth-child(6) span");
		statusSpan.textContent =
			statusSelect.options[statusSelect.selectedIndex].text;
		// Обновляем dataset статуса
		row.dataset.status = statusSelect.value;
	}

	// Формирование объекта данных для сохранения
	const reservationData = {
		id: row.dataset.id,
		user: row.dataset.user,
		equipment: row.dataset.equipment,
		startDate: row.dataset.startdate,
		endDate: row.dataset.enddate,
		status: row.dataset.status,
	};

	//TODO: нужно будет переписать
	const conflictData = {
		id: row.dataset.id,
		user: row.dataset.user,
		equipment: row.dataset.equipment,
		startDate: row.dataset.startdate,
		endDate: row.dataset.enddate,
		status: row.dataset.status,
	};

	// Сохранение в LocalStorage
	saveDataToLocalStorage(`reservation_${reservationData.id}`,reservationData);
	saveDataToLocalStorage(`conflict_${conflictData.id}`,conflictData);


	// Очистка редактора и возвращение в исходное состояние
	toggleElements(row, false);
	row.classList.remove("editing");
	removeSaveCancelButtons(row);
}

function removeSaveCancelButtons(row) {
	row
		.querySelectorAll(".save-changes, .cancel-changes")
		.forEach((button) => button.remove());
}

// document.querySelectorAll(".edit-action").forEach((item) => {
// 	item.addEventListener("click", function (event) {
// 		event.preventDefault();
// 		const row = this.closest("tr");
// 		row.classList.add("editing");

// 		// Скрываем span и делаем видимыми поля ввода и select
// 		row.querySelectorAll("td span").forEach((element) => {
// 			element.classList.add("d-none");
// 		});
// 		row.querySelectorAll("td input, td textarea, td select").forEach(
// 			(element) => {
// 				element.classList.remove("d-none");
// 				if (
// 					element.tagName === "INPUT" ||
// 					element.tagName === "TEXTAREA"
// 				) {
// 					// Присваиваем input и textarea значение предыдущего span
// 					element.value = element.previousElementSibling
// 						? element.previousElementSibling.textContent.trim()
// 						: "";
// 				}
// 			}
// 		);

// 		// Для select элементов, загружаем и устанавливаем текущее значение из данных оборудования
// 		const equipmentId = row.dataset.equipmentId;
// 		const data = JSON.parse(
// 			localStorage.getItem(`equipment_${equipmentId}`) || "{}"
// 		);

// 		const categorySelect = row.querySelector(
// 			"select[name='equipment-category']"
// 		);
// 		const availabilitySelect = row.querySelector(
// 			"select[name='equipment-availability']"
// 		);
// 		if (categorySelect) {
// 			categorySelect.value = data.category || ""; // Устанавливаем значение или пустую строку, если данных нет
// 		}
// 		if (availabilitySelect) {
// 			availabilitySelect.value = data.availability || ""; // То же самое для доступности
// 		}

// 		// Добавляем или обновляем кнопки "Сохранить изменения" и "Отменить изменения", если они не были добавлены
// 		if (!row.querySelector(".save-changes")) {
// 			const saveButton = document.createElement("button");
// 			saveButton.textContent = "Sauvegarder les changements";
// 			saveButton.classList.add("btn", "btn-primary", "save-changes");
// 			row.querySelector("td:last-child").appendChild(saveButton);
// 		}
// 		if (!row.querySelector(".cancel-changes")) {
// 			const cancelButton = document.createElement("button");
// 			cancelButton.textContent = "Annuler les changements";
// 			cancelButton.classList.add(
// 				"btn",
// 				"btn-secondary",
// 				"cancel-changes"
// 			);
// 			row.querySelector("td:last-child").appendChild(cancelButton);
// 		};

// document.addEventListener("click", function (event) {
// 	const target = event.target;

// 	if (target.classList.contains("save-changes")) {
// 		const row = target.closest("tr");
// 		const equipmentId = row.dataset.equipmentId;
// 		// Извлечение данных
// 		const nameInput = row.querySelector("input[name='equipment-name']");
// 		const categorySelect = row.querySelector(
// 			"select[name='equipment-category']"
// 		);
// 		const descriptionTextarea = row.querySelector(
// 			"textarea[name='equipment-description']"
// 		);
// 		const availabilitySelect = row.querySelector(
// 			"select[name='equipment-availability']"
// 		);

// 		if (nameInput && row.querySelector(".equipment-name")) {
// 			row.querySelector(".equipment-name").textContent =
// 				nameInput.value;
// 		}
// 		if (categorySelect && row.querySelector(".equipment-category")) {
// 			row.querySelector(".equipment-category").textContent =
// 				categorySelect.options[categorySelect.selectedIndex].text;
// 		}
// 		if (
// 			descriptionTextarea &&
// 			row.querySelector(".equipment-description")
// 		) {
// 			row.querySelector(".equipment-description").textContent =
// 				descriptionTextarea.value;
// 		}
// 		if (
// 			availabilitySelect &&
// 			row.querySelector(".equipment-availability")
// 		) {
// 			row.querySelector(".equipment-availability").textContent =
// 				availabilitySelect.options[
// 					availabilitySelect.selectedIndex
// 				].text;
// 		}

// 		// Сохраняем изменения в localStorage
// 		const data = {
// 			name: nameInput.value,
// 			category: categorySelect.value,
// 			description: descriptionTextarea.value,
// 			availability: availabilitySelect.value,
// 		};
// 		localStorage.setItem(
// 			`equipment_${equipmentId}`,
// 			JSON.stringify(data)
// 		);

// 		// Возвращаем элементы <span> к видимости и скрываем поля ввода
// 		row.querySelectorAll("td span").forEach((element) => {
// 			element.classList.remove("d-none");
// 		});
// 		row.querySelectorAll("td input, td textarea, td select").forEach(
// 			(element) => {
// 				element.classList.add("d-none");
// 			}
// 		);

// 		// Удаление кнопок "Sauvegarder les changements" и "Annuler les changements"
// 		row.querySelectorAll(".save-changes, .cancel-changes").forEach(
// 			(button) => {
// 				button.remove();
// 			}
// 		);

// 		row.classList.remove("editing");
// 	} else if (target.classList.contains("cancel-changes")) {
// 		const row = target.closest("tr");

// 		// Возвращаем элементы <span> к видимости и скрываем поля ввода без сохранения изменений
// 		row.querySelectorAll("td span").forEach((element) => {
// 			element.classList.remove("d-none");
// 		});
// 		row.querySelectorAll("td input, td textarea, td select").forEach(
// 			(element) => {
// 				element.classList.add("d-none");
// 			}
// 		);

// 		// Удаление кнопок "Sauvegarder les changements" и "Annuler les changements"
// 		row.querySelectorAll(".save-changes, .cancel-changes").forEach(
// 			(button) => {
// 				button.remove();
// 			}
// 		);

// 		row.classList.remove("editing");
// 	}
// });

export { attachEditRowHandlers };
