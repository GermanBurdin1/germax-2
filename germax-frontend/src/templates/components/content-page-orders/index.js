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
console.log("Auth token:", authToken);
if (authToken) {
	fetchAuthUser("http://germax-api/auth/me");
}

let currentPage = 1;
const itemsPerPage = 20;
loadGoodsData();
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
		})
		.catch((error) => {
			console.error("Failed to fetch data:", error);
		});
}

async function loadGoodsData(params = {}) {
	if (!params.statusNames) {
		params.statusNames = ["available", "unavailable", "booked", "cancelled"];
	}
	params.page = currentPage;
	params.limit = itemsPerPage;

	try {
		const response = await apiGoods.getAllGoods(params);
		const goods = response.goods.data; // Данные из API находятся под ключом "data"
		const totalItems = response.goods.totalItems;
		console.log(goods);
		console.log(totalItems);
		displayGoods(goods);
		updatePaginationControls(totalItems);
	} catch (error) {
		console.error("Ошибка при получении данных:", error);
	}
}


function displayGoods(goods) {
	console.log(goods);
	const tableBody = document.querySelector("#goodsTable tbody");
	tableBody.innerHTML = ""; // Очистка существующих строк

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

			const row = document.createElement("tr");
			row.innerHTML = `
					<td>${good.model.id}</td>
					<td>${good.model.name}</td>
					<td>${good.model.type.name}</td>
					<td><img src="${good.model.photo}" alt="${good.model.name}" style="width: 200px; height: 200px;"></td>
					<td>${statusText}</td>
					<td>
							<div class="dropdown">
									<button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton${good.model.id}"
											data-bs-toggle="dropdown" aria-expanded="false">
											Choisir une action
									</button>
									<ul class="dropdown-menu" aria-labelledby="dropdownMenuButton${good.model.id}">
											<li><a class="dropdown-item view-units" href="#" data-model-id="${good.model.id}">Voir les unités disponibles</a></li>
											<li><a class="dropdown-item" href="#">Modifier les données</a></li>
									</ul>
							</div>
					</td>
			`;
			tableBody.appendChild(row);
	});
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
		const modelId = event.target.getAttribute("data-model-id");
		showUnitsModal(modelId);
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
					})
					.catch((error) => {
						console.error("Error:", error);
						alert("Ошибка при отправке запроса на оборудование");
					});
			});
	}
}

const addCategoryModalElement = document.getElementById("addCategoryModal");
const addCategoryModal = new Modal(addCategoryModalElement);
async function saveCategory() {
	console.log(addCategoryModal);
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
	console.log("отправляемый объект" ,modelName, serial_number, id_type, brandName, photoUrl);
	try {
		const data = await apiGoods.createGood({
			modelName,
			statusId: 1,
			serialNumbers: [serial_number], // Wrapping in an array to use createGood
			id_type,
			brandName,
			description,
			photo: photoUrl,
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
