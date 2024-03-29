import "./index.css";
import Modal from "bootstrap/js/dist/modal";
import Dropdown from "bootstrap/js/dist/dropdown";
import { Tab } from 'bootstrap';

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
	dropdowns.forEach((dropdown) => {
		dropdown.addEventListener("mouseenter", (e) => {
			let dropdownToggle = dropdown.querySelector(
				'[data-bs-toggle="dropdown"]'
			);
			if (dropdownToggle) {
				let bsDropdown = new Dropdown(dropdownToggle);
				bsDropdown.show();
			}
		});

		dropdown.addEventListener("mouseleave", (e) => {
			let dropdownToggle = dropdown.querySelector(
				'[data-bs-toggle="dropdown"]'
			);
			if (dropdownToggle) {
				let bsDropdown = Dropdown.getInstance(dropdownToggle);
				if (bsDropdown) {
					bsDropdown.hide();
				}
			}
		});
	});

	// edit-action

	document.querySelectorAll(".edit-action").forEach((item) => {
		item.addEventListener("click", function (event) {
			event.preventDefault();
			const row = this.closest("tr");
			row.classList.add("editing");

			// Скрываем span и делаем видимыми поля ввода и select
			row.querySelectorAll("td span").forEach((element) => {
				element.classList.add("d-none");
			});
			row.querySelectorAll("td input, td textarea, td select").forEach(
				(element) => {
					element.classList.remove("d-none");
					if (
						element.tagName === "INPUT" ||
						element.tagName === "TEXTAREA"
					) {
						// Присваиваем input и textarea значение предыдущего span
						element.value = element.previousElementSibling
							? element.previousElementSibling.textContent.trim()
							: "";
					}
				}
			);

			// Для select элементов, загружаем и устанавливаем текущее значение из данных оборудования
			const equipmentId = row.dataset.equipmentId;
			const data = JSON.parse(
				localStorage.getItem(`equipment_${equipmentId}`) || "{}"
			);

			const categorySelect = row.querySelector(
				"select[name='equipment-category']"
			);
			const availabilitySelect = row.querySelector(
				"select[name='equipment-availability']"
			);
			if (categorySelect) {
				categorySelect.value = data.category || ""; // Устанавливаем значение или пустую строку, если данных нет
			}
			if (availabilitySelect) {
				availabilitySelect.value = data.availability || ""; // То же самое для доступности
			}

			// Добавляем или обновляем кнопки "Сохранить изменения" и "Отменить изменения", если они не были добавлены
			if (!row.querySelector(".save-changes")) {
				const saveButton = document.createElement("button");
				saveButton.textContent = "Sauvegarder les changements";
				saveButton.classList.add("btn", "btn-primary", "save-changes");
				row.querySelector("td:last-child").appendChild(saveButton);
			}
			if (!row.querySelector(".cancel-changes")) {
				const cancelButton = document.createElement("button");
				cancelButton.textContent = "Annuler les changements";
				cancelButton.classList.add(
					"btn",
					"btn-secondary",
					"cancel-changes"
				);
				row.querySelector("td:last-child").appendChild(cancelButton);
			}
		});
	});

	document.addEventListener("click", function (event) {
		const target = event.target;

		if (target.classList.contains("save-changes")) {
			const row = target.closest("tr");
			const equipmentId = row.dataset.equipmentId;
			// Извлечение данных
			const nameInput = row.querySelector("input[name='equipment-name']");
			const categorySelect = row.querySelector(
				"select[name='equipment-category']"
			);
			const descriptionTextarea = row.querySelector(
				"textarea[name='equipment-description']"
			);
			const availabilitySelect = row.querySelector(
				"select[name='equipment-availability']"
			);

			if (nameInput && row.querySelector(".equipment-name")) {
				row.querySelector(".equipment-name").textContent =
					nameInput.value;
			}
			if (categorySelect && row.querySelector(".equipment-category")) {
				row.querySelector(".equipment-category").textContent =
					categorySelect.options[categorySelect.selectedIndex].text;
			}
			if (
				descriptionTextarea &&
				row.querySelector(".equipment-description")
			) {
				row.querySelector(".equipment-description").textContent =
					descriptionTextarea.value;
			}
			if (
				availabilitySelect &&
				row.querySelector(".equipment-availability")
			) {
				row.querySelector(".equipment-availability").textContent =
					availabilitySelect.options[
						availabilitySelect.selectedIndex
					].text;
			}

			// Сохраняем изменения в localStorage
			const data = {
				name: nameInput.value,
				category: categorySelect.value,
				description: descriptionTextarea.value,
				availability: availabilitySelect.value,
			};
			localStorage.setItem(
				`equipment_${equipmentId}`,
				JSON.stringify(data)
			);

			// Возвращаем элементы <span> к видимости и скрываем поля ввода
			row.querySelectorAll("td span").forEach((element) => {
				element.classList.remove("d-none");
			});
			row.querySelectorAll("td input, td textarea, td select").forEach(
				(element) => {
					element.classList.add("d-none");
				}
			);

			// Удаление кнопок "Sauvegarder les changements" и "Annuler les changements"
			row.querySelectorAll(".save-changes, .cancel-changes").forEach(
				(button) => {
					button.remove();
				}
			);

			row.classList.remove("editing");
		} else if (target.classList.contains("cancel-changes")) {
			const row = target.closest("tr");

			// Возвращаем элементы <span> к видимости и скрываем поля ввода без сохранения изменений
			row.querySelectorAll("td span").forEach((element) => {
				element.classList.remove("d-none");
			});
			row.querySelectorAll("td input, td textarea, td select").forEach(
				(element) => {
					element.classList.add("d-none");
				}
			);

			// Удаление кнопок "Sauvegarder les changements" и "Annuler les changements"
			row.querySelectorAll(".save-changes, .cancel-changes").forEach(
				(button) => {
					button.remove();
				}
			);

			row.classList.remove("editing");
		}
	});

	// Загрузка данных из localStorage при загрузке страницы
	window.addEventListener("load", () => {
		console.log('Before updating DOM for equipment');
		document.querySelectorAll("[data-equipment-id]").forEach((row) => {
			const equipmentId = row.dataset.equipmentId;
			const data = JSON.parse(
				localStorage.getItem(`equipment_${equipmentId}`)
			);
			console.log(data);
			if (data) {
				if (row.querySelector(".equipment-name")) {
					row.querySelector(".equipment-name").textContent = data.name;
				}
				if (row.querySelector(".equipment-category")) {
					row.querySelector(".equipment-category").textContent = data.category;
				}
				if (row.querySelector(".equipment-description")) {
					row.querySelector(".equipment-description").textContent = data.description;
				}
				if (row.querySelector(".equipment-availability")) {
					row.querySelector(".equipment-availability").textContent = data.availability;
				}
				console.log('After updating DOM for equipment', equipmentId);
			}
		});
	});

	document.addEventListener('click', function (event) {
		if (event.target.classList.contains('delete-action')) {
			event.preventDefault();

			const row = event.target.closest('tr');
			const equipmentId = row.dataset.equipmentId;

			localStorage.removeItem(`equipment_${equipmentId}`);

			row.remove();
		}
	});

	document.addEventListener('DOMContentLoaded', function () {
		const triggerTabList = [].slice.call(document.querySelectorAll('#reserveModal .nav-link'));
		triggerTabList.forEach(function (triggerEl) {
			var tabTrigger = new Tab(triggerEl);

			triggerEl.addEventListener('click', function (e) {
				e.preventDefault();
				tabTrigger.show();
			});
		});
	});


	//Journal des actions

	const actionLog = [
        { date: "14/04/2021", user: "Utilisateur A", action: "Prêté" },
        { date: "07/06/2021", user: "Utilisateur B", action: "Retourné et vérifié" },
        // Добавьте дополнительные записи здесь
    ];

    let currentPage = 1;
    const entriesPerPage = 10; // Количество записей на страницу

    function renderLog(entries) {
        const logContainer = document.getElementById("actionLogEntries");
        logContainer.innerHTML = ""; // Очистить текущие записи
        entries.forEach(entry => {
            const div = document.createElement("div");
            div.textContent = `${entry.date} - ${entry.user} - ${entry.action}`;
            logContainer.appendChild(div);
        });
    }

    function updatePagination() {
        // Обновление видимости кнопок пагинации и номера текущей страницы
        document.getElementById("currentPage").textContent = currentPage.toString();
    }

    function filterAndRender() {
        let filteredEntries = actionLog
            .filter(entry => entry.user.toLowerCase().includes(document.getElementById("searchByName").value.toLowerCase()))
            .sort((a, b) => new Date(b.date.split("/").reverse().join("-")) - new Date(a.date.split("/").reverse().join("-"))); // Сортировка по дате

        const start = (currentPage - 1) * entriesPerPage;
        const paginatedEntries = filteredEntries.slice(start, start + entriesPerPage);
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
		const csvRows = actionLog.map(entry =>
			`"${entry.date}","${entry.user}","${entry.action}"`
		).join("\n");

		// Создание строки CSV с BOM для UTF-8
		const BOM = "\uFEFF";
		const csvString = BOM + csvHeaders + csvRows;

		// Создание Blob объекта с типом MIME для CSV и указанием кодировки UTF-8
		const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });

		// Создание временной ссылки для скачивания и её нажатие
		const link = document.createElement("a");
		if (link.download !== undefined) { // Проверка поддержки атрибута download
			const url = URL.createObjectURL(blob);
			link.setAttribute("href", url);
			link.setAttribute("download", "actionLog.csv");
			link.style.visibility = 'hidden';
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
		}
	}

	// Добавляем слушатель события на кнопку экспорта
	document.getElementById("exportLog").addEventListener("click", function() {
		exportToCSV(actionLog); // Предполагается, что actionLog - это ваш массив данных журнала
	});

});
