import "./index.css";
// Confirmer la réception; marqué comme reçu как подстраховка (а так, будет автоматически делаться)
import Modal from "bootstrap/js/dist/modal";
import Dropdown from "bootstrap/js/dist/dropdown";
import { formDataToObject } from "../../../utils/form-data-to-object";
import { ApiAuth } from "../../../utils/classes/api-auth";
import { ApiEquipmentRequest } from "../../../utils/classes/api-equipment-request";

const apiEquipmentRequest = new ApiEquipmentRequest();

const id_user = JSON.parse(localStorage.getItem("id_user"));

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
			console.log("namePermission", data.data.name_permission);
			renderEquipmentOrder(data.data);
			localStorage.setItem("namePermission", data.data.name_permission); // Сохраняем роль пользователя
			updateEquipmentRequestsTable(data.data.name_permission);
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
		const listOrdersTitleMarkup = `<h2>Gestion des demandes de nouvelles réservations</h2>`;

		orderEquipmentContainer.innerHTML = markup;
		titleOrders.innerHTML = titleOrdersMarkup;
		listOrdersTitle.innerHTML = listOrdersTitleMarkup;
		// отправка на equipment_requests
		document
			.getElementById("equipmentRequestForm")
			.addEventListener("submit", function (event) {
				event.preventDefault(); // Предотвратить стандартное поведение формы

				// Собираем данные формы
				const equipmentName = document.getElementById("equipmentName").value;
				const quantity = document.getElementById("quantity").value;
				const comment = document.getElementById("equipmentDescription").value;
				const id_type = document.getElementById("categoryName").value;

				// Создаем объект с данными для отправки на сервер
				const requestData = {
					equipment_name: equipmentName,
					quantity: parseInt(quantity, 10),
					comment: comment,
					id_type,
					id_user,
				};

				// Отправляем запрос на сервер
				fetch("http://germax-api/equipment_requests", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(requestData),
				})
					.then((response) => response.json())
					.then((data) => {
						console.log("Success:", data);
						alert("Запрос на оборудование успешно отправлен!");
						updateEquipmentRequestsTable();
					})
					.catch((error) => {
						console.error("Error:", error);
						alert("Ошибка при отправке запроса на оборудование");
					});
			});
	}
}
// обновление таблицы данными

function updateEquipmentRequestsTable(namePermission) {
	apiEquipmentRequest
		.getAllRequests()
		.then((data) => {
			const tableBody = document.querySelector(".table tbody");
			tableBody.innerHTML = ""; // Очистить текущее содержимое таблицы

			if (data.success && Array.isArray(data.data)) {
				data.data.forEach((request) => {
					const row = createTableRow(request, namePermission);
					tableBody.innerHTML += row;
				});
			} else {
				console.error("No data found or data is not an array:", data);
				alert("No data found or data format error.");
			}
		})
		.catch((error) => {
			console.error("Failed to fetch equipment requests:", error);
			alert("Error fetching equipment requests.");
		});
}

function createTableRow(request, namePermission) {
	let actionsMarkup = "";

	if (namePermission === "rental-manager") {
		if (request.treatment_status === "pending_manager") {
			actionsMarkup = `
			<li><a class="dropdown-item edit-request" href="#" data-id="${request.id_request}">Modifier et soumettre pour approbation</a></li>
			<li><a class="dropdown-item confirm-approval" href="#" data-id="${request.id_request}">Confirmer l'approbation</a></li>
			`;
		}
		else if (request.treatment_status === "treated_manager_user") {
			actionsMarkup = `
			<li><a class="dropdown-item send-to-stockman" href="#" data-id="${request.id_request}" data-bs-toggle="modal" data-bs-target="#stockmanApprovalModal">Отправить на согласование с кладовщиком</a></li>
			`;
		}
		else {
			actionsMarkup = `
			<li><a class="dropdown-item" href="#" data-bs-toggle="modal" data-bs-target="#request--communication-manager-modal">Contacter le manager</a></li>
			<li><a class="dropdown-item" href="#" data-bs-toggle="modal" data-bs-target="#request--communication-manager-modal">Contacter le user</a></li>
			`;
		}
	} else if (namePermission === "stockman") {
		actionsMarkup = `
					<li><a class="dropdown-item check-availability" href="#">Vérifier la disponibilité</a></li>
					<li><a class="dropdown-item" href="#">Programmer l'envoi</a></li>
					<li><a class="dropdown-item" href="#">Annuler l'envoi</a></li>
					<li><a class="dropdown-item" href="#">Marquer comme envoyé</a></li>
					<li><a class="dropdown-item" href="#">Marquer comme délivré</a></li>
			`;
	}

	return `
			<tr data-id="${request.id_request}">
					<td>${request.id_request}</td>
					<td data-equipment-name>${request.equipment_name}</td>
					<td>${request.quantity}</td>
					<td>${request.request_date}</td>
					<td>${request.date_start}</td>
					<td>${request.date_end}</td>
					<td>${request.treatment_status}</td>
					<td>${request.equipment_status}</td>
					<td>
							<div class="dropdown">
									<button class="btn btn-secondary dropdown-toggle" type="button"
											id="dropdownMenuButton${request.id_request}" data-bs-toggle="dropdown" aria-expanded="false">
											Choisir une action
									</button>
									<ul class="dropdown-menu" aria-labelledby="dropdownMenuButton${request.id_request}">
											${actionsMarkup}
									</ul>
							</div>
					</td>
			</tr>
	`;
}


