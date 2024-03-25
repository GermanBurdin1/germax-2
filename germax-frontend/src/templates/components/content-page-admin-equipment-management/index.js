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

	document.getElementById('saveCategoryBtn').addEventListener('click', function() {
        const name = document.getElementById('categoryName').value;

        fetch('http://germax-api/src/controllers/add-category.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `name=${encodeURIComponent(name)}`,
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert(data.message);
                addCategoryModal.hide();
                document.getElementById('categoryName').value = '';
            } else {
                alert(data.message);
            }
        })
        .catch(error => console.error('Erreur:', error));
    });
});
