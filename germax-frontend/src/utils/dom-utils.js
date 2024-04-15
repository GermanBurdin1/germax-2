import Dropdown from "bootstrap/js/dist/dropdown";

function reinitializeDropdowns() {
	document
		.querySelectorAll(".dropdown-toggle")
		.forEach((dropdownToggleEl) => {
			new Dropdown(dropdownToggleEl); // Используйте Dropdown напрямую
		});
}

function updateActionButtonsForRow(row, archived) {
	// Находим все нужные элементы внутри строки
	const editButton = row.querySelector(".edit-reservation");
	const deleteButton = row.querySelector(".delete-action");
	const detailButton = row.querySelector(".view-details");
	const archiveButton = row.querySelector(".archive-action");
	const restoreButton = row.querySelector(".restore-action a"); // Обратите внимание, что в вашем HTML восстановление обёрнуто в <a>

	// Устанавливаем видимость кнопок в зависимости от того, архивирована ли запись
	if (archived) {
		// Для архивированных записей скрываем кнопки "Редактировать", "Посмотреть детали" и "Архивировать"
		if (editButton) editButton.classList.add("d-none");
		if (detailButton) detailButton.classList.add("d-none");
		if (archiveButton) archiveButton.classList.add("d-none");

		// Показываем кнопку "Восстановить" и "Удалить"
		if (restoreButton)
			restoreButton.parentNode.classList.remove("d-none"); // Используем parentNode, чтобы управлять видимостью <li>
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

export {reinitializeDropdowns, updateActionButtonsForRow};
