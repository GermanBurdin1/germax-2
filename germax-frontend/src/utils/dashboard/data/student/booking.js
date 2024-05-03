import Modal from "bootstrap/js/dist/modal";

let allModelsData = [];
let currentBrand = ""; // Здесь будут храниться все загруженные данные моделей
let currentSearchQuery = ""; // Переменная для хранения текущего поискового запроса
let isBrandFilterActive = false; // Флаг для контроля активации фильтра по бренду

function setupCategoryFilterEventListener() {
	const typeFilter = document.getElementById("type-filter");
	if (typeFilter) {
		typeFilter.addEventListener("click", function (e) {
			const target = e.target.closest("a[data-type]");
			if (target && !isBrandFilterActive) {
				const category = e.target.getAttribute("data-type");
				// e.stopPropagation(); // Останавливаем всплывание события
				fetch(`http://germax-api/goods?category=${category}`)
					.then((response) => {
						if (!response.ok) {
							console.error("Response status:", response.status);
							return response.json().then((error) => {
								throw new Error(`Error from server: ${error.error}`);
							});
						}
						return response.json();
					})
					.then((data) => {
						allModelsData = data; // Сохраняем загруженные данные
						displayEquipment(data.data);
					})
					.catch((error) => console.error("Error loading data: ", error));
			}
		});
	} else {
		console.error("Type-filter element not found");
	}
}

function setupBrandFilterEventListener() {
	document.querySelectorAll("#type-filter a").forEach((button) => {
		button.addEventListener("click", (e) => {
			// e.stopPropagation(); // Остановим всплывание чтобы не вызвать лишние события
			const category = button.getAttribute("data-type");
			const filteredData = allModelsData.filter(
				(model) =>
					model.model_type_name === category &&
					model.model_brand_name === currentBrand &&
					model.model_name
						.toLowerCase()
						.includes(currentSearchQuery.toLowerCase())
			);
			displayEquipment(filteredData);
		});
	});
}

async function setupModelSearchEventListener() {
	const searchButton = document.getElementById("search-button");
	const modelSearchInput = document.getElementById("model-search");
	const equipmentList = document.getElementById("equipment-list");

	if (searchButton && modelSearchInput) {
		searchButton.addEventListener("click", async () => {
			const modelName = modelSearchInput.value.trim();
			currentSearchQuery = modelName; // Сохраняем текущий поисковый запрос
			if (modelName) {
				isBrandFilterActive = true;
				try {
					const response = await fetch(
						`http://germax-api/goods?modelName=${encodeURIComponent(modelName)}`
					);
					if (!response.ok) {
						throw new Error(`HTTP status ${response.status}`);
					}
					const data = await response.json();
					if (data && data.success) {
						allModelsData = data.data; // Обновляем данные моделей
						if (data.data.length > 0) {
							currentBrand = data.data[0].model_brand_name; // Сохраняем бренд первой найденной модели
						} else {
							currentBrand = ""; // Очищаем бренд, если данных нет
						}
						displayModelData(data.data);
					}
				} catch (error) {
					console.error("Error loading model data: ", error);
					equipmentList.innerHTML = `<p>Ошибка при загрузке данных: ${error.message}</p>`;
				}
			} else {
				isBrandFilterActive = false; // Отключаем фильтр по бренду
				equipmentList.innerHTML = "<p>Введите название модели.</p>";
			}
		});
	} else {
		console.error("Search button or model search input not found");
	}
}

