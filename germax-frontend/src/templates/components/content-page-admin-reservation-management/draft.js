// Назначение обработчиков для кнопок "Архивировать"
document.querySelectorAll(".archive-action").forEach((button) => {
	attachArchiveHandler(button);
});

// Назначение обработчиков для кнопок "Восстановить" (если они изначально присутствуют в DOM)
document.querySelectorAll(".restore-action").forEach((button) => {
	attachRestoreHandler(button);
});

function attachArchiveHandler(button) {
	button.addEventListener("click", function (event) {
		event.preventDefault();
		const row = button.closest("tr");
		const completedReservationsBody = document.querySelector(
			"#completedReservations tbody"
		);
		completedReservationsBody.appendChild(row);

		// Обновляем действия для строки
		updateActionButtonsForRow(row, true);

		// Переключаемся на вкладку 'Завершенные резервации'
		const completedTab = new Tab(
			document.querySelector("#completed-reservations-tab")
		);
		completedTab.show();

		reinitializeDropdowns();

		const reservationId = row.dataset.id;
		const reservationData =
			JSON.parse(
				localStorage.getItem(`reservation_${reservationId}`)
			) || {};
		reservationData.archived = true; // Устанавливаем статус архивации
		localStorage.setItem(
			`reservation_${reservationId}`,
			JSON.stringify(reservationData)
		);

		updateActionButtonsForRow(row, true);
	});
}

function attachRestoreHandler(button) {
	button.addEventListener("click", function () {
		const row = button.closest("tr");
		const reservationId = row.dataset.id;
		// Получаем данные о бронировании из localStorage
		const reservationData =
			JSON.parse(
				localStorage.getItem(`reservation_${reservationId}`)
			) || {};

		// Обновляем статус архивации
		reservationData.archived = false; // Указываем, что бронирование больше не архивировано

		// Сохраняем обновлённые данные обратно в localStorage
		localStorage.setItem(
			`reservation_${reservationId}`,
			JSON.stringify(reservationData)
		);

		const activeReservationsBody = document.querySelector(
			"#activeReservations tbody"
		);
		activeReservationsBody.appendChild(row);
		updateActionButtonsForRow(row, false); // Обновляем кнопки для активных строк

		// Не забудьте вызвать функции переинициализации компонентов, если это необходимо
		reinitializeDropdowns();
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

function initializeTabs() {
	// Инициализируем все вкладки Bootstrap на странице
	const triggerTabList = [].slice.call(
		document.querySelectorAll('a[data-bs-toggle="tab"]')
	);
	triggerTabList.forEach(function (triggerEl) {
		const tabTrigger = new Tab(triggerEl);

		triggerEl.addEventListener("click", function (event) {
			event.preventDefault();
			tabTrigger.show();
			reinitializeDropdowns();
		});
	});
}

function reinitializeDropdowns() {
	document
		.querySelectorAll(".dropdown-toggle")
		.forEach((dropdownToggleEl) => {
			new Dropdown(dropdownToggleEl); // Используйте Dropdown напрямую
		});
	console.log("Dropdown успешно переинициализированы");
}
