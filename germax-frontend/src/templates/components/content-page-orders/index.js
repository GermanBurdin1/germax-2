import "./index.css";
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
import { debounce } from "../../../utils/debounce";

const categoryItemNodes = Array.from(
	document.getElementsByClassName("list-group-item")
);
const searchInputNode = document.querySelector("#model-search");

initRadioBtns();
initSearchListener();

const apiEquipmentRequest = new ApiEquipmentRequest();
const apiRental = new ApiRental();
const apiGoods = new ApiGoods();
const categoryApi = new CategoryAPI();
const brandApi = new BrandAPI();
const uploadApi = new UploadAPI();
const id_user = JSON.parse(localStorage.getItem("id_user"));
const authToken = localStorage.getItem("authToken");
let namePermission = localStorage.getItem("namePermission");
if (authToken) {
	fetchAuthUser("http://germax-api/auth/me");
}

if (namePermission === "rental-manager") {
	document.getElementById("titleAddingOrders").style.display = "none";
	document.getElementById("equipmentAddingContainer").style.display = "none";
	const statusHeader = document.querySelector("#statusHeader");
	if (statusHeader) statusHeader.style.display = "none";
}

let currentPage = 1;
const itemsPerPage = 20;
// loadGoodsData();

async function fetchAuthUser(url) {
	const token = JSON.parse(localStorage.getItem("authToken"));
	const id_user = JSON.parse(localStorage.getItem("id_user"));

	if (!token) {
		console.error("No token found, please login first");
		return;
	}

	try {
		const response = await fetch(url, {
			method: "GET",
			headers: {
				token: token,
				"Content-Type": "application/json",
			},
		});

		const data = await response.json();

		if (!response.ok) {
			return Promise.reject(data);
		}

		localStorage.setItem("namePermission", data.data.name_permission);
		cleanupPreviousUserElements();
		renderEquipmentOrder(data.data);
		initializePageForUser(data.data.name_permission);
	} catch (error) {
		console.error("Failed to fetch data:", error);
	}
}

function cleanupPreviousUserElements() {
	document.getElementById("titleAddingOrders").innerHTML = "";
	document.getElementById("equipmentAddingContainer").innerHTML = "";
	document.getElementById("titleOrdersRequest").innerHTML = "";
	document.getElementById("orderForm").innerHTML = "";
	document.getElementById("titleOrders").innerHTML = "";
	document.getElementById("listOrdersTitle").innerHTML = "";
}

function updateTableHeaders(role) {
	const tableHead = document.querySelector("#goodsTable thead tr");
	tableHead.innerHTML = `
		<th>Numéro du modèle</th>
		<th>Nom de l'Équipement</th>
		<th>Catégorie</th>
		<th>Photo</th>
		<th>Emplacement</th>
		<th>Status</th>
		<th>Actions</th>
	`;
}

function initializePageForUser(role) {
	namePermission = role;
	if (role === "stockman") {
		document.getElementById("titleAddingOrders").style.display = "block";
		document.getElementById("equipmentAddingContainer").style.display = "block";
		document.getElementById("titleOrdersRequest").style.display = "none";
		document.getElementById("orderForm").style.display = "none";
		document.getElementById("titleOrders").style.display = "none";
		document.getElementById("listOrdersTitle").style.display = "none";
	} else if (role === "rental-manager") {
		document.getElementById("titleAddingOrders").style.display = "none";
		document.getElementById("equipmentAddingContainer").style.display = "none";
		document.getElementById("titleOrdersRequest").style.display = "block";
		document.getElementById("orderForm").style.display = "block";
		document.getElementById("titleOrders").style.display = "block";
		document.getElementById("listOrdersTitle").style.display = "block";
	}
	updateTableHeaders(role);
	loadGoodsData();
}

initializePageForUser(namePermission);

async function loadGoodsData(params = {}) {
	if (!params.statusNames) {
		params.statusNames =
			namePermission === "rental-manager"
				? ["available"]
				: ["available", "unavailable", "booked", "cancelled"];
	}
	params.page = currentPage;
	params.limit = itemsPerPage;
	params.typeName = getActiveCategory();
	params.modelName = searchInputNode.value.trim();

	try {
		const response = await apiGoods.getAllGoods(params);
		const goods = response.goods.data;
		const totalItems = response.goods.totalItems;
		displayGoods(goods);
		updatePaginationControls(totalItems);
	} catch (error) {
		console.error("Ошибка при получении данных:", error);
	}
}

