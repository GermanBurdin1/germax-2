import { ApiGoods } from "../../../utils/classes/api-goods";
import { ApiAuth } from "../../../utils/classes/api-auth";
import { debounce } from "../../../utils/helpers/debounce";
import Modal from "bootstrap/js/dist/modal";
import "./index.css";
import { formDataToObject } from "../../../utils/helpers/form-data-to-object";
import { ApiRental } from "../../../utils/classes/api-rental";
import { ApiEquipmentRequest } from "../../../utils/classes/api-equipment-request";
import { ApiNotification } from "../../../utils/classes/api-notification";
import { ApiUsers } from "../../../utils/classes/api-users";
import { ApiSettings } from "../../../utils/classes/api-settings";

let newLoanFormModal = null;
let newLoanFormModalNode = null;
let requestNotFoundItemsModal = null;
let requestNotFoundItemsModalNode = null;

const apiAuth = ApiAuth.getInstance();
const apiGoods = new ApiGoods();
const apiRental = new ApiRental();
const apiEquipmentRequest = new ApiEquipmentRequest();
const apiNotification = new ApiNotification();
const apiUsers = new ApiUsers();
const apiSettings = new ApiSettings();

const categoryItemNodes = Array.from(
	document.getElementsByClassName("list-group-item")
);
const searchInputNode = document.querySelector("#model-search");
const equipmentListNode = document.getElementById("equipment-list");
const timeDebounce = 200;

function initFilterBtns(authUser) {
	const typeFilter = document.getElementById("type-filter");

	typeFilter.addEventListener(
		"click",
		debounce(function (event) {
			const clickedCategoryItemNode = event.target.closest(".list-group-item");

			categoryItemNodes.forEach((item) => item.classList.remove("active"));
			clickedCategoryItemNode.classList.add("active");

			getAllGoodsAndRender(authUser);
		}, timeDebounce)
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

async function getAllGoods(page = 1, limit = 20) {
	const modelNameSearch = searchInputNode.value.trim();
	const typeNameSearch = getActiveCategory();

	return apiGoods.getAllGoods({
		typeName: typeNameSearch,
		modelName: modelNameSearch,
		statusNames: ["available"],
		shippingStatus: "received_by_manager",
		page,
		limit,
	});
}


let currentPage = 1;
const itemsPerPage = 20;

async function getAllGoodsAndRender(authUser) {
	const response = await getAllGoods(currentPage, itemsPerPage);
	const goods = response.goods.data;
	const totalItems = response.goods.totalItems;
	renderGoods(goods, authUser);
	updatePaginationControls(totalItems);
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
		getAllGoodsAndRender(authUser);
	}
});

document.getElementById("nextPageBtn").addEventListener("click", () => {
	if (currentPage < totalPages) {
		currentPage++;
		getAllGoodsAndRender(authUser);
	}
});

function renderGoods(goods, authUser) {
	const availableGoods = goods.filter(
		(good) => good.status.name === "available" && good.shipping_status === "received_by_manager"
	);
	const uniqueGoods = getUniqueGoods(availableGoods);

	equipmentListNode.innerHTML = "";

	const uniqueGoodNodes = uniqueGoods.map((uniqueGood) =>
		createOneGoodNode(uniqueGood, authUser)
	);

	if (uniqueGoodNodes.length === 0) {
		equipmentListNode.innerHTML = "<h1>No goods found</h1>";
	} else {
		equipmentListNode.append(...uniqueGoodNodes);
	}
}


function getUniqueGoods(goods) {
	const uniqueNames = {};

	const uniqueModels = goods.filter((good) => {
		if (uniqueNames[good.model.name]) {
			return false;
		}
		uniqueNames[good.model.name] = true;
		return true;
	});

	return uniqueModels;
}

async function checkAvailableQuantity(event, good) {
	const quantityInputNode = event.target;
	const quantity = parseInt(quantityInputNode.value, 10);

	try {
		const response = await apiGoods.getAllGoods({ modelName: good.model.name });
		const goods = response.goods.data;

		const availableGoods = goods.filter((g) => {
			return g.status.id === 1;
		});

		const availableCount = availableGoods.length;

		if (quantity > availableCount) {
			alert(
				`Il n'y a pas assez d'unités disponibles. Unités disponibles : ${availableCount}`
			);
			quantityInputNode.value = Math.min(quantity, availableCount);
		}
	} catch (error) {
		console.error("Error checking available quantity:", error);
		alert(
			"Erreur lors de la vérification de la quantité disponible. Veuillez réessayer."
		);
	}
}

