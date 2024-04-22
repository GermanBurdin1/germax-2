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



// page-admin-reservation-management/

function fetchData() {
		const selectedUsers = Array.from(filterUser.selectedOptions)
		.map((option) => option.value)
		.join(",");
	const selectedEquipments = Array.from(filterEquipment.selectedOptions)
		.map((option) => option.value)
		.join(",");
	const selectedStatuses = Array.from(filterStatus.selectedOptions)
		.map((option) => option.value)
		.join(",");

	// Пример URL, который может быть использован для запроса к серверу
	// Необходимо адаптировать URL и параметры в соответствии с вашим API
	const url = `/api/reservations?users=${selectedUsers}&equipments=${selectedEquipments}&status=${selectedStatuses}`;

	fetch(url)
		.then((response) => response.json())
		.then((data) => updateTable(data))
		.catch((error) => console.error("Error fetching data:", error));
}


function updateTable(data) {
	const tbody = document.querySelector("#reservationsTable tbody");
	tbody.innerHTML = ""; // Очищаем текущее содержимое таблицы

	// Создаем новые строки таблицы на основе полученных данных
	data.forEach((rowData) => {
		const tr = document.createElement("tr");
		tr.innerHTML = `
			<td>${rowData.id}</td>
			<td>${rowData.user}</td>
			<td>${rowData.equipment}</td>
			<td>${rowData.startDate}</td>
			<td>${rowData.endDate}</td>
			<td>${rowData.status}</td>
			<td><button class="btn btn-primary">Détails</button></td>
		`;
		tbody.appendChild(tr);
	});
}


[filterUser, filterEquipment, filterStatus].forEach((filter) => {
	filter.addEventListener("change", fetchData);
});
