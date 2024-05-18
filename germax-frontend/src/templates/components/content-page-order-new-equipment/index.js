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
	const authToken = localStorage.getItem("authToken");
	const namePermission = localStorage.getItem("namePermission");
	updateEquipmentRequestsTable(namePermission);
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
			console.log(data);
			const tableBody = document.querySelector(".table tbody");
			tableBody.innerHTML = ""; // Очистить текущее содержимое таблицы

			if (data.success && Array.isArray(data.data)) {
				data.data.forEach((request) => {
					console.log("Processing request:", request);
					if (
						namePermission !== "stockman" ||
						isStatusVisibleForStockman(request.treatment_status)
					) {
						if (
							namePermission === "stockman" &&
							request.treatment_status === "closed_by_stockman" &&
							request.equipment_status === "received"
						) {
							request.treatment_status = "demande fermée";
							request.equipment_status = "délivré";
						}

						console.log("Modified request for stockman:", request);

						const row = createTableRow(request, namePermission);
						tableBody.innerHTML += row;
					}
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

function isStatusVisibleForStockman(status) {
	const visibleStatuses = [
		"pending_stockman",
		"closed_by_user",
		"rental_details_discussion_manager_stockman",
		"treated_manager_stockman",
		"sent_awaiting",
		"treated_rental_manager_stockman",
		"closed_by_stockman",
		"rental_details_discussion_manager_stockman_queue",
		"treated_manager_user_before_sending",
		"demande_fermée",
	];
	return visibleStatuses.includes(status);
}

function createTableRow(request, namePermission) {
	let actionsMarkup = "";

	// Преобразование статусов для кладовщика
	let treatmentStatus = request.treatment_status;
	let equipmentStatus = request.equipment_status;

	if (namePermission === "stockman") {
		if (
			request.treatment_status === "closed_by_stockman" &&
			request.equipment_status === "received"
		) {
			treatmentStatus = "demande fermée";
			equipmentStatus = "délivré";
		}
	}

	if (namePermission === "rental-manager") {
		if (request.treatment_status === "pending_manager") {
			actionsMarkup = `
			<li><a class="dropdown-item edit-request" href="#" data-id="${request.id_request}">Modifier et soumettre pour approbation</a></li>
			<li><a class="dropdown-item confirm-approval" href="#" data-id="${request.id_request}">Confirmer l'approbation</a></li>
			`;
		} else if (request.treatment_status === "treated_manager_user") {
			actionsMarkup = `
			<li><a class="dropdown-item send-to-stockman" href="#" data-id="${request.id_request}" data-bs-toggle="modal" data-bs-target="#stockmanApprovalModal">Envoyer pour approbation avec le magasinier</a></li>
			`;
		} else if (
			request.treatment_status === "rental_details_discussion_manager_stockman"
		) {
			actionsMarkup = `
			<li><a class="dropdown-item confirm-sending-item" href="#" data-id="${request.id_request}" data-bs-toggle="modal" data-bs-target="#confirmSendingModal">confirmer l'envoi</a></li>
			`;
		} else if (request.treatment_status === "treated_rental_manager_stockman") {
			actionsMarkup = `
			<li><a class="dropdown-item confirm-receiving-item" href="#" data-id="${request.id_request}" data-bs-toggle="modal" data-bs-target="#confirmReceivingModal">confirmer la réception</a></li>
			`;
		} else if (request.treatment_status === "received") {
			actionsMarkup = `
			<li><a class="dropdown-item confirm-hand-over" href="#" data-id="${request.id_request}" data-bs-toggle="modal" data-bs-target="#handedOverModal">confirmer la remise du matériel</a></li>
			`;
		} else {
			actionsMarkup = `
			<li><a class="dropdown-item" href="#" data-bs-toggle="modal" data-bs-target="#request--communication-manager-modal">Contacter le manager</a></li>
			<li><a class="dropdown-item" href="#" data-bs-toggle="modal" data-bs-target="#request--communication-manager-modal">Contacter le user</a></li>
			`;
		}
	} else if (namePermission === "stockman") {
		if (request.treatment_status === "pending_stockman") {
			actionsMarkup = `
			<li><a class="dropdown-item stockman-send-response" href="#" data-id="${request.id_request}">Envoyer une réponse</a></li>
			`;
		} else if (request.treatment_status === "sent_awaiting") {
			actionsMarkup = `
			<li><a class="dropdown-item stockman-send-item" href="#" data-id="${request.id_request}" data-bs-toggle="modal" data-bs-target="#sendingItemModal">Envoyer l'équipement</a></li>`;
		} else {
			actionsMarkup = `
			<li><a class="dropdown-item" href="#" data-bs-toggle="modal" data-bs-target="#request--communication-manager-modal">Contacter le manager</a></li>
			`;
		}
	}

	return `
			<tr data-id="${request.id_request}" data-date-start="${request.date_start}" data-date-end="${request.date_end}">
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
const confirmationModal = new Modal(
	document.getElementById("confirmationModal")
);
const stockmanApprovalModal = new Modal(
	document.getElementById("stockmanApprovalModal")
);
const stockmanResponseModal = new Modal(
	document.getElementById("stockmanResponseModal")
);
const confirmSendingModal = new Modal(
	document.getElementById("confirmSendingModal")
);
const sendingItemModal = new Modal(document.getElementById("sendingItemModal"));
const confirmReceivingModal = new Modal(
	document.getElementById("confirmReceivingModal")
);
const namePermission = localStorage.getItem("namePermission");
console.log("namePermission for modals:", namePermission);
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
	} else if (event.target.classList.contains("send-to-stockman")) {
		event.preventDefault();
		const requestId = event.target.getAttribute("data-id");
		openStockmanApprovalModal(requestId);
	} else if (event.target.classList.contains("stockman-send-response")) {
		event.preventDefault();
		const requestId = event.target.getAttribute("data-id");
		openStockmanResponseModal(requestId);
	} else if (event.target.classList.contains("confirm-sending-item")) {
		event.preventDefault();
		const requestId = event.target.getAttribute("data-id");
		openApprovalSendingItemModal(requestId);
	} else if (event.target.classList.contains("stockman-send-item")) {
		event.preventDefault();
		const requestId = event.target.getAttribute("data-id");
		openSendingItemModal(requestId);
	} else if (event.target.classList.contains("confirm-receiving-item")) {
		event.preventDefault();
		const requestId = event.target.getAttribute("data-id");
		openReceivingItemModal(requestId);
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
		const treatment_status = "rental_details_discussion_manager_stockman";
		const equipment_status = "equipment_availability_pending";

		const updatedData = {
			id_request: requestId,
			equipment_name: equipmentName,
			quantity: quantity,
			date_start: dateStart,
			date_end: dateEnd,
			comment,
			treatment_status,
			equipment_status,
		};

		apiEquipmentRequest
			.updateEquipmentRequest(updatedData)
			.then((data) => {
				updateTableRow(requestId, data);
				alert("L'étudiant peut maintant confirmer sa requête!");
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
	document
		.getElementById("confirmApprovalButton")
		.setAttribute("data-id", requestId);
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

	apiEquipmentRequest
		.sendUpdatedDataToUser(approvalData)
		.then((data) => {
			alert("Данные успешно подтверждены и отправлены на согласование!");
			updateTableRowStatus(requestId, "rental_details_discussion_manager_user");
		})
		.catch((error) => {
			console.error("Ошибка при отправке данных на согласование:", error);
			alert("Ошибка при отправке данных на согласование.");
		});
}

document
	.getElementById("confirmApprovalButton")
	.addEventListener("click", function () {
		const requestId = this.getAttribute("data-id");
		sendUpdatedDataToUser(requestId);
		confirmationModal.hide();
	});

function updateTableRowStatus(requestId, status, equipmentStatus = null) {
	const row = document.querySelector(`tr[data-id="${requestId}"]`);
	console.log(
		"проверка данных которые передаются",
		requestId,
		status,
		equipmentStatus
	);
	if (row) {
		row.children[6].textContent = status;
		if (equipmentStatus !== null) {
			row.children[7].textContent = equipmentStatus;
		}
	}
}

document
	.getElementById("confirmApprovalButton")
	.addEventListener("click", function () {
		const requestId = this.getAttribute("data-id");
		const row = document.querySelector(`tr[data-id="${requestId}"]`);
		const equipmentName = row.querySelector(
			"[data-equipment-name]"
		).textContent;
		const quantity = row.children[2].textContent;
		const dateStart = row.getAttribute("data-date-start");
		const dateEnd = row.getAttribute("data-date-end");
		const comment = row.children[5] ? row.children[5].textContent : null;
		const responseData = {
			id_request: requestId,
			equipment_name: equipmentName,
			quantity: quantity,
			date_start: dateStart,
			date_end: dateEnd,
			comment: comment,
			treatment_status: "rental_details_discussion_manager_user",
			equipment_status: "found",
		};

		sendUpdatedDataToUser(responseData);
		confirmationModal.hide();
	});

function openStockmanApprovalModal(requestId) {
	console.log("Вызов функции openStockmanApprovalModal ");
	document
		.getElementById("confirmStockmanApprovalButton")
		.setAttribute("data-id", requestId);
	stockmanApprovalModal.show();
}

function openStockmanResponseModal(requestId) {
	document
		.getElementById("sendStockmanResponseButton")
		.setAttribute("data-id", requestId);
	stockmanResponseModal.show();
}

document
	.getElementById("confirmSendingButton")
	.addEventListener("click", function () {
		const requestId = this.getAttribute("data-id");
		confirmSending(requestId);
		confirmSendingModal.hide();
	});

function openApprovalSendingItemModal(requestId) {
	document
		.getElementById("confirmSendingButton")
		.setAttribute("data-id", requestId);
	confirmSendingModal.show();
}

document
	.getElementById("sendingItemButton")
	.addEventListener("click", function () {
		const requestId = this.getAttribute("data-id");
		sendingItem(requestId);
		sendingItemModal.hide();
	});

function openSendingItemModal(requestId) {
	document
		.getElementById("sendingItemButton")
		.setAttribute("data-id", requestId);
	sendingItemModal.show();
}

document
	.getElementById("confirmReceivingItemButton")
	.addEventListener("click", function () {
		const requestId = this.getAttribute("data-id");
		receivingItem(requestId);
		confirmReceivingModal.hide();
	});

function openReceivingItemModal(requestId) {
	document
		.getElementById("confirmReceivingItemButton")
		.setAttribute("data-id", requestId);
	confirmReceivingModal.show();
}

function sendToStockman(requestId) {
	const row = document.querySelector(`tr[data-id="${requestId}"]`);
	const equipmentName = row.querySelector("[data-equipment-name]").textContent;
	const quantity = row.children[2].textContent;
	const dateStart = row.children[3].textContent;
	const dateEnd = row.children[4].textContent;
	const comment = row.children[5].textContent;

	const updatedData = {
		id_request: requestId,
		equipment_name: equipmentName,
		quantity: quantity,
		date_start: dateStart,
		date_end: dateEnd,
		comment: comment,
		treatment_status: "pending_stockman",
		equipment_status: "equipment_availability_pending",
	};
	console.log(updatedData);

	apiEquipmentRequest
		.updateEquipmentRequest(updatedData)
		.then((data) => {
			alert(
				"Les données ont été envoyées avec succès pour approbation avec le magasinier !"
			);
			updateTableRowStatus(requestId, "pending_stockman");
		})
		.catch((error) => {
			console.error(
				"Erreur lors de l'envoi des données pour approbation avec le magasinier :",
				error
			);
			alert(
				"Erreur lors de l'envoi des données pour approbation avec le magasinier."
			);
		});
}

document
	.getElementById("confirmStockmanApprovalButton")
	.addEventListener("click", function () {
		const requestId = this.getAttribute("data-id");
		sendToStockman(requestId);
		stockmanApprovalModal.hide();
	});

document
	.getElementById("stockmanResponseForm")
	.addEventListener("change", function (event) {
		const rentalDateContainer = document.getElementById("rentalDateContainer");
		if (event.target.id === "responseFound" && event.target.checked) {
			rentalDateContainer.style.display = "block";
		} else if (event.target.id === "responseNotFound" && event.target.checked) {
			rentalDateContainer.style.display = "none";
		}
	});

document
	.getElementById("sendStockmanResponseButton")
	.addEventListener("click", function () {
		const requestId = this.getAttribute("data-id");
		const row = document.querySelector(`tr[data-id="${requestId}"]`);
		const responseValue = document.querySelector(
			'input[name="stockmanResponse"]:checked'
		).value;
		const equipment_name = row.querySelector(
			"[data-equipment-name]"
		).textContent;
		const quantity = row.children[2].textContent;
		const rentalDateStart = document.getElementById("rentalDateStart").value;
		const rentalDateEnd = document.getElementById("rentalDateEnd").value;
		const dateStart = row.getAttribute("data-date-start");

		// Валидация дат
		if (responseValue === "found") {
			if (new Date(rentalDateStart) < new Date(dateStart)) {
				alert(
					"La date de début de location possible ne peut pas être inférieure à la date de début de location dans la demande."
				);
				return;
			}
			if (new Date(rentalDateEnd) < new Date(rentalDateStart)) {
				alert(
					"La date de fin de location possible doit être supérieure à la date de début de location possible."
				);
				return;
			}
		}

		if (responseValue === "found") {
			approveRequest(
				requestId,
				rentalDateStart,
				rentalDateEnd,
				equipment_name,
				quantity
			);
		} else {
			closeRequestByStockman(requestId, "closed_by_stockman");
		}
	});

function approveRequest(
	requestId,
	rentalDateStart,
	rentalDateEnd,
	equipment_name,
	quantity
) {
	const responseData = {
		quantity,
		equipment_name,
		id_request: requestId,
		date_start: rentalDateStart,
		date_end: rentalDateEnd,
		treatment_status: "rental_details_discussion_manager_stockman",
		equipment_status: "found",
	};

	// Отправка данных на сервер
	apiEquipmentRequest
		.updateEquipmentRequest(responseData)
		.then((data) => {
			updateTableRow(requestId, data);
			alert("La réponse a été envoyée au manager!");
			stockmanResponseModal.hide();
		})
		.catch((error) => {
			console.error("Error updating request:", error);
			alert("Error updating request.");
		});
}

function confirmSending(requestId) {
	const row = document.querySelector(`tr[data-id="${requestId}"]`);
	const treatment_status = "sent_awaiting";
	const responseData = {
		id_request: requestId,
		treatment_status,
	};
	console.log("Отправка данных для подтверждения отправки:", responseData);
	apiEquipmentRequest
		.updateEquipmentRequest(responseData)
		.then((data) => {
			console.log("Ответ сервера:", data);
			alert("Данные успешно обновлены и отправлены на подтверждение отправки!");
			updateTableRowStatus(requestId, treatment_status);
		})
		.catch((error) => {
			console.error("Ошибка при обновлении данных:", error);
			alert("Ошибка при обновлении данных.");
		});
}

function sendingItem(requestId) {
	const row = document.querySelector(`tr[data-id="${requestId}"]`);
	const treatment_status = "treated_rental_manager_stockman";
	const equipment_status = "sent";
	const responseData = {
		id_request: requestId,
		treatment_status,
		equipment_status,
	};
	console.log("Отправка данных для подтверждения отправки:", responseData);
	apiEquipmentRequest
		.updateEquipmentRequest(responseData)
		.then((data) => {
			alert("Данные успешно обновлены и отправлены на подтверждение отправки!");
			updateTableRowStatus(requestId, treatment_status);
		})
		.catch((error) => {
			console.error("Ошибка при обновлении данных:", error);
			alert("Ошибка при обновлении данных.");
		});
}

function receivingItem(requestId) {
	const row = document.querySelector(`tr[data-id="${requestId}"]`);
	const manager_treatment_status = "closed_by_stockman";
	const manager_equipment_status = "received";
	const responseData = {
		id_request: requestId,
		treatment_status: manager_treatment_status,
		equipment_status: manager_equipment_status,
	};
	console.log("Отправка данных для подтверждения отправки:", responseData);
	apiEquipmentRequest
		.updateEquipmentRequest(responseData)
		.then((data) => {
			alert(
				"Désormais, le magasinier peut dormir tranquille, car vous l'avez informé de la réception de l'équipement! N'oubliez pas de rappeler à l'utilisateur de venir chercher le matériel s'il faut!"
			);

			// Обновляем статусы для страницы менеджера
			updateTableRowStatus(
				requestId,
				manager_treatment_status,
				manager_equipment_status
			);

			// Переотрисовка таблицы для обновления данных для кладовщика
			updateEquipmentRequestsTable(localStorage.getItem("namePermission"));
		})
		.catch((error) => {
			console.error("Ошибка при обновлении данных:", error);
			alert("Ошибка при обновлении данных.");
		});
}

function closeRequestByStockman(requestId, status) {
	const responseData = {
		id_request: requestId,
		treatment_status: status,
		equipment_status: "not_found",
	};

	// Отправка данных на сервер
	apiEquipmentRequest
		.updateEquipmentRequest(responseData)
		.then((data) => {
			updateTableRow(requestId, data);
			alert("Le statut de la demande a été mis à jour!");
			stockmanResponseModal.hide();
		})
		.catch((error) => {
			console.error("Error updating request:", error);
			alert("Error updating request.");
		});
}