function openReservationModal(event, good, authUser) {
	event.preventDefault();
	if (!authUser || !authUser.name_permission) {
		console.error("authUser is not defined or missing 'name_permission'");
		return;
	}

	newLoanFormModalNode = document.getElementById("newLoanFormModal");

	if (newLoanFormModalNode === null)
		throw new Error("#newLoanFormModal not defined");

	const userPermissions = getUserPermissions(authUser);
	newLoanFormModal = new Modal(newLoanFormModalNode);
	const modalTitle = document.querySelector("#newLoanFormModal .modal-title");
	const newLoanFormNode = newLoanFormModalNode.querySelector("form");
	const quantityInputNode = newLoanFormNode.querySelector("[name=quantity]");

	quantityInputNode.min = userPermissions.min;
	quantityInputNode.max = userPermissions.max;
	quantityInputNode.addEventListener("input", (event) =>
		checkAvailableQuantity(event, good)
	);

	modalTitle.textContent = `Demande de location pour ${good.model.name}`;
	newLoanFormModal.show();

	newLoanFormNode.addEventListener("submit", async (event) => {
		event.preventDefault();
		const formInfo = formDataToObject(newLoanFormNode);

		if (formInfo.dateStart > formInfo.dateEnd)
			throw new Error("start date must be less than end date");
		try {
			submitRentalRequest(good, formInfo);

			// Создание уведомления для менеджера
			const managerMessage = `Un nouvel étudiant a fait une demande de location pour ${good.model.name}.`;
			const managers = await apiUsers.getUsersByPermission("rental-manager");

			for (const manager of managers) {
				await apiNotification.createNotification({
					userId: manager.id_user,
					title: "Nouvelle demande de location",
					message: managerMessage,
				});
			}
		} catch (error) {
			console.error("Error submitting rental request:", error);
		}
	});
}

let formSubmitHandler = null; // Сохраняем ссылку на обработчик

function openRequestNotFoundItemsModal(authUser, userPermissions) {
	if (!authUser || !authUser.name_permission) {
		console.error("authUser is not defined or missing 'name_permission'");
		return;
	}

	requestNotFoundItemsModalNode = document.getElementById(
		"requestNotFoundItemsModal"
	);
	if (requestNotFoundItemsModalNode === null) {
		throw new Error("#requestNotFoundItemsModal not defined");
	}

	requestNotFoundItemsModal = new Modal(requestNotFoundItemsModalNode);
	requestNotFoundItemsModal.show();
	const quantityInputNode =
		requestNotFoundItemsModalNode.querySelector("#quantity");
	quantityInputNode.min = userPermissions.min;
	quantityInputNode.max = userPermissions.max;

	const newLoanRequestFormNode =
		requestNotFoundItemsModalNode.querySelector("form");
	if (formSubmitHandler) {
		newLoanRequestFormNode.removeEventListener("submit", formSubmitHandler);
	}

	formSubmitHandler = (event) => {
		event.preventDefault();
		const formRequestItemInfo = formDataToObject(newLoanRequestFormNode);
		const categoryMapping = {
			laptops: 1,
			monitors: 2,
			smartphones: 3,
			accessories: 4,
			tablets: 5,
			vr_heads: 6,
		};

		formRequestItemInfo.id_type = categoryMapping[formRequestItemInfo.category];
		if (formRequestItemInfo.dateStart > formRequestItemInfo.dateEnd) {
			throw new Error("start date must be less than end date");
		}
		submitRentalNotFoundItemRequest(
			formRequestItemInfo,
			requestNotFoundItemsModal
		);
	};
	newLoanRequestFormNode.addEventListener("submit", formSubmitHandler);
}

