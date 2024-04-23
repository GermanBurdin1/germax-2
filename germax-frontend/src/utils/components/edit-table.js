import { saveDataToLocalStorage } from "../storage-utils";
import { validateDate, validateEmail } from "../validate-data";

function attachEditRowHandlers(rowHandler) {
	document.querySelectorAll(rowHandler).forEach((item) => {
		item.addEventListener("click", function (event) {
			console.log("произошел клик:", item);
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
	// Определение источника данных: проверяем все возможные data-* атрибуты для идентификаторов
	const dataKeys = row.dataset;
	let storageKey = "";
	let sourceData = {};

	// Поиск первого ключа, который оканчивается на "Id" и используется в localStorage
	for (const key in dataKeys) {
			if (key.endsWith("Id") && localStorage.getItem(`${key}_${dataKeys[key]}`)) {
					storageKey = `${key}_${dataKeys[key]}`;
					sourceData = JSON.parse(localStorage.getItem(storageKey));
					break; // Найден подходящий ключ, прерываем цикл
			}
	}

	// Если подходящих данных в localStorage не нашлось, используем значения из dataset
	if (!storageKey) {
			sourceData = Object.assign({}, dataKeys);
	}

	// Инициализация всех полей ввода, textarea и select
	row.querySelectorAll("input.edit-mode, select.edit-mode, textarea.edit-mode").forEach(element => {
			const fieldName = element.name; // Имя поля, соответствующее ключам в sourceData
			// Для select, checkbox и radio устанавливаем значения
			if (element.tagName === 'SELECT' || element.type === 'checkbox' || element.type === 'radio') {
					if (element.type === 'checkbox' || element.type === 'radio') {
							element.checked = (sourceData[fieldName] === 'true' || sourceData[fieldName] === true);
					} else {
							element.value = sourceData[fieldName] || element.value; // Устанавливаем значение select
					}
			} else {
					// Для input и textarea присваиваем значение
					element.value = sourceData[fieldName] || element.previousElementSibling?.textContent.trim() || '';
			}
	});
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
	if (!validateRowData(row)) return; // Если данные не прошли валидацию, прекращаем обработку

	const dataToUpdate = extractDataFromRow(row);
	updateRowDisplay(row, dataToUpdate);
	saveDataToLocalStorage(row, dataToUpdate);

	// Очистка редактора и возвращение в исходное состояние
	toggleElements(row, false);
	row.classList.remove("editing");
	removeSaveCancelButtons(row);
}

function validateRowData(row) {
	let isValid = true;
	row.querySelectorAll(".edit-mode").forEach(input => {
			if (input.dataset.validate) {  // Проверка на наличие атрибута валидации
					switch (input.dataset.validate) {
							case "date":
									if (!validateDate(input)) {
											displayError(input, "Invalid date. Please check the range and format.");
											isValid = false;
									}
									break;
							case "email":
									if (!validateEmail(input.value)) {
											displayError(input, "Invalid email address.");
											isValid = false;
									}
									break;
							// Добавьте другие случаи валидации по необходимости
					}
			}
	});
	return isValid;
}

function displayError(input, message) {
	let errorSpan = input.nextElementSibling;
	if (!errorSpan || !errorSpan.classList.contains("error-message")) {
			errorSpan = document.createElement("span");
			errorSpan.classList.add("error-message");
			input.parentNode.insertBefore(errorSpan, input.nextSibling);
	}
	errorSpan.textContent = message;
	errorSpan.classList.remove("d-none");
}

function extractDataFromRow(row) {
	const data = {};
	row.querySelectorAll(".edit-mode").forEach(element => {
			if (element.type === 'checkbox' || element.type === 'radio') {
					data[element.name] = element.checked;
			} else {
					data[element.name] = element.value;
			}
	});
	return data;
}

function updateRowDisplay(row, data) {
	Object.keys(data).forEach(key => {
			const span = row.querySelector(`span[data-bind='${key}']`);
			if (span) span.textContent = data[key];
	});
}

function removeSaveCancelButtons(row) {
	row.querySelectorAll(".save-changes, .cancel-changes").forEach(button => button.remove());
}


export { attachEditRowHandlers };
