export function reinitializeDropdowns() {
    const dropdownElements = document.querySelectorAll('.dropdown-toggle');
    dropdownElements.forEach(dropdown => new bootstrap.Dropdown(dropdown));
    console.log("Dropdowns reinitialized.");
}

export function updateActionButtonsForRow(row, archived) {
    const archiveButton = row.querySelector(".archive-action");
    const restoreButton = row.querySelector(".restore-action");
    if (archived) {
        if (archiveButton) archiveButton.classList.add("d-none");
        if (restoreButton) restoreButton.classList.remove("d-none");
    } else {
        if (archiveButton) archiveButton.classList.remove("d-none");
        if (restoreButton) restoreButton.classList.add("d-none");
    }
}
