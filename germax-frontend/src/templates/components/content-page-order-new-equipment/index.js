import "./index.css";
// Confirmer la réception; marqué comme reçu как подстраховка (а так, будет автоматически делаться)
import Modal from "bootstrap/js/dist/modal";
import Dropdown from "bootstrap/js/dist/dropdown";
import { formDataToObject } from "../../../utils/form-data-to-object";
import { ApiAuth } from "../../../utils/classes/api-auth";
import { ApiEquipmentRequest } from "../../../utils/classes/api-equipment-request";
import { ApiRental } from "../../../utils/classes/api-rental";
import { ApiGoods } from "../../../utils/classes/api-goods";
import { CategoryAPI } from "../../../utils/classes/api-category";
import { BrandAPI } from "../../../utils/classes/api-brand";
import { UploadAPI } from "../../../utils/classes/api-upload";

const apiEquipmentRequest = new ApiEquipmentRequest();
const apiRental = new ApiRental();
const apiGoods = new ApiGoods();
const categoryApi = new CategoryAPI();
const brandApi = new BrandAPI();
const uploadApi = new UploadAPI();
const id_user = JSON.parse(localStorage.getItem("id_user"));
const authToken = localStorage.getItem("authToken");
const namePermission = localStorage.getItem("namePermission");
updateEquipmentRequestsTable(namePermission);
console.log("Auth token:", authToken);
if (authToken) {
	fetchAuthUser("http://germax-api/auth/me");
}

// const addCategoryModalElement = document.getElementById("addCategoryModal");
// const addCategoryModal = new Modal(addCategoryModalElement);
// async function saveCategory() {
// 	console.log(addCategoryModal);
// 	const name = document.getElementById("newCategoryName").value;

// 	try {
// 		const data = await categoryApi.addCategory({ categoryName: name });
// 		if (data.success) {
// 			alert(data.message);
// 			document.getElementById("newCategoryName").value = "";
// 			addCategoryModal.hide();
// 		} else {
// 			alert(data.message);
// 		}
// 	} catch (error) {
// 		console.error("Ошибка:", error);
// 	}
// }

// document
// 	.getElementById("saveCategoryBtn")
// 	.addEventListener("click", saveCategory);

// // adding new equipment
// const addEquipmentModalElement = document.getElementById("addEquipmentModal");
// const addEquipmentModal = new Modal(addEquipmentModalElement);
// document
// 	.getElementById("saveEquipmentBtn")
// 	.addEventListener("click", saveEquipment);
// document.getElementById("brandName").addEventListener("input", searchBrands);
// document
// 	.getElementById("brandName")
// 	.addEventListener("change", autoFillModelName);

// async function searchBrands() {
// 	const brandInput = document.getElementById("brandName");
// 	const query = brandInput.value;
// 	const response = await brandApi.searchBrands(query);

// 	const suggestions = document.getElementById("brandSuggestions");
// 	suggestions.innerHTML = "";

// 	response.forEach((brand) => {
// 		const suggestion = document.createElement("a");
// 		suggestion.href = "#";
// 		suggestion.classList.add("list-group-item", "list-group-item-action");
// 		suggestion.textContent = brand.name;
// 		suggestion.onclick = () => {
// 			brandInput.value = brand.name;
// 			suggestions.innerHTML = "";
// 			autoFillModelName();
// 		};
// 		suggestions.appendChild(suggestion);
// 	});
// }

// async function saveEquipment() {
// 	const form = document.getElementById("addEquipmentForm");
// 	if (form.checkValidity() === false) {
// 			form.reportValidity();
// 			return;
// 	}

// 	const modelName = document.getElementById("equipmentName").value;
// 	const id_type = document.getElementById("categoryName").value;
// 	const brandName = document.getElementById("brandName").value;
// 	const description = document.getElementById("equipmentDescription").value;
// 	const serial_number = document.getElementById("serialNumber").value;
// 	const photoFile = document.getElementById("equipmentPhoto").files[0];

// 	let brandId = await fetchBrandIdByName(brandName);
// 	if (!brandId) {
// 			brandId = await addNewBrand(brandName);
// 	}

// 	let photoUrl = "";
// 	if (photoFile) {
// 			const uploadData = await uploadApi.uploadPhoto(photoFile);
// 			if (uploadData.success) {
// 					photoUrl = uploadData.url;
// 			} else {
// 					throw new Error(uploadData.message);
// 			}
// 	}

