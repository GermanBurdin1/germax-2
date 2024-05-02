let allModelsData = [];
let currentBrand = ""; // Здесь будут храниться все загруженные данные моделей
let currentSearchQuery = ""; // Переменная для хранения текущего поискового запроса
let isBrandFilterActive = false; // Флаг для контроля активации фильтра по бренду

function setupCategoryFilterEventListener() {
	const typeFilter = document.getElementById("type-filter");
	console.log("Setup category filter event listener.");

	if (typeFilter) {
		typeFilter.addEventListener("click", function (e) {
			console.log("вызов функции setupCategoryFilterEventListener");
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
						console.log("Data received for category:", data);
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
			console.log(
				`Filtering data for category: ${category} and brand: ${currentBrand}`
			);
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

	console.log("Model search event listener setup.");

	if (searchButton && modelSearchInput) {
		searchButton.addEventListener("click", async () => {
			const modelName = modelSearchInput.value.trim();
			currentSearchQuery = modelName; // Сохраняем текущий поисковый запрос
			if (modelName) {
				isBrandFilterActive = true;
				console.log(`Fetching data for model: ${modelName}`);
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
	console.log("Полученные элементы для отображения:", items);
	const equipmentList = document.getElementById("equipment-list");
	equipmentList.innerHTML = ""; // Очистка предыдущих данных

	if (Array.isArray(items)) {
			items.forEach((item, index) => {
					const normalizedData = normalizeModelData(item);
					console.log(`Элемент ${index}:`, normalizedData);
					const itemElement = document.createElement("div");
					itemElement.innerHTML = `
							<h2>${normalizedData.name}</h2>
							<p>${normalizedData.description}</p>
							<img src="${normalizedData.photo}" alt="Фото ${normalizedData.name}" style="width: 100%;">`;
					equipmentList.appendChild(itemElement);
			});
			console.log("Конечное состояние equipmentList после добавления элементов:", equipmentList.innerHTML);
	} else {
			console.error("Полученные данные не являются массивом:", items);
			equipmentList.innerHTML = "<p>Данные не загружены или не в корректном формате.</p>";
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

export {
	setupCategoryFilterEventListener,
	setupModelSearchEventListener,
	setupBrandFilterEventListener,
};
