import './index.css';
import Modal from "bootstrap/js/dist/modal";

document.addEventListener('DOMContentLoaded', () => {
    const generateReportButton = document.querySelector('button[data-bs-toggle="modal"]');
    const generateReportModal = new Modal(document.getElementById('generateReportModal'));

    generateReportButton.addEventListener('click', () => {
        generateReportModal.show();
    });

});