// 	try {
// 			const data = await apiGoods.createGood({
// 					modelName,
// 					statusId: 4,
// 					serialNumbers: [serial_number], // Wrapping in an array to use createGood
// 					id_type,
// 					brandName,
// 					description,
// 					photo: photoUrl,
// 			});

// 			if (data.success) {
// 					alert("Équipement ajouté avec succès!");
// 					form.reset();
// 					addEquipmentModal.hide();
// 			} else {
// 					alert("Erreur: " + data.message);
// 			}
// 	} catch (error) {
// 			console.error("Erreur:", error);
// 			alert("Erreur lors de l'ajout de l'équipement.");
// 	}
// }

// async function fetchBrandIdByName(brandName) {
// 	const brand = await brandApi.searchBrands(brandName);
// 	return brand.id || null;
// }

// async function addNewBrand(brandName) {
// 	const data = await brandApi.getOrCreateBrand({ name: brandName });
// 	return data.id;
// }

// function autoFillModelName() {
// 	const brandName = document.getElementById("brandName").value;
// 	const modelNameInput = document.getElementById("equipmentName");
// 	if (!modelNameInput.value) {
// 		modelNameInput.value = brandName;
// 	}
// }

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
	// const titleAddingOrders = document.getElementById("titleAddingOrders");
	const addingEquipmentContainer = document.getElementById(
		"equipmentAddingContainer"
	);
	const titleOrdersRequest = document.getElementById("titleOrdersRequest");
	console.log("titleOrdersRequest", titleOrdersRequest);
	const orderEquipmentContainer = document.getElementById("orderForm");
	const titleOrders = document.getElementById("titleOrders");
	const listOrdersTitle = document.getElementById("listOrdersTitle");

	//stockman
	// titleAddingOrders.innerHTML = "";
	addingEquipmentContainer.innerHTML = "";
	titleOrdersRequest.innerHTML = "";
	//manager
	orderEquipmentContainer.innerHTML = "";
	titleOrders.innerHTML = ``;
	listOrdersTitle.innerHTML = ``;

	if (userData.name_permission === "stockman") {
		const titleOrdersRequestMarkup = `<h2>Requêtes du nouvel équipement</h2>`;
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
        <button type="submit" class="btn btn-primary form-control mt-3" id="equipmentRequestButton">Faire une requête</button>
    </form>
</div>

		`;
		const listOrdersTitleMarkup = `<h2>Gestion des demandes de nouvelles réservations</h2>`;

		orderEquipmentContainer.innerHTML = markup;
		titleOrders.innerHTML = titleOrdersMarkup;
		listOrdersTitle.innerHTML = listOrdersTitleMarkup;
		// отправка на equipment_requests
		document
			.getElementById("equipmentRequestButton")
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
// обновление таблицы с сортировкой и пагинацией

let sortField = ''; // Поле для сортировки
let sortOrder = 'asc'; // Порядок сортировки: 'asc' или 'desc'

function updateEquipmentRequestsTable(namePermission, page = 1, itemsPerPage = 10, sortField = '', sortOrder = 'asc') {
    apiEquipmentRequest
        .getAllRequests(page, itemsPerPage)
        .then((data) => {
            let requests = data.data;

            // Сортируем данные
            if (sortField) {
                requests.sort((a, b) => {
                    if (sortOrder === 'asc') {
                        return a[sortField] > b[sortField] ? 1 : -1;
                    } else {
                        return a[sortField] < b[sortField] ? 1 : -1;
                    }
                });
            }

            const tableBody = document.querySelector(".table tbody");
            tableBody.innerHTML = ""; // Очистить текущее содержимое таблицы

            if (data.success && Array.isArray(requests)) {
                requests.forEach((request) => {
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

                        const row = createTableRow(request, namePermission);
                        tableBody.innerHTML += row;
                    }
                });
                updatePaginationControls(data.totalItems, page, itemsPerPage);
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


let currentPage = 1;
const itemsPerPage = 10;

updateEquipmentRequestsTable(namePermission, currentPage, itemsPerPage);

function updatePaginationControls(totalItems, currentPage, itemsPerPage) {
	const totalPages = Math.ceil(totalItems / itemsPerPage);
	const pageInfo = document.getElementById("pageInfo");
	const prevPageBtn = document.getElementById("prevPageBtn");
	const nextPageBtn = document.getElementById("nextPageBtn");

	if (pageInfo) {
			pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
	} else {
			console.error("Element with id 'pageInfo' not found.");
	}

	if (prevPageBtn) {
			prevPageBtn.disabled = currentPage === 1;
	} else {
			console.error("Element with id 'prevPageBtn' not found.");
	}

	if (nextPageBtn) {
			nextPageBtn.disabled = currentPage === totalPages;
	} else {
			console.error("Element with id 'nextPageBtn' not found.");
	}
}

document.getElementById("prevPageBtn").addEventListener("click", () => {
	if (currentPage > 1) {
			currentPage--;
			updateEquipmentRequestsTable(localStorage.getItem("namePermission"), currentPage, itemsPerPage, sortField, sortOrder);
	}
});

document.getElementById("nextPageBtn").addEventListener("click", () => {
	currentPage++;
	updateEquipmentRequestsTable(localStorage.getItem("namePermission"), currentPage, itemsPerPage, sortField, sortOrder);
});


// recherche par utilisateur

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
const categoryByIdType = {
	1: "ordinateur portable",
	2: "écran d'ordinateur",
	3: "smartphone",
	4: "accessoire",
	5: "tablette",
	6: "casque VR",
};

function createTableRow(request, namePermission) {
	let actionsMarkup = "";

	// Преобразование статусов для кладовщика
	let treatmentStatus = request.treatment_status;
	let equipmentStatus = request.equipment_status;

	if (namePermission === "stockman") {
		if (
			treatmentStatus === "pending_stockman" &&
			equipmentStatus === "equipment_availability_pending"
		) {
			treatmentStatus = "requête du nouvel équipement";
			equipmentStatus = "disponibilité de l'équipement en attente";
		} else if (
			(treatmentStatus === "closed_by_stockman" &&
				equipmentStatus === "received") ||
			(treatmentStatus === "closed_by_stockman" &&
				equipmentStatus === "handed_over")
		) {
			treatmentStatus = "demande fermée";
			equipmentStatus = "délivré";
		} else if (
			treatmentStatus === "rental_details_discussion_manager_stockman" &&
			equipmentStatus === "found"
		) {
			treatmentStatus = "réponse envoyée au manager";
			equipmentStatus = "trouvé";
		} else if (
			treatmentStatus === "sent_awaiting" &&
			equipmentStatus === "found"
		) {
			treatmentStatus = "en attente d'envoi";
			equipmentStatus = "trouvé";
		} else if (
			treatmentStatus === "treated_rental_manager_stockman" &&
			equipmentStatus === "sent"
		) {
			treatmentStatus = "traité avec le manager";
			equipmentStatus = "envoyé";
		}
	} else if (namePermission === "rental-manager") {
		if (
			treatmentStatus === "treated_manager_user" &&
			equipmentStatus === "equipment_availability_pending"
		) {
			treatmentStatus = "en attente d'envoi chez le gestionnaire";
			equipmentStatus = "disponibilité de l'équipement en attente";
		} else if (
			treatmentStatus === "pending_stockman" &&
			equipmentStatus === "equipment_availability_pending"
		) {
			treatmentStatus = "la requête est envoyée au gestionnaire";
			equipmentStatus = "disponibilité de l'équipement en attente";
		} else if (
			treatmentStatus === "rental_details_discussion_manager_user" &&
			equipmentStatus === "equipment_availability_pending"
		) {
			treatmentStatus = "confirmation attendue de l'utilisateur";
			equipmentStatus = "disponibilité de l'équipement en attente";
		} else if (
			treatmentStatus === "closed_by_stockman" &&
			equipmentStatus === "received"
		) {
			treatmentStatus = "demande traitée avec le gestionnaire";
			equipmentStatus = "matériel reçu";
		}
	}

	const dateStart = (request.date_start && request.date_start !== "0000-00-00")
		? request.date_start
		: "les dates n'ont pas été indiquées";
	const dateEnd = (request.date_end && request.date_end !== "0000-00-00")
		? request.date_end
		: "les dates n'ont pas été indiquées";

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
			treatmentStatus = "confirmer l'envoi";
			equipmentStatus = "trouvé";
			actionsMarkup = `
			<li><a class="dropdown-item confirm-sending-item" href="#" data-id="${request.id_request}" data-bs-toggle="modal" data-bs-target="#confirmSendingModal">confirmer l'envoi</a></li>
			`;
		} else if (request.treatment_status === "sent_awaiting") {
			treatmentStatus = "en attente d'envoi";
			equipmentStatus = "trouvé";
			actionsMarkup = `
			<li><a class="dropdown-item" href="#" data-bs-toggle="modal" data-bs-target="#request--communication-manager-modal">Contacter le manager</a></li>
			<li><a class="dropdown-item" href="#" data-bs-toggle="modal" data-bs-target="#request--communication-manager-modal">Contacter le user</a></li>
			`;
		} else if (request.treatment_status === "treated_rental_manager_stockman") {
			treatmentStatus = "envoyé";
			equipmentStatus = "trouvé";
			actionsMarkup = `
			<li><a class="dropdown-item confirm-receiving-item" href="#" data-id="${request.id_request}" data-bs-toggle="modal" data-bs-target="#confirmReceivingModal">confirmer la réception</a></li>
			`;
		} else if (
			request.treatment_status === "closed_by_stockman" &&
			request.equipment_status === "received"
		) {
			actionsMarkup = `
			<li><a class="dropdown-item confirm-hand-over" href="#" data-id="${request.id_request}" data-bs-toggle="modal" data-bs-target="#handOverModal">confirmer la remise du matériel</a></li>
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
			<tr data-id="${request.id_request}" data-date-start="${
		request.date_start
	}" data-date-end="${request.date_end}">
					<td>${request.id_request}</td>
					<td data-equipment-name>${request.equipment_name}</td>
					<td>${categoryByIdType[request.id_type] || "N/A"}</td>
					<td>${request.quantity}</td>
					<td>${request.request_date}</td>
					<td>${dateStart}</td>
          <td>${dateEnd}</td>
					<td>${treatmentStatus}</td>
					<td>${equipmentStatus}</td>
					<td>
							<div class="dropdown">
									<button class="btn btn-secondary dropdown-toggle" type="button"
											id="dropdownMenuButton${
												request.id_request
											}" data-bs-toggle="dropdown" aria-expanded="false">
											Choisir une action
									</button>
									<ul class="dropdown-menu" aria-labelledby="dropdownMenuButton${
										request.id_request
									}">
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
const handOverModal = new Modal(document.getElementById("handOverModal"));
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
	} else if (event.target.classList.contains("confirm-hand-over")) {
		event.preventDefault();
		const requestId = event.target.getAttribute("data-id");
		openHandOverModal(requestId);
	}
});

