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
