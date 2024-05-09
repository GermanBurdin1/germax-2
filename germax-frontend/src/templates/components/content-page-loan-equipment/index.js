import { ApiGoods } from "../../../utils/classes/api-goods";
import { ApiAuth } from "../../../utils/classes/api-auth";
import { debounce } from "../../../utils/debounce";
import Modal from "bootstrap/js/dist/modal";
import "./index.css";
import { formDataToObject } from "../../../utils/form-data-to-object";
import { ApiRental } from "../../../utils/classes/api-rental";

const apiAuth = ApiAuth.getInstance();
const apiGoods = new ApiGoods();
const apiRental = new ApiRental();
const categoryItemNodes = Array.from(
    document.getElementsByClassName("list-group-item")
);
const searchInputNode = document.querySelector("#model-search");
const equipmentListNode = document.getElementById("equipment-list");
const timeDebounce = 200;

function initRadioBtns(authUser) {
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

async function getAllGoods() {
    const modelNameSearch = searchInputNode.value.trim();
    const typeNameSearch = getActiveCategory();

    return apiGoods.getAllGoods({
        typeName: typeNameSearch,
        modelName: modelNameSearch,
    });
}

async function getAllGoodsAndRender(authUser) {
    getAllGoods().then((goods) => {
        renderGoods(goods, authUser);
    });
}

function renderGoods(goods, authUser) {
    const uniqueGoods = getUniqueGoods(goods);

    equipmentListNode.innerHTML = "";

    const uniqueGoodNodes = uniqueGoods.map(
        uniqueGood => createOneGoodNode(uniqueGood, authUser)
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

function openReservationModal(event, good, authUser) {
    event.preventDefault();
    if (!authUser || !authUser.name_permission) {
        console.error("authUser is not defined or missing 'name_permission'");
        return;
    }

    const newLoanFormModalNode = document.getElementById("newLoanFormModal");

    if (newLoanFormModalNode === null) throw new Error("#newLoanFormModal not defined");

    const userPermissions = getUserPermissions(authUser);
    const newLoanFormModal = new Modal(newLoanFormModalNode);
    const modalTitle = document.querySelector("#newLoanFormModal .modal-title");
    const newLoanFormNode = newLoanFormModalNode.querySelector("form");
    const quantityInputNode = newLoanFormNode.querySelector("[name=quantity]");

    quantityInputNode.min = userPermissions.min;
    quantityInputNode.max = userPermissions.max;

    modalTitle.textContent = `Demande de location pour ${good.model.name}`;
    newLoanFormModal.show();

    newLoanFormNode.addEventListener("submit", (event) => {
        event.preventDefault();
        const formInfo = formDataToObject(newLoanFormNode);

        if (formInfo.dateStart > formInfo.dateEnd) throw new Error(
            "start date must be less than end date"
        );
        submitRentalRequest(good, formInfo);
    });
}

function createOneGoodNode(good, authUser) {
    const modelElement = document.createElement("div");
    const srcStr = `
        <img
            src="${good.model.photo || ""}"
            alt="${good.model.name}"
            style="width: 100%;"
        >
    `;

    modelElement.classList.add("model-details");
    modelElement.innerHTML = `
        <h3>${good.model.name}</h3>
        <p>${good.model.description}</p>
        ${good.model.photo !== null ? srcStr : ""}
        <button
            class="btn btn-primary reservation-modal-btn"
            data-bs-target="#newLoanFormModal"
        >
            Demander la réservation
        </button>
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

function getUserPermissions(user) {
    const userPermissions = {
        min: 1,
        max: 1
    };

    switch (user.name_permission) {
        case "student":
            userPermissions.max = 2;
            break;
        case "teacher":
            userPermissions.max = 10;
            break;
        default:
            userPermissions.max = 1;
    }

    return userPermissions;
}

function initMain() {
    apiAuth.fetchMeAuthUser().then(authUser => {
        if (!authUser || !authUser.name_permission) {
            console.error("Failed to fetch auth user or missing 'name_permission'");
            return;
        }

        getAllGoodsAndRender(authUser);
        initRadioBtns(authUser);
        initSearchListener(authUser);
    });
}

function submitRentalRequest(good, formInfo) {
	apiRental.createRequestRental(good, formInfo)
		.then((response) => {
			console.log("Rental request successful:", response);
		})
		.catch((error) => {
			console.error("Rental request failed:", error);
		});
}


initMain();