function openEditModal(requestId) {
	const row = document.querySelector(`tr[data-id="${requestId}"]`);
	const equipmentName = row.querySelector("[data-equipment-name]").textContent;
	const quantity = row.children[3].textContent;
	const dateStart = row.children[5].textContent;
	const dateEnd = row.children[6].textContent;

	document.getElementById("editRequestId").value = requestId;
	document.getElementById("editEquipmentName").value = equipmentName;
	document.getElementById("editQuantity").value = quantity;
	document.getElementById("editDateStart").value = dateStart;
	document.getElementById("editDateEnd").value = dateEnd;

	editModal.show();
}

document
	.getElementById("editForm")
	.addEventListener("submit", function (event) {
		event.preventDefault();

		const requestId = document.getElementById("editRequestId").value;
		const equipmentName = document.getElementById("editEquipmentName").value;
		const quantityValue = document.getElementById("editQuantity").value;
		const dateStartValue = document.getElementById("editDateStart").value;
		const dateEndValue = document.getElementById("editDateEnd").value;
		const commentValue = document.getElementById("editComment").value;

		const updatedData = {
			id_request: requestId,
			equipment_name: equipmentName,
			quantity: quantityValue,
			date_start: dateStartValue,
			date_end: dateEndValue,
			comment: commentValue,
		};

		updateTableRow(requestId, updatedData);
		editModal.hide();
	});