//vérifier la disponibilité
//модальное окно

function setupAvailabilityModal() {
	const availabilityModal = new Modal(
		document.getElementById("availabilityModal")
	);

	document
		.querySelector(".table tbody")
		.addEventListener("click", function (e) {
			// Проверяем, что клик был по элементу с классом 'check-availability'
			if (e.target.classList.contains("check-availability")) {
				e.preventDefault();
				const equipmentName = e.target
					.closest("tr")
					.querySelector("td[data-equipment-name]").textContent;
				document.getElementById("equipmentInput").value = equipmentName;
				availabilityModal.show();
			}
		});

	// Обработчик событий для формы отправки запроса на проверку доступности
	document
		.getElementById("checkAvailabilityForm")
		.addEventListener("submit", function (e) {
			e.preventDefault();
			const equipmentName = document.getElementById("equipmentInput").value;
			console.log("Checking availability for:", equipmentName);
			// Тут код для отправки запроса на сервер и обработки ответа
		});
}

setupAvailabilityModal();

// обновление статуса единицы оборудования
const editModal = new Modal(document.getElementById("editModal"));
const confirmationModal = new Modal(document.getElementById("confirmationModal"));
const namePermission = "rental-manager"; // Замените на реальное значение
updateEquipmentRequestsTable(namePermission);

document.querySelector(".table").addEventListener("click", (event) => {
  if (event.target.classList.contains("edit-request")) {
    event.preventDefault();
    const requestId = event.target.getAttribute("data-id");
    openEditModal(requestId);
  } else if (event.target.classList.contains("confirm-approval")) {
    event.preventDefault();
    const requestId = event.target.getAttribute("data-id");
    openConfirmationModal(requestId);
  }
});

function openEditModal(requestId) {
	const row = document.querySelector(`tr[data-id="${requestId}"]`);
	const equipmentName = row.querySelector("[data-equipment-name]").textContent;
	const quantity = row.children[2].textContent;
	const dateStart = row.children[3].textContent;
	const dateEnd = row.children[4].textContent;
	const comment = row.children[5].textContent;

	document.getElementById("editRequestId").value = requestId;
	document.getElementById("editEquipmentName").value = equipmentName;
	document.getElementById("editQuantity").value = quantity;
	document.getElementById("editDateStart").value = dateStart;
	document.getElementById("editDateEnd").value = dateEnd;
	document.getElementById("editComment").value = comment;

	editModal.show();
}

document
	.getElementById("editForm")
	.addEventListener("submit", function (event) {
		event.preventDefault();

		const requestId = document.getElementById("editRequestId").value;
		const equipmentName = document.getElementById("editEquipmentName").value;
		const quantity = document.getElementById("editQuantity").value;
		const dateStart = document.getElementById("editDateStart").value;
		const dateEnd = document.getElementById("editDateEnd").value;
		const comment = document.getElementById("editComment").value;

		const updatedData = {
			id_request: requestId,
			equipment_name: equipmentName,
			quantity: quantity,
			date_start: dateStart,
			date_end: dateEnd,
			comment: comment,
		};

		apiEquipmentRequest
			.updateEquipmentRequest(updatedData)
			.then((data) => {
				updateTableRow(requestId, data);
				alert("Les données ont bien été renouvelés!")
				editModal.hide();
			})
			.catch((error) => {
				console.error("Error updating request:", error);
				alert("Error updating request.");
			});
	});

function updateTableRow(requestId, updatedData) {
	const row = document.querySelector(`tr[data-id="${requestId}"]`);

	if (row) {
		row.querySelector("[data-equipment-name]").textContent =
			updatedData.equipment_name;
		row.children[2].textContent = updatedData.quantity;
		row.children[3].textContent = updatedData.date_start;
		row.children[4].textContent = updatedData.date_end;
		row.children[5].textContent = updatedData.comment;
	}
}

function openConfirmationModal(requestId) {
  document.getElementById("confirmApprovalButton").setAttribute("data-id", requestId);
  confirmationModal.show();
}

function sendUpdatedDataToUser(requestId) {
  const row = document.querySelector(`tr[data-id="${requestId}"]`);
  // Здесь можно добавить логику для отправки данных на сервер для согласования

  // Пример логики отправки данных на сервер:
  const approvalData = {
    id_request: requestId,
    // Добавьте дополнительные данные, если необходимо
  };

  apiEquipmentRequest.sendUpdatedDataToUser(approvalData)
    .then((data) => {
      alert("Данные успешно подтверждены и отправлены на согласование!");
      // Обновите статус строки или выполните другие действия
      updateTableRowStatus(requestId, "rental_details_discussion_manager_user");
    })
    .catch((error) => {
      console.error("Ошибка при отправке данных на согласование:", error);
      alert("Ошибка при отправке данных на согласование.");
    });
}

document.getElementById("confirmApprovalButton").addEventListener("click", function() {
  const requestId = this.getAttribute("data-id");
  sendUpdatedDataToUser(requestId);
  confirmationModal.hide();
});

function updateTableRowStatus(requestId, status) {
  const row = document.querySelector(`tr[data-id="${requestId}"]`);

  if (row) {
    row.children[6].textContent = status; // Предполагается, что статус находится в 7-м столбце (индекс 6)
  }}
