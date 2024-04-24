import "./index.css";
import Modal from "bootstrap/js/dist/modal";
import Dropdown from "bootstrap/js/dist/dropdown";
import { Tab } from "bootstrap";
import {initializeHoverDropdowns} from "../../../utils/bootstrap-components";
import {attachEditRowHandlers} from "../../../utils/components/edit-table-admin";

document.addEventListener("DOMContentLoaded", function () {

	const addEquipmentButton = document.querySelector(
		"#addEquipmentModal .btn-primary"
	);
	const addCategoryButton = document.querySelector(
		"#addCategoryModal .btn-primary"
	);

	if (addEquipmentButton) {
		const addEquipmentModalElement =
			document.getElementById("addEquipmentModal");
		const addEquipmentModal = new Modal(addEquipmentModalElement);

		addEquipmentButton.addEventListener("click", function () {
			alert("Équipement ajouté avec succès!");
			addEquipmentModal.hide();
		});
	}

	if (addCategoryButton) {
		const addCategoryModalElement =
			document.getElementById("addCategoryModal");
		const addCategoryModal = new Modal(addCategoryModalElement);

		addCategoryButton.addEventListener("click", function () {
			alert("Catégorie ajoutée avec succès!");
			addCategoryModal.hide();
		});
	}

	// Функция для отправки данных категории оборудования
	function saveCategory() {
		const name = document.getElementById("categoryName").value;

		fetch("http://germax-api/src/controllers/add-category.php", {
			method: "POST",
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
			},
			body: `name=${encodeURIComponent(name)}`,
		})
			.then((response) => response.json())
			.then((data) => {
				if (data.success) {
					alert(data.message);
					addCategoryModal.hide();
					document.getElementById("categoryName").value = "";
				} else {
					alert(data.message);
				}
			})
			.catch((error) => console.error("Ошибка:", error));
	}

	// Добавление слушателя событий для кнопки сохранения категории оборудования
	document
		.getElementById("saveCategoryBtn")
		.addEventListener("click", saveCategory);

	function saveEquipment() {
		const name = document.getElementById("equipmentName").value;
		const description = document.getElementById(
			"equipmentDescription"
		).value;
		const category = document.getElementById("categoryName").value; // Убедитесь, что это правильный ID

		let formData = new FormData();
		formData.append("name", name);
		formData.append("description", description);
		formData.append("category", category); // categoryId было изменено на category

		fetch("http://germax-api/src/controllers/admin-add-item.php", {
			method: "POST",
			body: formData,
		})
			.then((response) => response.json())
			.then((data) => {
				if (data.success) {
					alert(data.message);
					// Дополнительные действия при успешном сохранении
				} else {
					alert(data.message);
				}
			})
			.catch((error) => console.error("Erreur:", error));
	}

	// Добавление слушателя событий для кнопки сохранения оборудования
	document
		.getElementById("saveEquipmentBtn")
		.addEventListener("click", saveEquipment);

	function toggleActionLog() {
		const actionLogModal = new Modal(
			document.getElementById("actionLogModal")
		);
		actionLogModal.show();
	}

	document.querySelectorAll(".toggle-log-button").forEach((button) => {
		button.addEventListener("click", () => {
			toggleActionLog();
		});
	});

	document
		.querySelectorAll(".dropdown-menu .dropdown-item")
		.forEach((item) => {
			item.addEventListener("click", function (event) {
				const action = event.target.textContent.trim();
				const equipmentId = this.closest("tr").dataset.equipmentId;

				switch (action) {
					case "Supprimer":
						if (
							confirm(
								"Cette action est irréversible. Êtes-vous sûr de vouloir supprimer cet équipement?"
							)
						) {
							alert(`Supprimer: ${equipmentId}`);
						}
						break;
					case "Voir les détails":
						const detailsModal = new Modal(
							document.getElementById("detailsModal")
						);
						detailsModal.show();
						break;
					case "Réserver":
						const reserveModal = new Modal(
							document.getElementById("reserveModal")
						);
						reserveModal.show();
						break;
				}
			});
		});

	// Инициализация и показ/скрытие выпадающего меню при наведении мыши
	const dropdowns = document.querySelectorAll(".dropdown");
	initializeHoverDropdowns(dropdowns);

	// Обработчик клика для архивации
	document.querySelectorAll(".archive-action").forEach((button) => {
		attachArchiveHandler(button);
	});

	// Функция для добавления обработчика событий кнопке "Восстановить"
	function attachRestoreHandler(restoreButton) {
		restoreButton.addEventListener("click", function () {
			const row = restoreButton.closest("tr");

			// Получаем tbody активного оборудования
			const activeEquipmentBody = document.querySelector(
				"#activeEquipment tbody"
			);
			// Перемещаем строку обратно в активное оборудование
			activeEquipmentBody.appendChild(row);

			// Возвращаем кнопки к исходному состоянию
			const actionCell = row.querySelector("td:last-child");
			actionCell.innerHTML = `

			<button class="btn btn-secondary dropdown-toggle" type="button"
				id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
				Choisir une action
			</button>
			<ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
			  <li><a class="dropdown-item edit-action" href="#">Éditer</a></li>
			  <li><a class="dropdown-item delete-action" href="#">Supprimer</a></li>
			  <li><a class="dropdown-item" href="#">Voir les détails</a></li>
			  <li><a class="dropdown-item" href="#">Réserver</a></li>
			  <li><a class="dropdown-item toggle-log-button" href="#"
					  data-log-id="actionLog-1">Journal des actions</a></li>
			  <li><a class="dropdown-item archive-action" href="#">Archiver</a></li>
			</ul>

	  `;

			// Переключаемся на вкладку 'Активное оборудование'
			const activeTab = new bootstrap.Tab(
				document.querySelector("#active-equipment-tab")
			);
			activeTab.show();

			// Повторно привязываем обработчик для кнопки "Архивировать"
			const newArchiveButton =
				actionCell.querySelector(".archive-action");
			if (newArchiveButton) {
				attachArchiveHandler(newArchiveButton);
			}
		});
	}

	// Функция для добавления обработчика событий кнопке "Архивировать"
	function attachArchiveHandler(archiveButton) {
		archiveButton.addEventListener("click", function () {
			const row = archiveButton.closest("tr");

			// Находим таблицу архивного оборудования
			const archiveTableBody = document.querySelector(
				"#archiveEquipment tbody"
			);

			// Добавляем строку в таблицу архива
			archiveTableBody.appendChild(row);

			// Изменяем действия для архивной строки
			const actionCell = row.querySelector("td:last-child");
			actionCell.innerHTML = `
		<button class="btn btn-primary restore-action" data-equipment-id="${row.dataset.equipmentId}">Восстановить</button>
	  `;

			// Добавляем обработчик для кнопки "Восстановить" для только что перемещенной строки
			const restoreButton = actionCell.querySelector(".restore-action");
			attachRestoreHandler(restoreButton);

			// Переключаемся на вкладку 'Архив'
			const archiveTab = new bootstrap.Tab(
				document.querySelector("#archive-equipment-tab")
			);
			archiveTab.show();
		});
	}

	// edit-action

	attachEditRowHandlers(".edit-action");
	// Загрузка данных из localStorage при загрузке страницы


	window.addEventListener("load", () => {
		console.log("Before updating DOM for equipment");
		document.querySelectorAll("[data-equipment-id]").forEach((row) => {
			const equipmentId = row.dataset.equipmentId;
			const data = JSON.parse(
				localStorage.getItem(`equipment_${equipmentId}`)
			);
			console.log(data);
			if (data) {
				if (row.querySelector(".equipment-name")) {
					row.querySelector(".equipment-name").textContent =
						data.name;
				}
				if (row.querySelector(".equipment-category")) {
					row.querySelector(".equipment-category").textContent =
						data.category;
				}
				if (row.querySelector(".equipment-description")) {
					row.querySelector(".equipment-description").textContent =
						data.description;
				}
				if (row.querySelector(".equipment-availability")) {
					row.querySelector(".equipment-availability").textContent =
						data.availability;
				}
				console.log("After updating DOM for equipment", equipmentId);
			}
		});
	});

	document.addEventListener("click", function (event) {
		if (event.target.classList.contains("delete-action")) {
			event.preventDefault();

			const row = event.target.closest("tr");
			const equipmentId = row.dataset.equipmentId;

			localStorage.removeItem(`equipment_${equipmentId}`);

			row.remove();
		}
	});

	document.addEventListener("DOMContentLoaded", function () {
		// Ищем все элементы, которые должны вести себя как вкладки
		const triggerTabList = [].slice.call(
			document.querySelectorAll('.nav-link[data-bs-toggle="tab"]')
		);

		triggerTabList.forEach(function (triggerEl) {
			const tabTrigger = new Tab(triggerEl);

			triggerEl.addEventListener("click", function (e) {
				e.preventDefault();
				tabTrigger.show();
			});
		});
	});

	//Journal des actions

	const actionLog = [
		{ date: "14/04/2021", user: "Utilisateur A", action: "Prêté" },
		{
			date: "07/06/2021",
			user: "Utilisateur B",
			action: "Retourné et vérifié",
		},
		// Добавьте дополнительные записи здесь
	];

	let currentPage = 1;
	const entriesPerPage = 10; // Количество записей на страницу

	function renderLog(entries) {
		const logContainer = document.getElementById("actionLogEntries");
		logContainer.innerHTML = ""; // Очистить текущие записи
		entries.forEach((entry) => {
			const div = document.createElement("div");
			div.textContent = `${entry.date} - ${entry.user} - ${entry.action}`;
			logContainer.appendChild(div);
		});
	}

	function filterAndRender() {
		let filteredEntries = actionLog
			.filter((entry) =>
				entry.user
					.toLowerCase()
					.includes(
						document
							.getElementById("searchByName")
							.value.toLowerCase()
					)
			)
			.sort(
				(a, b) =>
					new Date(b.date.split("/").reverse().join("-")) -
					new Date(a.date.split("/").reverse().join("-"))
			); // Сортировка по дате

		const start = (currentPage - 1) * entriesPerPage;
		const paginatedEntries = filteredEntries.slice(
			start,
			start + entriesPerPage
		);
		renderLog(paginatedEntries);
	}

	document.getElementById("searchByName").addEventListener("input", () => {
		currentPage = 1;
		filterAndRender();
	});

	document.getElementById("sortByDate").addEventListener("click", () => {
		filterAndRender(); // Сортировка уже встроена в filterAndRender
	});

	document.getElementById("prevPage").addEventListener("click", () => {
		if (currentPage > 1) {
			currentPage--;
			filterAndRender();
		}
	});

	document.getElementById("nextPage").addEventListener("click", () => {
		// Предполагаем, что всегда есть следующая страница
		currentPage++;
		filterAndRender();
	});

	filterAndRender(); // Инициализация первой страницы журнала

	// экспорт в csv
	/////////////////////////////////////////////////////////////////////////

	function exportToCSV(actionLog) {
		// Создание заголовков CSV файла
		const csvHeaders = "Date,User,Action\n";
		// Преобразование данных журнала в строку CSV
		const csvRows = actionLog
			.map((entry) => `"${entry.date}","${entry.user}","${entry.action}"`)
			.join("\n");

		// Создание строки CSV с BOM для UTF-8
		const BOM = "\uFEFF";
		const csvString = BOM + csvHeaders + csvRows;

		// Создание Blob объекта с типом MIME для CSV и указанием кодировки UTF-8
		const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });

		// Создание временной ссылки для скачивания и её нажатие
		const link = document.createElement("a");
		if (link.download !== undefined) {
			// Проверка поддержки атрибута download
			const url = URL.createObjectURL(blob);
			link.setAttribute("href", url);
			link.setAttribute("download", "actionLog.csv");
			link.style.visibility = "hidden";
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
		}
	}

	// Добавляем слушатель события на кнопку экспорта
	document.getElementById("exportLog").addEventListener("click", function () {
		exportToCSV(actionLog); // Предполагается, что actionLog - это ваш массив данных журнала
	});

	////////////////////////////////////////////////////////////////////////////////////////////
	//////////////////////////////////// логика reserveModal

	let currentPageReserveModal = 1;
	const entriesPerPageReserveModal = 20; // Показывать по 20 записей на страницу
	let currentEntriesReserveModal = []; // Текущие отфильтрованные записи для отображения
	let currentCategoryReserveModal = "enseignants"; // По умолчанию показываем 'enseignants'

	// Предполагаемые начальные данные для enseignants и etudiants
	const enseignants = [
		{
			nom: "Dupont",
			prenom: "Jean",
			telephone: "0123456789",
			email: "jean.dupont@example.com",
			photoUrl: "path_to_photo_jean.jpg",
		},
		// Добавьте больше данных сюда
	];

	const etudiants = [
		{
			nom: "Doe",
			prenom: "Jane",
			telephone: "0987654321",
			email: "jane.doe@example.com",
			photoUrl: "path_to_photo_jane.jpg",
		},
		// Добавьте больше данных сюда
	];

	// Определите контейнеры для пагинации и пользователей
	const paginationContainer = document.querySelector(
		".pagination-reserve-modal"
	);
	const userContainerEnseignants = document.getElementById(
		"v-pills-enseignants"
	);
	const userContainerEtudiants = document.getElementById("v-pills-etudiants");

	// Функция для рендеринга списка пользователей
	function renderUsers() {
		// Определяем текущий контейнер на основе выбранной категории
		const container =
			currentCategoryReserveModal === "enseignants"
				? userContainerEnseignants
				: userContainerEtudiants;
		container.innerHTML = ""; // Очистка контейнера перед добавлением новых данных

		const usersToRender = currentEntriesReserveModal.slice(
			(currentPageReserveModal - 1) * entriesPerPageReserveModal,
			currentPageReserveModal * entriesPerPageReserveModal
		);

		usersToRender.forEach((user) => {
			const userElement = document.createElement("div");
			userElement.className = "user-card mb-3";
			userElement.innerHTML = `
                <div class="card">
                    <img src="${user.photoUrl}" class="card-img-top" alt="Photo de ${user.prenom}">
                    <div class="card-body">
                        <h5 class="card-title">${user.prenom} ${user.nom}</h5>
                        <p class="card-text">${user.telephone}</p>
                        <p class="card-text">${user.email}</p>
                        <button class="btn btn-primary">Attribuer l'équipement</button>
                    </div>
                </div>
            `;
			container.appendChild(userElement);
		});
	}

	// Функция для обновления элементов пагинации
	// Функция для обновления элементов пагинации
	function updatePaginationReserveModal() {
		// Измененный селектор для поиска контейнера пагинации в модальном окне reserveModal
		const paginationContainer = document.querySelector(
			"#reserveModal .pagination-controls .pagination"
		);
		if (paginationContainer) {
			// Очистка существующих элементов пагинации
			paginationContainer.innerHTML = "";

			// Здесь ваш код для добавления новых элементов пагинации
			// Например:
			const totalPages = Math.ceil(
				currentEntriesReserveModal.length / entriesPerPageReserveModal
			);
			for (let i = 1; i <= totalPages; i++) {
				const pageItem = document.createElement("li");
				pageItem.className = `page-item ${
					i === currentPageReserveModal ? "active" : ""
				}`;
				pageItem.innerHTML = `<a class="page-link" href="#" data-page="${i}">${i}</a>`;
				pageItem.addEventListener("click", function (e) {
					e.preventDefault();
					currentPageReserveModal = parseInt(e.target.dataset.page);
					renderUsers();
					updatePaginationReserveModal();
				});
				paginationContainer.appendChild(pageItem);
			}
		} else {
			console.error("Pagination container not found in reserveModal");
		}
	}

	// Функция для фильтрации пользователей по запросу из поля ввода
	function filterUsersReserveModal(query) {
		currentEntriesReserveModal = (
			currentCategoryReserveModal === "enseignants"
				? enseignants
				: etudiants
		).filter(
			(user) =>
				user.nom.toLowerCase().includes(query.toLowerCase()) ||
				user.prenom.toLowerCase().includes(query.toLowerCase())
		);
		currentPageReserveModal = 1;
		renderUsers();
		updatePaginationReserveModal();
	}

	// Обработка ввода в поле поиска
	document
		.getElementById("searchUser")
		.addEventListener("input", function (e) {
			filterUsersReserveModal(e.target.value);
		});

	// Обработчики для переключения категорий
	document
		.getElementById("v-pills-enseignants-tab")
		.addEventListener("click", function () {
			currentCategoryReserveModal = "enseignants";
			filterUsersReserveModal(
				document.getElementById("searchUser").value
			);
		});

	document
		.getElementById("v-pills-etudiants-tab")
		.addEventListener("click", function () {
			currentCategoryReserveModal = "etudiants";
			filterUsersReserveModal(
				document.getElementById("searchUser").value
			);
		});

	// Инициализация списка преподавателей по умолчанию
	filterUsersReserveModal("");

	//////////////сортировка///////////////

	/////////////фильтрация Gestion de l'Équipement ////////

	document
		.getElementById("apply-filters")
		.addEventListener("click", function () {
			applyFilters();
			hideSortIcons();
		});

	function applyFilters() {
		const categoryFilter = document.getElementById("category-filter").value;
		const availabilityFilter = document.getElementById(
			"availability-filter"
		).value;
		const rows = document.querySelectorAll("#equipment-table tbody tr");

		rows.forEach((row) => {
			const category = row
				.querySelector(".equipment-category")
				.textContent.trim()
				.toLowerCase();
			const availability = row
				.querySelector(".equipment-availability")
				.textContent.trim()
				.toLowerCase();

			let categoryMatch =
				categoryFilter === "" ||
				category.includes(categoryFilter.toLowerCase());
			let availabilityMatch =
				availabilityFilter === "" ||
				availability.includes(availabilityFilter.toLowerCase());

			if (categoryMatch && availabilityMatch) {
				row.style.display = "";
			} else {
				row.style.display = "none";
			}
		});
	}

	function hideSortIcons() {
		const sortIcons = document.querySelectorAll(
			"#equipment-table thead th i"
		);
		sortIcons.forEach((icon) => {
			icon.style.visibility = "hidden";
		});
	}

	function toggleSortDirection() {
		sortState.direction = sortState.direction === "asc" ? "desc" : "asc";
		// Скрыть иконки сортировки при каждом изменении направления сортировки
		hideSortIcons();
	}

	// Объект состояния для управления текущим состоянием сортировки и фильтрации
	let sortState = {
		field: null,
		direction: "asc",
	};

	// Функция сортировки
	function applySort(rows) {
		// Фильтруем строки, исключая скрытые
		rows = rows.filter((row) => row.style.display !== "none");

		return rows.sort((rowA, rowB) => {
			const valueA = getSortValue(rowA, sortState.field);
			const valueB = getSortValue(rowB, sortState.field);

			if (!isNaN(parseFloat(valueA)) && !isNaN(parseFloat(valueB))) {
				return sortState.direction === "asc"
					? valueA - valueB
					: valueB - valueA;
			} else {
				return sortState.direction === "asc"
					? valueA.localeCompare(valueB)
					: valueB.localeCompare(valueA);
			}
		});
	}

	// Функция для извлечения значения для сортировки из строки таблицы
	function getSortValue(row, field) {
		switch (field) {
			case "id":
				return Number(row.dataset.equipmentId);
			case "name":
				return row
					.querySelector(".equipment-name")
					.textContent.trim()
					.toLowerCase();
			case "category":
				return row
					.querySelector(".equipment-category")
					.textContent.trim()
					.toLowerCase();
			case "status":
				return row
					.querySelector(".equipment-availability")
					.textContent.trim()
					.toLowerCase();
			default:
				return "";
		}
	}

	// Функция для обновления отображения оборудования с учетом сортировки
	function updateEquipmentDisplay() {
		const tableBody = document.querySelector("#equipment-table tbody");
		const rows = Array.from(tableBody.querySelectorAll("tr"));

		// Применяем сортировку только к видимым строкам
		const visibleRows = rows.filter((row) => row.style.display !== "none");
		const sortedRows = applySort(visibleRows);

		// Убираем все строки и добавляем их обратно в порядке сортировки
		rows.forEach((row) => row.remove());
		sortedRows.forEach((row) => {
			tableBody.appendChild(row);
		});
	}

	// Добавление обработчиков событий для элементов управления сортировкой
	document.getElementById("sortById").addEventListener("click", () => {
		sortState.field = "id";
		toggleSortDirection();
		updateEquipmentDisplay();
	});

	document.getElementById("sortByName").addEventListener("click", () => {
		sortState.field = "name";
		toggleSortDirection();
		updateEquipmentDisplay();
	});

	document.getElementById("sortByCategory").addEventListener("click", () => {
		sortState.field = "category";
		toggleSortDirection();
		updateEquipmentDisplay();
	});

	document.getElementById("sortByStatus").addEventListener("click", () => {
		sortState.field = "status";
		toggleSortDirection();
		updateEquipmentDisplay();
	});

	// Функция для переключения направления сортировки
	function toggleSortDirection() {
		sortState.direction = sortState.direction === "asc" ? "desc" : "asc";
	}
});