function updateTableRow(requestId, updatedData, isArray = false) {
	const tableBody = document.querySelector(".table tbody");

	// Функция для создания элемента DOM из строки HTML
	const createElementFromHTML = (htmlString) => {
		const div = document.createElement("div");
		div.innerHTML = htmlString.trim();
		const element = div.firstElementChild;
		return element;
	};

	if (isArray) {
		// Удаление старой строки для requestId
		const existingRow = document.querySelector(`tr[data-id="${requestId}"]`);
		if (existingRow) {
			tableBody.removeChild(existingRow);
		}

		// Вставка новых строк
		updatedData.forEach((data, index) => {
			const newRowHtml = createTableRow(data);
			console.log("Generated HTML for new row:", newRowHtml);
			const newRow = createElementFromHTML(newRowHtml);
			console.log("Generated newrow:", newRow);

			if (!newRow) {
				console.error(
					"Failed to create new row element from HTML:",
					newRowHtml
				);
				return; // Прекратить выполнение, если элемент не создан
			}

			newRow.classList.add("highlight");
			if (index === 0) {
				// Первая запись (обновление)
				tableBody.insertBefore(newRow, tableBody.firstChild);
			} else {
				// Новые записи
				const referenceNode = tableBody.firstChild.nextSibling;
				tableBody.insertBefore(newRow, referenceNode);
			}
		});
	} else {
		const row = document.querySelector(`tr[data-id="${requestId}"]`);
		if (row) {
			updateSingleRow(requestId, updatedData);
		} else {
			const newRowHtml = createTableRow(updatedData);
			const newRow = createElementFromHTML(newRowHtml);
			newRow.classList.add("highlight");
			tableBody.insertBefore(newRow, tableBody.firstChild);
		}
	}
}

