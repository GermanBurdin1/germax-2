import { Modal } from "bootstrap";

// Функция для динамического создания и отображения модального окна
function showModal(type) {
    let modal = document.getElementById('dynamicModal');
    // Проверяем, есть ли уже такой элемент в DOM
    if (!modal) {
        // Если нет, создаем новый элемент
        modal = document.createElement('div');
        modal.id = 'dynamicModal';
        modal.classList.add('modal', 'fade');
        modal.tabIndex = -1;
        modal.setAttribute('role', 'dialog');
        modal.setAttribute('aria-labelledby', 'dynamicModalLabel');
        modal.setAttribute('aria-hidden', 'true');

        // Создаем внутреннее содержимое модального окна
        modal.innerHTML = `
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="dynamicModalLabel"></h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body"></div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    </div>
                </div>
            </div>
        `;

        // Добавляем элемент модального окна в конец документа
        document.body.appendChild(modal);
    }

    // Находим элементы внутри модального окна, куда будем вставлять заголовок и содержимое
    const title = modal.querySelector('.modal-title');
    const body = modal.querySelector('.modal-body');

    // Устанавливаем заголовок и содержимое в зависимости от типа модального окна
    switch (type) {
        case 'locations':
            title.textContent = 'Agenda de locations';
            body.innerHTML = '<p>Календарь событий будет здесь.</p>';
            break;
        case 'emprunteurs':
            title.textContent = 'Liste des Emprunteurs';
            body.innerHTML = '<p>Информация о арендаторах будет здесь.</p>';
            break;
    }

    // Используем Bootstrap 5 классы для работы с модальным окном
    const bsModal = new Modal(document.getElementById('dynamicModal'), {
        // Настройки, если они нужны
    });
    bsModal.show();
}

// Привязка событий к ссылкам
document.getElementById('locationsLink').addEventListener('click', function(e) {
    e.preventDefault();
    showModal('locations');
});

document.getElementById('emprunteursLink').addEventListener('click', function(e) {
    e.preventDefault();
    showModal('emprunteurs');
});