function displayGoods(goods) {
	const tableBody = document.querySelector("#goodsTable tbody");
	tableBody.innerHTML = "";

	goods.forEach((good) => {
		let statusText;
		switch (good.status.name) {
			case "booked":
				statusText = "loué";
				break;
			case "available":
				statusText = "disponible";
				break;
			case "unavailable":
				statusText = "indisponible";
				break;
			case "cancelled":
				statusText = "réservation annulée";
				break;
			default:
				statusText = good.status.name;
				break;
		}

		let locationText;
		if (good.location === "stock_stockman") {
			locationText = "chez le géstionnaire";
		} else {
			locationText = good.location;
		}

		let shippingStatusText;
		switch (good.shipping_status) {
			case "pending":
				shippingStatusText = "en attente d'envoi";
				break;
			case "send_to_manager":
				shippingStatusText = "envoyé au manager";
				break;
			case "received_by_manager":
				shippingStatusText = "reçu par le manager";
				break;
			case "send_to_stockman":
				shippingStatusText = "envoyé au stockman";
				break;
			case "reveived_by_stockman":
				shippingStatusText = "reçu par le stockman";
				break;
			default:
				shippingStatusText = good.shipping_status;
				break;
		}

		const row = document.createElement("tr");
		row.innerHTML = `
			<td>${good.model.id}</td>
			<td>${good.model.name}</td>
			<td>${good.model.type.name}</td>
			<td><img src="${good.model.photo}" alt="${
			good.model.name
		}" style="width: 200px; height: 200px;"></td>
			<td>${locationText}</td>
			<td>${statusText}
				<br/><small id="date-sent-${good.id}"></small>
				<br/><small id="shipping-status-${good.id}">${shippingStatusText}</small>
			</td>
			<td>
				<div class="dropdown">
					<button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton${
						good.model.id
					}" data-bs-toggle="dropdown" aria-expanded="false">
						Choisir une action
					</button>
					<ul class="dropdown-menu" aria-labelledby="dropdownMenuButton${good.model.id}">
						<li><a class="dropdown-item view-units" href="#" data-model-id="${
							good.model.id
						}">Voir les unités disponibles</a></li>
						${
							namePermission !== "rental-manager"
								? `<li><a class="dropdown-item edit-good" href="#" data-good-id="${good.id}">Modifier les données</a></li>`
								: ""
						}
						${
							namePermission === "stockman" &&
							good.location === "stock_stockman"
								? `<li><a class="dropdown-item send-equipment" href="#" data-good-id="${good.id}">Envoyer l'équipement</a></li>`
								: ""
						}
						${namePermission === "rental-manager" && good.shipping_status === "send_to_manager" ? `<li><a class="dropdown-item confirm-receiving" href="#" data-good-id="${good.id}">Confirmer la réception</a></li>` : ""}
					</ul>
				</div>
			</td>
		`;
		tableBody.appendChild(row);
	});

	document.querySelectorAll(".send-equipment").forEach((button) => {
		button.addEventListener("click", function (event) {
			event.preventDefault();
			const goodId = event.target.getAttribute("data-good-id");
			if (confirm("envoyer l'équipement?")) {
				sendEquipment(goodId);
			}
		});
	});

	document.querySelectorAll(".confirm-receiving").forEach((button) => {
		button.addEventListener("click", function (event) {
			event.preventDefault();
			const goodId = event.target.getAttribute("data-good-id");
			if (confirm("Confirmer la réception?")) {
				confirmReceiving(goodId);
			}
		});
	});
}

async function sendEquipment(goodId) {
	try {
		const response = await apiGoods.sendEquipment(goodId);
		if (response.success) {
			alert(response.message);
			const dateSentElement = document.getElementById(`date-sent-${goodId}`);
			const shippingStatusElement = document.getElementById(
				`shipping-status-${goodId}`
			);
			const currentDate = new Date().toLocaleDateString();
			dateSentElement.textContent = `Sent on: ${currentDate}`;
			shippingStatusElement.textContent = "envoyé au manager";
			if (namePermission === "rental-manager") {
				const confirmReceivingButton = document.createElement("a");
				confirmReceivingButton.href = "#";
				confirmReceivingButton.className = "dropdown-item confirm-receiving";
				confirmReceivingButton.textContent = "Confirmer la réception";
				confirmReceivingButton.setAttribute("data-good-id", goodId);
				confirmReceivingButton.addEventListener("click", function (event) {
					event.preventDefault();
					if (confirm("Confirmer la réception?")) {
						confirmReceiving(goodId);
					}
				});
				document
					.querySelector(`#dropdownMenuButton${goodId}`)
					.parentNode.querySelector(".dropdown-menu")
					.appendChild(confirmReceivingButton);
			}
		} else {
			alert("Ошибка при отправке оборудования: " + response.message);
		}
	} catch (error) {
		alert("Ошибка при отправке оборудования: " + error);
	}
}

