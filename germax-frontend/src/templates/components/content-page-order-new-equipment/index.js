import "./index.css";
// Confirmer la réception; marqué comme reçu как подстраховка (а так, будет автоматически делаться)
import Modal from "bootstrap/js/dist/modal";

document.addEventListener("DOMContentLoaded", function () {
	updateEquipmentRequestsTable();
	const authToken = localStorage.getItem("authToken");
	console.log("Auth token:", authToken);

	if (authToken) {
		fetchAuthUser("http://germax-api/auth/me");
	}

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
		const addCategoryModalElement = document.getElementById("addCategoryModal");
		const addCategoryModal = new Modal(addCategoryModalElement);

		addCategoryButton.addEventListener("click", function () {
			alert("Catégorie ajoutée avec succès!");
			addCategoryModal.hide();
		});
	}
});

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
	const description = document.getElementById("equipmentDescription").value;
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

function fetchAuthUser(url) {
	const token = JSON.parse(localStorage.getItem("authToken"));
	const id_user = JSON.parse(localStorage.getItem("id_user"));

	if (!token) {
		console.error("No token found, please login first");
		return;
	}

	fetch(url, {
		method: "GET",
		headers: {
			token: token,
			"Content-Type": "application/json",
		},
	})
		.then((response) => {
			console.log("HTTP Status:", response.status);
			const json = response.json();
			if (!response.ok) return Promise.reject(json);
			console.log("Data received:", json);
			return json;
		})
		.then((data) => {
			console.log("data:", data);
			renderEquipmentOrder(data.data);
		})
		.catch((error) => {
			console.error("Failed to fetch data:", error);
		});
}

// отрисовка заказа оборудования только для stockman

function renderEquipmentOrder(userData) {
	const titleAddingOrders = document.getElementById("titleAddingOrders");
	const addingEquipmentContainer = document.getElementById(
		"equipmentAddingContainer"
	);
	const titleOrdersRequest = document.getElementById("titleOrdersRequest");
	const orderEquipmentContainer = document.getElementById("orderForm");
	const titleOrders = document.getElementById("titleOrders");
	const listOrdersTitle = document.getElementById("listOrdersTitle");

	//stockman
	titleAddingOrders.innerHTML = "";
	addingEquipmentContainer.innerHTML = "";
	titleOrdersRequest.innerHTML = "";
	//manager
	orderEquipmentContainer.innerHTML = "";
	titleOrders.innerHTML = ``;
	listOrdersTitle.innerHTML = ``;

	if (userData.name_permission === "stockman") {
		const titleAddingOrdersMarkup = `<h2>Ajout du nouvel équipement</h2>`;
		const markup = `
					<div class="mb-4">
							<button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#addEquipmentModal">Ajouter un équipement</button>
							<button class="btn btn-secondary" data-bs-toggle="modal" data-bs-target="#addCategoryModal">Ajouter une catégorie</button>
					</div>
			`;
		const titleOrdersRequestMarkup = `<h2>Requêtes du nouvel équipement</h2>`;
		titleAddingOrders.innerHTML = titleAddingOrdersMarkup;
		addingEquipmentContainer.innerHTML = markup;
		titleOrdersRequest.innerHTML = titleOrdersRequestMarkup;
	} else if (userData.name_permission === "rental-manager") {
		const titleOrdersMarkup = `<h2>Nouvelle commande d'équipement</h2>`;
		const markup = `
		<div class="order-form mb-4">
    <form id="equipmentRequestForm">
        <div class="form-group">
            <label for="equipmentName">Nom de l'équipement</label>
            <input type="text" class="form-control" id="equipmentName" placeholder="Entrez le nom de l'équipement">
        </div>
        <div class="form-group">
            <label for="categoryName">Catégorie</label>
            <select class="form-control" id="categoryName">
                <option value="1">Laptop</option>
                <option value="2">Computer Monitor</option>
                <option value="3">Smartphone</option>
                <option value="4">Accessory</option>
                <option value="5">Tablet</option>
                <option value="6">VR Headset</option>
                <!-- Динамическое заполнение категорий должно быть реализовано здесь -->
            </select>
        </div>
        <div class="form-group">
            <label for="quantity">Quantité</label>
            <input type="number" class="form-control" id="quantity" placeholder="1">
        </div>
        <div class="form-group">
            <label for="equipmentDescription">Commentaire</label>
            <textarea class="form-control" id="equipmentDescription" rows="3"></textarea>
        </div>
        <button type="submit" class="btn btn-primary form-control mt-3" id="equipmentRequestForm">Faire une requête</button>
    </form>
</div>

		`;
		const listOrdersTitleMarkup = `<h2>Liste des commandes</h2>`;

		orderEquipmentContainer.innerHTML = markup;
		titleOrders.innerHTML = titleOrdersMarkup;
		listOrdersTitle.innerHTML = listOrdersTitleMarkup;
	}

	const id_user = JSON.parse(localStorage.getItem("id_user"));
	// отправка на equipment_requests
	document.getElementById('equipmentRequestForm').addEventListener('submit', function(event) {
		event.preventDefault(); // Предотвратить стандартное поведение формы

		// Собираем данные формы
		const equipmentName = document.getElementById('equipmentName').value;
		const quantity = document.getElementById('quantity').value;
		const comment = document.getElementById('equipmentDescription').value;
		const id_type = document.getElementById('categoryName').value;

		// Создаем объект с данными для отправки на сервер
		const requestData = {
				equipment_name: equipmentName,
				quantity: parseInt(quantity, 10),
				comment: comment,
				id_type,
				id_user,
		};

		// Отправляем запрос на сервер
		fetch('http://germax-api/equipment_requests', {
				method: 'POST',
				headers: {
						'Content-Type': 'application/json',
				},
				body: JSON.stringify(requestData)
		})
		.then(response => response.json())
		.then(data => {
				console.log('Success:', data);
				alert('Запрос на оборудование успешно отправлен!');
				updateEquipmentRequestsTable();
		})
		.catch((error) => {
				console.error('Error:', error);
				alert('Ошибка при отправке запроса на оборудование');
		});
	});
}

