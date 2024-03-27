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

document.addEventListener('DOMContentLoaded', function () {
    const filterUser = document.getElementById('filterUser');
    const filterEquipment = document.getElementById('filterEquipment');
    const filterStatus = document.getElementById('filterStatus');

    function fetchData() {
        const selectedUsers = Array.from(filterUser.selectedOptions).map(option => option.value).join(',');
        const selectedEquipments = Array.from(filterEquipment.selectedOptions).map(option => option.value).join(',');
        const selectedStatuses = Array.from(filterStatus.selectedOptions).map(option => option.value).join(',');

        // Пример URL, который может быть использован для запроса к серверу
        // Необходимо адаптировать URL и параметры в соответствии с вашим API
        const url = `/api/reservations?users=${selectedUsers}&equipments=${selectedEquipments}&status=${selectedStatuses}`;

        fetch(url)
            .then(response => response.json())
            .then(data => updateTable(data))
            .catch(error => console.error('Error fetching data:', error));
    }

    function updateTable(data) {
        const tbody = document.querySelector('#reservationsTable tbody');
        tbody.innerHTML = ''; // Очищаем текущее содержимое таблицы

        // Создаем новые строки таблицы на основе полученных данных
        data.forEach(rowData => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${rowData.id}</td>
                <td>${rowData.user}</td>
                <td>${rowData.equipment}</td>
                <td>${rowData.startDate}</td>
                <td>${rowData.endDate}</td>
                <td>${rowData.status}</td>
                <td><button class="btn btn-primary">Détails</button></td>
            `;
            tbody.appendChild(tr);
        });
    }

    [filterUser, filterEquipment, filterStatus].forEach(filter => {
        filter.addEventListener('change', fetchData);
    });
});

document.addEventListener('DOMContentLoaded', () => {
    let sortOrder = {
        'id': true,
        'user': true,
        'startDate': true,
        'endDate': true,
        'status': true
    };

    function sortTable(column, dataType) {
        const tbody = document.querySelector('#reservationsTable tbody');
        const rows = Array.from(tbody.querySelectorAll('tr'));

        let sortedRows;
        if (column === 'status') {
            sortedRows = sortByStatus(rows, sortOrder[column]);
        } else {
            sortedRows = rows.sort((a, b) => {
                let aValue, bValue;
                if (dataType === 'number') {
                    aValue = Number(a.dataset[column]);
                    bValue = Number(b.dataset[column]);
                } else if (dataType === 'date') {
                    aValue = new Date(a.dataset[column]);
                    bValue = new Date(b.dataset[column]);
                } else {
                    aValue = a.dataset[column].toLowerCase();
                    bValue = b.dataset[column].toLowerCase();
                }

                return sortOrder[column] ? (aValue - bValue) : (bValue - aValue);
            });
        }

        // Переключаем направление сортировки для следующего клика
        sortOrder[column] = !sortOrder[column];

        // Обновляем DOM
        tbody.innerHTML = '';
        sortedRows.forEach(row => tbody.appendChild(row));
    }

    function sortByStatus(rows, ascending) {
		// Определение приоритетов статусов
		const statusPriority = ascending ? {
			'Actif': 1,
			'En attente': 2,
			'Annulé': 3
		} : {
			'Annulé': 1,
			'En attente': 2,
			'Actif': 3
		};

		return rows.sort((a, b) => {
			const priorityA = statusPriority[a.dataset.status] || 999;
			const priorityB = statusPriority[b.dataset.status] || 999;
			return priorityA - priorityB;
		});
	}

    document.getElementById('sortById').addEventListener('click', () => sortTable('id', 'number'));
    document.getElementById('sortByUser').addEventListener('click', () => sortTable('user', 'text'));
    document.getElementById('sortByStartDate').addEventListener('click', () => sortTable('startdate', 'date'));
    document.getElementById('sortByEndDate').addEventListener('click', () => sortTable('enddate', 'date'));
    document.getElementById('sortByStatus').addEventListener('click', () => sortTable('status', 'text'));


    // Всплывающие подсказки для кнопок сортировки
    document.querySelectorAll('.btn-link').forEach(btn => {
        btn.addEventListener('mouseenter', (e) => {
            const sortType = e.target.closest('th').textContent.trim();
            e.target.title = `Sort by ${sortType}`;
        });
    });
});