async function confirmReceiving(goodId) {
	try {
		const response = await apiGoods.confirmReceiving(goodId);
		if (response.success) {
			alert(response.message);
			const shippingStatusElement = document.getElementById(
				`shipping-status-${goodId}`
			);
			shippingStatusElement.textContent = "reçu par le manager";
		} else {
			alert("Ошибка при подтверждении получения: " + response.message);
		}
	} catch (error) {
		alert("Ошибка при подтверждении получения: " + error);
	}
}

function updatePaginationControls(totalItems) {
	const totalPages = Math.ceil(totalItems / itemsPerPage);
	document.getElementById(
		"pageInfo"
	).textContent = `Page ${currentPage} of ${totalPages}`;

	document.getElementById("prevPageBtn").disabled = currentPage === 1;
	document.getElementById("nextPageBtn").disabled = currentPage === totalPages;
}

document.getElementById("prevPageBtn").addEventListener("click", () => {
	if (currentPage > 1) {
		currentPage--;
		loadGoodsData();
	}
});

document.getElementById("nextPageBtn").addEventListener("click", () => {
	currentPage++;
	loadGoodsData();
});

document.addEventListener("click", function (event) {
	if (event.target.classList.contains("view-units")) {
		event.preventDefault();
		const modelId = event.target.getAttribute("data-model-id");
		showUnitsModal(modelId);
	} else if (event.target.classList.contains("edit-good")) {
		event.preventDefault();
		const goodId = event.target.getAttribute("data-good-id");
		showEditModal(goodId);
	}
});

async function showUnitsModal(modelId) {
	try {
		const units = await apiGoods.getUnitsByModelId(modelId);
		displayUnitsModal(units);
	} catch (error) {
		console.error("Error fetching units:", error);
	}
}

function displayUnitsModal(units) {
	const modalBody = document.querySelector("#unitsModal .modal-body");
	modalBody.innerHTML = `
		<table class="table">
			<thead>
				<tr>
					<th>Date d'ajout</th>
					<th>Numéro de série</th>
					<th>Statut de location</th>
				</tr>
			</thead>
			<tbody>
				${units
					.map(
						(unit) => `
					<tr>
						<td>${unit.added_date}</td>
						<td>${unit.serial_number}</td>
						<td>${unit.status_name}</td>
					</tr>
				`
					)
					.join("")}
			</tbody>
		</table>
	`;

	const unitsModal = new Modal(document.getElementById("unitsModal"));
	unitsModal.show();
}

async function loadCategories(selectElementId) {
	const categorySelect = document.getElementById(selectElementId);
	categorySelect.innerHTML = "";

	try {
		const categories = await categoryApi.getCategories();
		categories.forEach((category) => {
			const option = document.createElement("option");
			option.value = category.id_type;
			option.textContent = category.name;
			categorySelect.appendChild(option);
		});
		return categories;
	} catch (error) {
		console.error("Ошибка при загрузке категорий:", error);
	}
}

async function renderEquipmentOrder(userData) {
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
	loadCategories("categoryName");
	if (userData.name_permission === "stockman") {
		const titleAddingOrdersMarkup = `<h2>Ajout du nouvel équipement</h2>`;
		const markup = `
					<div class="mb-4">
							<button class="btn btn-custom" data-bs-toggle="modal" data-bs-target="#addEquipmentModal">Ajouter un équipement</button>
							<button class="btn btn-secondary" data-bs-toggle="modal" data-bs-target="#addCategoryModal">Ajouter une catégorie</button>
					</div>
			`;
		titleAddingOrders.innerHTML = titleAddingOrdersMarkup;
		addingEquipmentContainer.innerHTML = markup;
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
		const listOrdersTitleMarkup = `<h2>Attribution de l'équipement</h2>`;

		orderEquipmentContainer.innerHTML = markup;
		titleOrders.innerHTML = titleOrdersMarkup;
		listOrdersTitle.innerHTML = listOrdersTitleMarkup;
		try {
			const сategories = await loadCategories("categoryName");

			document
				.getElementById("equipmentRequestForm")
				.addEventListener("submit", function (event) {
					event.preventDefault();

					const equipmentName = document.getElementById("equipmentName").value;
					const quantity = document.getElementById("quantity").value;
					const comments = document.getElementById(
						"equipmentDescription"
					).value;
					const id_type = document.getElementById("categoryName").value;
					const requestData = {
						modelName: equipmentName,
						comments,
						quantity: parseInt(quantity, 10),
						id_type: id_type,
					};

					apiEquipmentRequest
						.createEquipmentRequestFromManager(requestData)
						.then((data) => {
							alert("Запрос на оборудование успешно отправлен!");
						})
						.catch((error) => {
							console.error("Error:", error);
							alert("Ошибка при отправке запроса на оборудование");
						});
				});
		} catch (error) {
			console.error("Ошибка при загрузке категорий:", error);
		}
	}
}

