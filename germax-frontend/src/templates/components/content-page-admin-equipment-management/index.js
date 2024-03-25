import './index.css';
import Modal from 'bootstrap/js/dist/modal';

document.addEventListener('DOMContentLoaded', function() {
    const addEquipmentButton = document.querySelector('#addEquipmentModal .btn-primary');
    const addCategoryButton = document.querySelector('#addCategoryModal .btn-primary');

    if (addEquipmentButton) {
        const addEquipmentModalElement = document.getElementById('addEquipmentModal');
        const addEquipmentModal = new Modal(addEquipmentModalElement);

        addEquipmentButton.addEventListener('click', function() {
            alert('Équipement ajouté avec succès!');
            addEquipmentModal.hide();
        });
    }

    if (addCategoryButton) {
        const addCategoryModalElement = document.getElementById('addCategoryModal');
        const addCategoryModal = new Modal(addCategoryModalElement);

        addCategoryButton.addEventListener('click', function() {
            alert('Catégorie ajoutée avec succès!');
            addCategoryModal.hide();
        });
    }
});
