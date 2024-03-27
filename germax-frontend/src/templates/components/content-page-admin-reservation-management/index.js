import './index.css';
import Modal from "bootstrap/js/dist/modal";
import Collapse from "bootstrap/js/dist/collapse";

document.addEventListener('DOMContentLoaded', () => {
    const generateReportButton = document.querySelector('button[data-toggle="modal"]');
    const generateReportModal = new Modal(document.getElementById('generateReportModal'));

    generateReportButton.addEventListener('click', () => {
        generateReportModal.show();
    });

});

document.addEventListener('DOMContentLoaded', () => {
    const searchButton = document.querySelector('button[data-bs-toggle="collapse"]');
    let collapseElement = document.getElementById('searchConflictsSection');
    let collapse = new Collapse(collapseElement, {
        toggle: false // Это говорит о том, что Collapse не должен автоматически переключаться при инициализации
    });

    searchButton.addEventListener('click', () => {
        collapse.toggle(); // Это будет переключать видимость вашего collapse элемента
    });

    // Продолжение вашего кода с Modal...
});
