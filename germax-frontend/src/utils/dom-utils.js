import Dropdown from "bootstrap/js/dist/dropdown";

export function reinitializeDropdowns() {
	document.querySelectorAll(".dropdown-toggle").forEach((dropdownToggleEl) => {
		new Dropdown(dropdownToggleEl); // Используйте Dropdown напрямую
	});
}

export function updateActionButtonsForRow(row, archived) {
	// Находим все нужные элементы внутри строки
	const editButton = row.querySelector(".edit-reservation");
	const deleteButton = row.querySelector(".delete-action");
	const detailButton = row.querySelector(".view-details");
	const archiveButton = row.querySelector(".archive-action");
	const restoreButton = row.querySelector(".restore-action a");
	const resolveConflictAction = row.querySelector(".resolve-action");

	// Обратите внимание, что в вашем HTML восстановление обёрнуто в <a>

	// Устанавливаем видимость кнопок в зависимости от того, архивирована ли запись
	if (archived) {
		// Для архивированных записей скрываем кнопки "Редактировать", "Посмотреть детали" и "Архивировать"
		if (editButton) editButton.classList.add("d-none");
		if (detailButton) detailButton.classList.add("d-none");
		if (archiveButton) archiveButton.classList.add("d-none");
		if (resolveConflictAction) resolveConflictAction.classList.add("d-none");

		// Показываем кнопку "Восстановить" и "Удалить"
		if (restoreButton) restoreButton.parentNode.classList.remove("d-none"); // Используем parentNode, чтобы управлять видимостью <li>
		if (deleteButton) deleteButton.classList.remove("d-none");
	} else {
		// Для активных записей возвращаем видимость кнопок "Редактировать", "Посмотреть детали" и "Архивировать"
		if (editButton) editButton.classList.remove("d-none");
		if (detailButton) detailButton.classList.remove("d-none");
		if (archiveButton) archiveButton.classList.remove("d-none");

		// Скрываем кнопку "Восстановить"
		if (restoreButton) restoreButton.parentNode.classList.add("d-none");
		if (deleteButton) deleteButton.classList.add("d-none"); // Предположим, что кнопку "Удалить" мы хотим показывать только в архиве
	}
}

export function getFormData(formId) {
	const formData = {};
	const form = document.getElementById(formId);

	// Получаем все элементы формы
	const elements = form.elements;

	// Проходимся по всем элементам формы
	for (let i = 0; i < elements.length; i++) {
		const element = elements[i];

		// Исключаем кнопки отправки формы и другие элементы без атрибута name
		if (element.tagName !== "BUTTON" && element.name) {
			// Добавляем данные из элемента в объект formData
			formData[element.name] = element.value;
		}
	}

	return formData;
}
