import Dropdown from "bootstrap/js/dist/dropdown";

export function reinitializeDropdowns() {
	document.querySelectorAll(".dropdown-toggle").forEach((dropdownToggleEl) => {
		new Dropdown(dropdownToggleEl);
	});
}

export function updateActionButtonsForRow(row, archived) {
	const editButton = row.querySelector(".edit-reservation");
	const deleteButton = row.querySelector(".delete-action");
	const detailButton = row.querySelector(".view-details");
	const archiveButton = row.querySelector(".archive-action");
	const restoreButton = row.querySelector(".restore-action a");
	const resolveConflictAction = row.querySelector(".resolve-action");

	if (archived) {
		if (editButton) editButton.classList.add("d-none");
		if (detailButton) detailButton.classList.add("d-none");
		if (archiveButton) archiveButton.classList.add("d-none");
		if (resolveConflictAction) resolveConflictAction.classList.add("d-none");

		if (restoreButton) restoreButton.parentNode.classList.remove("d-none");
		if (deleteButton) deleteButton.classList.remove("d-none");
	} else {
		if (editButton) editButton.classList.remove("d-none");
		if (detailButton) detailButton.classList.remove("d-none");
		if (archiveButton) archiveButton.classList.remove("d-none");

		if (restoreButton) restoreButton.parentNode.classList.add("d-none");
		if (deleteButton) deleteButton.classList.add("d-none");
	}
}

export function getFormData(formId) {
	const formData = {};
	const form = document.getElementById(formId);

	const elements = form.elements;

	for (let i = 0; i < elements.length; i++) {
		const element = elements[i];

		if (element.tagName !== "BUTTON" && element.name) {
			formData[element.name] = element.value;
		}
	}

	return formData;
}