function displayEquipment(items) {
	const equipmentList = document.getElementById("equipment-list");
	equipmentList.innerHTML = ""; // Очистка предыдущих данных
	const seenModels = new Set(); // Используем Set для отслеживания уникальных имен моделей

	if (Array.isArray(items)) {
		items.forEach((item, index) => {
			const normalizedData = normalizeModelData(item);
			// Проверяем, была ли уже такая модель добавлена
			if (!seenModels.has(normalizedData.name)) {
				seenModels.add(normalizedData.name); // Добавляем имя модели в Set
				const itemElement = document.createElement("div");
				itemElement.innerHTML = `
									<br>
									<h2>${normalizedData.name}</h2>
									<p>${normalizedData.description}</p>
									<img src="${normalizedData.photo}" alt="Фото ${normalizedData.name}" style="width: 100%;"><br><br>
									<button class="btn btn-primary reservation-modal-btn" data-model="${normalizedData.name}">Demander la réservation</button><br>`;
				equipmentList.appendChild(itemElement);
			}
		});
	} else {
		console.error("Полученные данные не являются массивом:", items);
		equipmentList.innerHTML =
			"<p>Данные не загружены или не в корректном формате.</p>";
	}
}

function displayModelData(models) {
	const equipmentList = document.getElementById("equipment-list");
	equipmentList.innerHTML = ""; // Очистка списка оборудования перед отображением новых данных
	const seenModels = new Set(); // Используем Set для отслеживания уникальных имен моделей

	models.forEach((model) => {
		if (!seenModels.has(model.model_name)) {
			seenModels.add(model.model_name); // Добавляем имя модели в Set
			const modelElement = document.createElement("div");
			modelElement.className = "model-details";
			modelElement.innerHTML = `
							<h3>${model.model_name}</h3>
							<p>${model.model_description}</p>
							<img src="${model.model_photo || "default-image.png"}" alt="${
				model.model_name
			}" style="width: 100%;">
					`;
			equipmentList.appendChild(modelElement);
		}
	});
}

function normalizeModelData(item) {
	// Проверяем, содержит ли элемент информацию в "model" или напрямую в элементе
	if (item.model && item.model.name) {
		// Структура с вложенным объектом model
		return {
			name: item.model.name,
			description: item.model.description,
			photo: item.model.photo || "default-image.png",
		};
	} else {
		// Плоская структура
		return {
			name: item.model_name,
			description: item.model_description,
			photo: item.model_photo || "default-image.png",
		};
	}
}

function setupNewReservationModalForTeachersAndStudentEventListeners() {
	// Установка обработчиков событий на кнопки после их добавления в DOM
	document.querySelectorAll('.reservation-modal-btn').forEach(button => {
			button.addEventListener('click', function() {
					const modelName = this.getAttribute('data-model');
					newLoanFormModal.show(); // Открывает модальное окно
					// Дополнительно обновите содержимое модального окна, если необходимо
					const modalTitle = document.querySelector('#newLoanFormModal .modal-title');
					modalTitle.textContent = `Demande de location pour ${modelName}`;
			});
	});
}

function returnNewLoanFormModalForTeachersOrStundents() {
	return `<div class="modal fade show" id="newLoanFormModal" tabindex="-1" aria-labelledby="loanFormModalLabel" aria-hidden="true">
<div class="modal-dialog modal-lg">
	<div class="modal-content">
		<div class="modal-header">
			<h5 class="modal-title" id="loanFormModalLabel">Demande de location</h5>
			<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
		</div>
		<div class="modal-body">
			<form>
				<div class="mb-3">
					<label for="quantity" class="form-label">Quantité</label>
					<input type="number" class="form-control" id="quantity" placeholder="1">
				</div>
				<div class="mb-3">
					<label for="rentalDates" class="form-label">Dates de location</label>
					<input type="text" class="form-control" id="rentalDates" placeholder="с 01.01.2024 по 10.01.2024">
				</div>
				<div class="mb-3">
					<label for="comments" class="form-label">Commentaires</label>
					<textarea class="form-control" id="comments" rows="3"></textarea>
				</div>
			</form>
		</div>
		<div class="modal-footer">
			<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fermer</button>
			<button type="submit" class="btn btn-primary">Confirmer la demande</button>
		</div>
	</div>
</div>
</div>
</div>`;
}

export {
	setupCategoryFilterEventListener,
	setupModelSearchEventListener,
	setupBrandFilterEventListener,
	returnNewLoanFormModalForTeachersOrStundents,
	setupNewReservationModalForTeachersAndStudentEventListeners,
};