const addCategoryModalElement = document.getElementById("addCategoryModal");
const addCategoryModal = new Modal(addCategoryModalElement);
async function saveCategory() {
	const name = document.getElementById("newCategoryName").value;

	try {
		const data = await categoryApi.addCategory({ categoryName: name });
		if (data.success) {
			alert(data.message);
			document.getElementById("newCategoryName").value = "";
			addCategoryModal.hide();
			loadGoodsData();
		} else {
			alert(data.message);
		}
	} catch (error) {
		console.error("Ошибка:", error);
	}
}

document
	.getElementById("saveCategoryBtn")
	.addEventListener("click", saveCategory);

// adding new equipment
const addEquipmentModalElement = document.getElementById("addEquipmentModal");
const addEquipmentModal = new Modal(addEquipmentModalElement);
document
	.getElementById("saveEquipmentBtn")
	.addEventListener("click", saveEquipment);
document.getElementById("brandName").addEventListener("input", searchBrands);
document
	.getElementById("brandName")
	.addEventListener("change", autoFillModelName);

async function searchBrands() {
	const brandInput = document.getElementById("brandName");
	const query = brandInput.value;
	const response = await brandApi.searchBrands(query);

	const suggestions = document.getElementById("brandSuggestions");
	suggestions.innerHTML = "";

	response.forEach((brand) => {
		const suggestion = document.createElement("a");
		suggestion.href = "#";
		suggestion.classList.add("list-group-item", "list-group-item-action");
		suggestion.textContent = brand.name;
		suggestion.onclick = () => {
			brandInput.value = brand.name;
			suggestions.innerHTML = "";
			autoFillModelName();
		};
		suggestions.appendChild(suggestion);
	});
}

async function saveEquipment() {
	const form = document.getElementById("addEquipmentForm");
	if (form.checkValidity() === false) {
		form.reportValidity();
		return;
	}

	const modelName = document.getElementById("equipmentName").value;
	const id_type = document.getElementById("categoryName").value;
	const brandName = document.getElementById("brandName").value;
	const description = document.getElementById("equipmentDescription").value;
	const serial_number = document.getElementById("serialNumber").value;
	const photoFile = document.getElementById("equipmentPhoto").files[0];

	let brandId = await fetchBrandIdByName(brandName);
	if (!brandId) {
		brandId = await addNewBrand(brandName);
	}

	let photoUrl = "";
	if (photoFile) {
		const uploadData = await uploadApi.uploadPhoto(photoFile);
		if (uploadData.success) {
			photoUrl = uploadData.url;
		} else {
			throw new Error(uploadData.message);
		}
	}
	try {
		const data = await apiGoods.createGood({
			modelName,
			statusId: 1,
			serialNumbers: [serial_number],
			id_type,
			brandName,
			description,
			photo: photoUrl,
			location: "stock_stockman",
		});

		if (data.success) {
			alert("Équipement ajouté avec succès!");
			form.reset();
			addEquipmentModal.hide();
			loadGoodsData();
		} else {
			alert("Erreur: " + data.message);
		}
	} catch (error) {
		console.error("Erreur:", error);
		alert("Erreur lors de l'ajout de l'équipement.");
	}
}

async function fetchBrandIdByName(brandName) {
	const brand = await brandApi.searchBrands(brandName);
	return brand.id || null;
}

async function addNewBrand(brandName) {
	const data = await brandApi.getOrCreateBrand({ name: brandName });
	return data.id;
}

function autoFillModelName() {
	const brandName = document.getElementById("brandName").value;
	const modelNameInput = document.getElementById("equipmentName");
	if (!modelNameInput.value) {
		modelNameInput.value = brandName;
	}
}