// обновление таблицы данными

function updateEquipmentRequestsTable() {
	fetch('http://germax-api/equipment_requests', {
			method: 'GET',
			headers: {
					'Content-Type': 'application/json',
			}
	})
	.then(response => response.json())
	.then(data => {
			console.log(data);  // Проверяем структуру полученных данных
			const tableBody = document.querySelector('.table tbody');
			tableBody.innerHTML = ''; // Очистить текущее содержимое таблицы

			if (data.success && Array.isArray(data.data)) { // Проверка на успешный ответ и что data.data действительно массив
					data.data.forEach(request => {
							const row = `
									<tr>
											<td>${request.id_request}</td>
											<td>${request.equipment_name}</td>
											<td>${request.quantity}</td>
											<td>${request.request_date}</td>
											<td>${request.status}</td>
											<td>${request.response_date || 'Statut à décider'}</td>
											<td>
													<div class="dropdown">
															<button class="btn btn-secondary dropdown-toggle" type="button"
																	id="dropdownMenuButton${request.id_request}" data-bs-toggle="dropdown" aria-expanded="false">
																	Choisir une action
															</button>
															<ul class="dropdown-menu" aria-labelledby="dropdownMenuButton${request.id_request}">
																	<li><a class="dropdown-item" href="#">Confirmer la réception</a></li>
																	<li><a class="dropdown-item" href="#">Annuler la commande</a></li>
																	<li><a class="dropdown-item" href="#">Marquer comme livré</a></li>
																	<li><a class="dropdown-item" href="#" data-bs-toggle="modal"
																			data-bs-target="#detailsModal">Voir les détails</a></li>
															</ul>
													</div>
											</td>
									</tr>
							`;
							tableBody.innerHTML += row;
					});
			} else {
					console.error('No data found or data is not an array:', data);
					alert('No data found or data format error.');
			}
	})
	.catch(error => {
			console.error('Failed to fetch equipment requests:', error);
			alert('Error fetching equipment requests.');
	});
}


// затем у stockman надо проверить через запрос есть ли нужное оборудование и если нет предложить другое похожее, если нет ничего похожего то просто статус-нет
