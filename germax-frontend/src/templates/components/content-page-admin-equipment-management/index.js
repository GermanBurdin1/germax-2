import "./index.css";
import Modal from "bootstrap/js/dist/modal";
import Dropdown from "bootstrap/js/dist/dropdown";

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
					case "Éditer":
						alert(`Éditer: ${equipmentId}`);
						break;
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
});