function updateSingleRow(requestId, updatedData) {
	const row = document.querySelector(`tr[data-id="${requestId}"]`);

	if (!row) return;

	let updatedTreatmentStatus = updatedData.treatment_status;
	let updatedEquipmentStatus = updatedData.equipment_status;

	if (
		updatedTreatmentStatus === "rental_details_discussion_manager_user" &&
		updatedEquipmentStatus === "equipment_availability_pending"
	) {
		updatedTreatmentStatus = "confirmation attendue de l'utilisateur";
		updatedEquipmentStatus = "disponibilité de l'équipement en attente";
	} else if (
		updatedTreatmentStatus === "sent_awaiting" &&
		updatedEquipmentStatus === "found"
	) {
		updatedTreatmentStatus = "en attente d'envoi";
		updatedEquipmentStatus = "trouvé";
	}

	const dateStart = (updatedData.date_start && updatedData.date_start !== "0000-00-00")
		? updatedData.date_start
		: "les dates n'ont pas été indiquées";
	const dateEnd = (updatedData.date_end && updatedData.date_end !== "0000-00-00")
		? updatedData.date_end
		: "les dates n'ont pas été indiquées";

	row.querySelector("[data-equipment-name]").textContent =
		updatedData.equipment_name;
	row.children[3].textContent = updatedData.quantity;
	row.children[5].textContent = dateStart;
	row.children[6].textContent = dateEnd;

	if (updatedTreatmentStatus !== undefined) {
		row.children[7].textContent = updatedTreatmentStatus;
	}

	if (updatedEquipmentStatus !== undefined) {
		row.children[8].textContent = updatedEquipmentStatus;
	}
}

function openConfirmationModal(requestId) {
	document
		.getElementById("confirmApprovalButton")
		.setAttribute("data-id", requestId);
	confirmationModal.show();
}

function sendUpdatedDataToUser(approvalData) {
	apiEquipmentRequest
		.updateEquipmentRequest(approvalData)
		.then((data) => {
			console.log("received data after calling sendUpdateDataToUser", data);
			alert(
				"L'utilisateur verra que vous avez vérifié sa requête et n'a plus qu'à la valider!"
			);
			const requestId = data.id_request;
			updateTableRowStatus(requestId, "rental_details_discussion_manager_user");
			updateTableRow(requestId, data);
		})
		.catch((error) => {
			console.error("Erreur d'envoi de données:", error);
			alert("Ошибка при отправке данных на согласование.");
		});
}

function updateTableRowStatus(requestId, status, equipmentStatus = null) {
	const row = document.querySelector(`tr[data-id="${requestId}"]`);
	console.log(
		"проверка данных которые передаются",
		requestId,
		status,
		equipmentStatus
	);
	if (row) {
		row.children[7].textContent = status;
		if (equipmentStatus !== null) {
			row.children[8].textContent = equipmentStatus;
		}
	}
}