function createOneGoodNode(good, authUser) {
	const modelElement = document.createElement("div");
	modelElement.setAttribute("data-good-id", good.id);
	const srcStr = `
        <div style="text-align: center;">
            <img
                src="${good.model.photo || ""}"
                alt="${good.model.name}"
                style="width: 200px; height: 200px; object-fit: cover;"
            >
        </div>
    `;

	modelElement.classList.add("model-details");
	modelElement.innerHTML = `
        <h3>${good.model.name}</h3>
        <p>${good.model.description}</p>
        ${good.model.photo !== null ? srcStr : ""}
        <div style="text-align: center; margin-top: 10px;">
            <button
                class="btn btn-primary reservation-modal-btn"
                data-bs-target="#newLoanFormModal"
            >
                Demander la réservation
            </button>
        </div>
    `;
	const reservationButton = modelElement.querySelector(
		".reservation-modal-btn"
	);
	reservationButton.addEventListener("click", (event) => {
		openReservationModal(event, good, authUser);
	});

	return modelElement;
}

function initSearchListener(authUser) {
	if (searchInputNode === null) throw new Error("not found searchInputNode");

	searchInputNode.addEventListener(
		"input",
		debounce(() => {
			getAllGoodsAndRender(authUser);
		}, timeDebounce)
	);
}

async function getUserPermissions(user) {
	const settings = await apiSettings.getSettings();

	const userPermissions = {
		min: 1,
		max: 1,
	};

	const setting = settings.find(
		(setting) => setting.id_permission === user.id_permission
	);
	if (setting) {
		userPermissions.max = setting.max_reservations;
	}
	return userPermissions;
}

function initMain() {
	apiAuth.fetchMeAuthUser().then(async (authUser) => {
		if (!authUser || !authUser.name_permission) {
			console.error("Failed to fetch auth user or missing 'name_permission'");
			return;
		}

		const userPermissions = await getUserPermissions(authUser);

		getAllGoodsAndRender(authUser);
		initFilterBtns(authUser);
		initSearchListener(authUser);
		initNotFoundItemsModalListener(authUser, userPermissions);
	});
}

function submitRentalRequest(good, formInfo) {
	apiRental
		.createRequestRental(good, formInfo)
		.then((response) => {
			alert("Votre demande de location a été enregistrée avec succès.");
			newLoanFormModal.hide();
			removeGoodFromList(good.id);
		})
		.catch((error) => {
			console.error("Rental request failed:", error);
			const errorMessage =
				error.message || "Échec de la demande de location. Veuillez réessayer.";
			alert(`Échec de la demande de location: ${errorMessage}`);
		});
}

function submitRentalNotFoundItemRequest(formInfo, requestNotFoundItemsModal) {
	apiEquipmentRequest
		.createEquipmentRequest(formInfo)
		.then((response) => {
			alert(
				"Votre demande de location a été enregistrée avec succès et envoyée au manager. Il vous répondra très bientôt"
			);
			requestNotFoundItemsModal.hide();
		})
		.catch((error) => {
			console.error("Rental request failed:", error);
			const errorMessage =
				error.message || "Échec de la demande de location. Veuillez réessayer.";
			alert(`Échec de la demande de location: ${errorMessage}`);
		});
}

function initNotFoundItemsModalListener(authUser, userPermissions) {
	const loansRequestButton = document.getElementById("request-button");
	if (loansRequestButton === null)
		throw new Error("loansRequest button not found");

	loansRequestButton.addEventListener("click", (event) => {
		event.preventDefault();
		openRequestNotFoundItemsModal(authUser, userPermissions);
	});
}

initMain();

const backArrowContainer = document.getElementById("backArrowContainer");

if (backArrowContainer) {
	const backArrow = document.createElement("a");
	backArrow.href = "javascript:history.back()";
	backArrow.className = "back-arrow";
	backArrow.innerHTML = '<i class="fas fa-arrow-left"></i> Retour à la page d\'accueil';
	backArrowContainer.appendChild(backArrow);
}

const logoutButton = document.getElementById("logoutButton");

if (logoutButton) {
	logoutButton.addEventListener("click", function (event) {
		event.preventDefault();
		logout();
	});
}

function removeGoodFromList(goodId) {
	const goodNode = document.querySelector(`[data-good-id="${goodId}"]`);
	if (goodNode) {
			goodNode.remove();
	}
}

function logout() {
	localStorage.removeItem("authToken");
	localStorage.removeItem("id_user");
	window.location.href = "/";
}
