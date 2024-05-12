import "./index.css";
import Collapse from "bootstrap/js/dist/collapse";

const filterUser = document.getElementById("filterUser");
const filterEquipment = document.getElementById("filterEquipment");
const filterStatus = document.getElementById("filterStatus");
const searchButton = document.querySelector(
	'button[data-bs-toggle="collapse"]'
);
let collapseElement = document.getElementById("searchConflictsSection");
let collapse = initializeCollapseElement(collapseElement);

function initializeCollapseElement(
	collapseElement,
	options = { toggle: false }
) {
	// console.log(
	// 	"Initialization Collapse pour l'élément:",
	// 	collapseElement
	// );
	return new Collapse(collapseElement, options);
}

searchButton.addEventListener("click", () => {
	collapse.toggle();
});