async function showEditModal(goodId) {
	const good = await apiGoods.getGoodById(goodId);
	const categories = await categoryApi.getCategories();
	const editModalBody = document.querySelector("#editModal .modal-body");

	editModalBody.innerHTML = `
			<form id="editGoodForm">
					<div class="form-group">
							<label for="editModelName">Nom de modèle</label>
							<input type="text" class="form-control" id="editModelName" value="${
								good.model.name
							}">
					</div>
					<div class="form-group">
							<label for="editBrandName">Nom de marque</label>
							<input type="text" class="form-control" id="editBrandName" value="${
								good.model.brand.name
							}">
					</div>
					<div class="form-group">
							<label for="editCategoryName">Catégorie</label>
							<select class="form-control" id="editCategoryName">
								${categories
									.map(
										(category) =>
											`<option value="${category.id}">${category.name}</option>`
									)
									.join("")}
							</select>
					</div>
					<div class="form-group">
							<label for="editPhoto">Photo</label>
							<input type="text" class="form-control" id="editPhoto" value="${
								good.model.photo
							}">
							<input type="file" class="form-control" id="editPhotoFile">
							<button type="button" class="btn btn-secondary mt-2" id="uploadPhotoBtn">Upload Photo</button>
					</div>
					<button type="submit" class="btn btn-primary mt-3 custom-modify">Enregistrer les modifications</button>
			</form>
	`;

	const editModal = new Modal(document.getElementById("editModal"));
	editModal.show();

	document
		.getElementById("editGoodForm")
		.addEventListener("submit", async function (event) {
			event.preventDefault();

			const photoValue = document.getElementById("editPhoto").value;
			const categoryValue = document.getElementById("editCategoryName").value;
			const updatedGood = {
				id_good: goodId,
				modelName: document.getElementById("editModelName").value,
				id_type:
					categoryValue !== "undefined" ? categoryValue : good.model.type.id,
				brandName: document.getElementById("editBrandName").value,
				photo: photoValue !== "null" ? photoValue : good.model.photo,
			};

			try {
				await apiGoods.updateGood(updatedGood);
				editModal.hide();
				loadGoodsData();
			} catch (error) {
				console.error("Error updating good:", error);
				alert("Erreur lors de la mise à jour des données");
			}
		});

	document
		.getElementById("uploadPhotoBtn")
		.addEventListener("click", async function () {
			const photoFile = document.getElementById("editPhotoFile").files[0];
			if (photoFile) {
				try {
					const uploadData = await uploadApi.uploadPhoto(photoFile);
					if (uploadData.success) {
						document.getElementById("editPhoto").value = uploadData.url;
						alert("Photo uploaded successfully!");
					} else {
						alert("Error uploading photo: " + uploadData.message);
					}
				} catch (error) {
					console.error("Error uploading photo:", error);
					alert("Erreur lors du téléchargement de la photo");
				}
			} else {
				alert("Please select a photo to upload.");
			}
		});
}

function initRadioBtns() {
	const typeFilter = document.getElementById("type-filter");

	typeFilter.addEventListener(
		"click",
		debounce(function (event) {
			const clickedCategoryItemNode = event.target.closest(".list-group-item");

			categoryItemNodes.forEach((item) => item.classList.remove("active"));
			clickedCategoryItemNode.classList.add("active");

			loadGoodsData();
		}, 200)
	);
}

function getActiveCategory() {
	const activeCategoryItemNode = categoryItemNodes.filter((node) =>
		node.classList.contains("active")
	)[0];

	if (activeCategoryItemNode === undefined) return "";
	if (activeCategoryItemNode.dataset.type === "all") return "";

	return activeCategoryItemNode.dataset.type;
}

function initSearchListener() {
	if (searchInputNode === null) throw new Error("not found searchInputNode");

	searchInputNode.addEventListener(
		"input",
		debounce(() => {
			loadGoodsData();
		}, 200)
	);
}

const backArrowContainer = document.getElementById("backArrowContainer");

if (backArrowContainer) {
	const backArrow = document.createElement("a");
	backArrow.href = "javascript:history.back()";
	backArrow.className = "back-arrow";
	backArrow.innerHTML =
		'<i class="fas fa-arrow-left"></i> Retour à la page d\'accueil';
	backArrowContainer.appendChild(backArrow);
}

const logoutButton = document.getElementById("logoutButton");

if (logoutButton) {
	logoutButton.addEventListener("click", function (event) {
		event.preventDefault();
		logout();
	});
}

function logout() {
	localStorage.removeItem("authToken");
	localStorage.removeItem("id_user");

	window.location.href = "/";
}