document
	.getElementById("confirmApprovalButton")
	.addEventListener("click", function () {
		const requestId = this.getAttribute("data-id");
		console.log("requestId", requestId);
		const row = document.querySelector(`tr[data-id="${requestId}"]`);
		const equipmentName = row.querySelector(
			"[data-equipment-name]"
		).textContent;
		const quantity = row.children[3].textContent;
		const dateStart = row.getAttribute("data-date-start");
		const dateEnd = row.getAttribute("data-date-end");
		const comment = row.children[5] ? row.children[5].textContent : null;
		const categoryText = row.children[2].textContent;
		const idTypeMap = {
			"ordinateur portable": 1,
			"écran d'ordinateur": 2,
			smartphone: 3,
			accessoire: 4,
			tablette: 5,
			"casque VR": 6,
		};

		const id_type = idTypeMap[categoryText];

		if (id_type === undefined) {
			console.error("Unknown category text:", categoryText);
			return;
		}

		const responseData = {
			id_request: requestId,
			equipment_name: equipmentName,
			id_type,
			quantity,
			date_start: dateStart,
			date_end: dateEnd,
			comment,
			treatment_status: "rental_details_discussion_manager_user",
			equipment_status: "equipment_availability_pending",
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
	const row = document.querySelector(`tr[data-id="${requestId}"]`);
	const equipmentName = row.children[1].textContent.trim();
	const brandName = equipmentName.split(" ")[0];
	const quantity = parseInt(row.children[3].textContent.trim(), 10);
	const dateStart = row.children[5].textContent.trim();
	const dateEnd = row.children[6].textContent.trim();
	const categoryText = row.children[2].textContent
		.trim()
		.toLowerCase()
		.replace(" ", "_"); // Преобразование категории в нижний регистр и замена пробелов на подчеркивания
	console.log(categoryText);
	const idTypeMap = {
		ordinateur_portable: "laptop",
		"computer monitor": "computer_monitor",
		smartphone: "smartphone",
		accessory: "accessory",
		tablet: "tablet",
		"vr headset": "VR_headset",
	};

	const id_type = idTypeMap[categoryText];
	console.log(id_type);

	document.getElementById("stockmanResponseEquipmentName").value =
		equipmentName;
	document.getElementById("equipmentType").value = id_type;
	document.getElementById("equipmentBrand").value = brandName;
	document.getElementById("equipmentQuantity").value = quantity;
	document.getElementById("rentalDateStart").value = dateStart;
	document.getElementById("rentalDateEnd").value = dateEnd;

	// Очистить предыдущие серийные номера
	const serialNumbersContainer = document.getElementById(
		"equipmentSerialNumbers"
	);
	serialNumbersContainer.innerHTML = "";

	for (let i = 0; i < quantity; i++) {
		const div = document.createElement("div");
		div.className = "serial-number-block mb-2";

		const input = document.createElement("input");
		input.type = "text";
		input.className = "form-control serial-number mb-2";
		input.placeholder = `Numéro de série ${i + 1}`;

		const rentalDateStartInput = document.createElement("input");
		rentalDateStartInput.type = "date";
		rentalDateStartInput.className = "form-control rental-date-start mb-2";
		rentalDateStartInput.placeholder = "Date de début de location souhaitée";

		const rentalDateEndInput = document.createElement("input");
		rentalDateEndInput.type = "date";
		rentalDateEndInput.className = "form-control rental-date-end mb-2";
		rentalDateEndInput.placeholder = "Date de fin de location souhaitée";

		div.appendChild(input);
		div.appendChild(rentalDateStartInput);
		div.appendChild(rentalDateEndInput);
		serialNumbersContainer.appendChild(div);
	}
	stockmanResponseModal.show();

	document
		.getElementById("sendStockmanResponseButton")
		.setAttribute("data-id", requestId);
}

document
	.getElementById("responseFound")
	.addEventListener("change", function () {
		document.getElementById("equipmentDetailsContainer").style.display =
			"block";
	});

document
	.getElementById("responseNotFound")
	.addEventListener("change", function () {
		document.getElementById("equipmentDetailsContainer").style.display = "none";
	});

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

document
	.getElementById("handOverItemButton")
	.addEventListener("click", function () {
		const requestId = this.getAttribute("data-id");
		handOverItem(requestId);
		handOverModal.hide();
	});

function openHandOverModal(requestId) {
	document
		.getElementById("handOverItemButton")
		.setAttribute("data-id", requestId);
	handOverModal.show();
}

function sendToStockman(requestId) {
	const row = document.querySelector(`tr[data-id="${requestId}"]`);
	const equipmentName = row.querySelector("[data-equipment-name]").textContent;
	const quantity = row.children[3].textContent;
	const dateStart = row.children[5].textContent;
	const dateEnd = row.children[6].textContent;

	const updatedData = {
		id_request: requestId,
		equipment_name: equipmentName,
		quantity: quantity,
		date_start: dateStart,
		date_end: dateEnd,
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
			// статус который будет видно до обновления
			updateTableRowStatus(requestId, "la requête est envoyée au gestionnaire");
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
		const rentalDateContainer = document.getElementById(
			"equipmentDetailsContainer"
		);
		if (event.target.id === "responseFound" && event.target.checked) {
			rentalDateContainer.style.display = "block";
		} else if (event.target.id === "responseNotFound" && event.target.checked) {
			rentalDateContainer.style.display = "none";
		}
	});

document
	.getElementById("sendStockmanResponseButton")
	.addEventListener("click", async function () {
		const requestId = this.getAttribute("data-id");
		const row = document.querySelector(`tr[data-id="${requestId}"]`);
		const responseValue = document.querySelector(
			'input[name="stockmanResponse"]:checked'
		).value;
		const equipmentName = document.getElementById(
			"stockmanResponseEquipmentName"
		).value;
		const equipmentType = document.getElementById("equipmentType").value;
		console.log("equipmentType", equipmentType);
		const equipmentBrand = document.getElementById("equipmentBrand").value;
		const equipmentDescription = document.getElementById(
			"equipmentDescription"
		).value;
		const equipmentPhoto = document.getElementById("equipmentPhoto").files[0];
		const rentalDateStart = document.getElementById("rentalDateStart").value;
		const rentalDateEnd = document.getElementById("rentalDateEnd").value;
		const dateStart = row.getAttribute("data-date-start");
		const quantity = parseInt(row.children[3].textContent, 10);
		const serialNumbersData = Array.from(
			document.querySelectorAll("#equipmentSerialNumbers .serial-number-block")
		).map((block) => {
			return {
				serialNumber: block.querySelector("input.serial-number").value,
				rentalDateStart: block.querySelector("input.rental-date-start").value,
				rentalDateEnd: block.querySelector("input.rental-date-end").value,
			};
		});

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
			if (serialNumbersData.length !== quantity) {
				alert("Le nombre de numéros de série doit correspondre à la quantité.");
				return;
			}

			const idTypeMap = {
				laptop: 1,
				computer_monitor: 2,
				smartphone: 3,
				accessory: 4,
				tablet: 5,
				VR_headset: 6,
			};

			const equipmentIdType = idTypeMap[equipmentType];
			console.log("equipmentIdType", equipmentIdType);
			await approveRequest(
				requestId,
				rentalDateStart,
				rentalDateEnd,
				equipmentName,
				equipmentIdType,
				equipmentBrand,
				equipmentDescription,
				equipmentPhoto,
				serialNumbersData
			);
		} else {
			closeRequestByStockman(requestId, "closed_by_stockman");
		}
	});

async function approveRequest(
	requestId,
	rentalDateStart,
	rentalDateEnd,
	equipmentName,
	equipmentIdType,
	equipmentBrand,
	equipmentDescription,
	equipmentPhoto,
	serialNumbersData
) {
	try {
		const id_user = localStorage.getItem("id_user");
		const goodIds = [];
		const responsePromises = [];
		let newRequestId = requestId;

		// Загрузка фото
		let photoUrl = "";
		if (equipmentPhoto) {
			const formData = new FormData();
			formData.append("file", equipmentPhoto);
			const uploadResponse = await fetch("http://germax-api/upload", {
				method: "POST",
				body: formData,
			});
			const uploadData = await uploadResponse.json();
			if (uploadData.success) {
				photoUrl = uploadData.url;
			} else {
				throw new Error(uploadData.message);
			}
		}

		const serialNumbers = serialNumbersData.map((data) =>
			data.serialNumber.trim()
		);

		// Получение request_date из существующей записи
		const existingRequest = await apiEquipmentRequest.getRequestById(requestId);
		const requestDate = existingRequest.request_date;
		const updatedDataArray = [];

		// Создание новых good и записей в equipment_request
		for (const [index, data] of serialNumbersData.entries()) {
			console.log("data:", data);
			console.log("Sending data to createGood:", {
				modelName: equipmentName.trim(),
				statusId: 4,
				serialNumbers: [data.serialNumber.trim()],
				id_type: equipmentIdType,
				brandName: equipmentBrand.trim(),
				description: equipmentDescription.trim(),
				photo: photoUrl, // Передаем фото
			});
			const goodData = await apiGoods.createGood({
				modelName: equipmentName.trim(),
				statusId: 4,
				serialNumbers: [data.serialNumber.trim()],
				id_type: equipmentIdType,
				brandName: equipmentBrand.trim(),
				description: equipmentDescription.trim(),
				photo: photoUrl,
			});

			if (
				goodData &&
				goodData.id_good &&
				goodData.id_good.goods &&
				goodData.id_good.goods.length > 0 &&
				goodData.id_good.goods[0].id_good
			) {
				const idGood = goodData.id_good.goods[0].id_good;
				goodIds.push(idGood);

				const responseData = {
					quantity: 1,
					equipment_name: equipmentName,
					id_request: requestId,
					date_start: rentalDateStart,
					date_end: rentalDateEnd,
					treatment_status: "rental_details_discussion_manager_stockman",
					equipment_status: "found",
					id_user,
					id_type: equipmentIdType,
					id_good: idGood,
					request_date: requestDate,
				};

				if (index === 0) {
					// Обновление существующей записи для первой единицы оборудования
					console.log(
						"Updating existing record with responseData",
						responseData
					);
					responsePromises.push(
						apiEquipmentRequest.updateEquipmentRequest(responseData)
					);
				} else {
					// Создание новых записей для последующих единиц оборудования
					newRequestId = parseInt(newRequestId) + 1;
					responseData.id_request = newRequestId;
					console.log("Creating new record with responseData", responseData);
					responsePromises.push(
						apiEquipmentRequest.createRequest(responseData)
					);
					updatedDataArray.push(responseData);
				}
			} else {
				console.error("Invalid response from createGood:", goodData);
				throw new Error("Invalid response from createGood");
			}
		}

		await Promise.all(responsePromises);
		console.log("Updated request data array:", updatedDataArray);
		updateTableRow(requestId, updatedDataArray, true);
		alert("La réponse a été envoyée au manager!");
		stockmanResponseModal.hide();
	} catch (error) {
		console.error("Error during approveRequest:", error);
		alert("Error during approveRequest.");
	}
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
			alert(
				"Le gestionnaire est maintenant au courant et enverra le matériel à la date prévue!"
			);
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
			alert("Hourra! Le matériel est bel et bien envoyé");
			updateTableRowStatus(
				requestId,
				"matériel reçu",
				"demande traitée avec le gestionnaire"
			);
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

async function handOverItem(requestId) {
	const row = document.querySelector(`tr[data-id="${requestId}"]`);
	const treatment_status = "closed_by_stockman";
	const equipment_status = "handed_over";

	const responseData = {
		id_request: requestId,
		treatment_status,
		equipment_status,
	};
	console.log("Отправка данных для подтверждения отправки:", responseData);
	const existingRequest = await apiEquipmentRequest.getRequestById(requestId);
	const requestIdgood = existingRequest.id_good;
	console.log("получение id_good", requestIdgood);
	apiEquipmentRequest
		.updateEquipmentRequest(responseData)
		.then((data) => {
			alert("L'utilisateur a récupéré son matériel!");
			updateTableRowStatus(
				requestId,
				"en attente de retour",
				"matériel récupéré"
			);
			// Переотрисовка таблицы для обновления данных для кладовщика
			updateEquipmentRequestsTable(localStorage.getItem("namePermission"));
			const idRentalUser = localStorage.getItem("id_user");
			const loanStatus = "loaned";
			// Создаем данные для запроса на apiRental.createRequestRental
			const rentalData = {
				dateStart: row.children[4].textContent,
				dateEnd: row.children[5].textContent,
				id_user: idRentalUser,
				loanStatus,
			};

			const good = {
				id: requestIdgood, // Идентификатор товара, используйте нужный идентификатор
			};
			console.log("Данные для создания новой аренды:", good, rentalData);
			return apiRental.createNewItemRental(good, rentalData);
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

// сортировка

document.querySelectorAll('.sortButton').forEach(button => {
	button.addEventListener('click', function() {
			const fieldMap = {
					"Numéro de Commande": "id_request",
					"Nom de l'Équipement": "equipment_name",
					"Catégorie": "id_type",
					"Quantité": "quantity",
					"Date de la Commande": "request_date",
					"Date du début de location": "date_start",
					"Date de fin de location": "date_end",
					"Statut de la Requête": "treatment_status",
					"Statut de l'équipement": "equipment_status"
			};
			const field = fieldMap[this.parentElement.textContent.trim()];
			const order = this.getAttribute('data-order') === 'asc' ? 'desc' : 'asc';
			this.setAttribute('data-order', order);
			sortField = field;
			sortOrder = order;
			updateEquipmentRequestsTable(namePermission, currentPage, itemsPerPage, sortField, sortOrder);
	});
});


const backArrowContainer = document.getElementById("backArrowContainer");

if (backArrowContainer) {
	const backArrow = document.createElement("a");
	backArrow.href = "javascript:history.back()";
	backArrow.className = "back-arrow";
	backArrow.innerHTML = '<i class="fas fa-arrow-left"></i> Retour';
	backArrowContainer.appendChild(backArrow);
}
