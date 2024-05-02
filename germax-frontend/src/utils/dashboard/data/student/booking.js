function setupCategoryFilterEventListener() {
	const typeFilter = document.getElementById("type-filter");
	console.log("Setup category filter event listener.");
	if (typeFilter) {
		typeFilter.addEventListener("click", function(e) {
			if (e.target.tagName === "A") {
				const category = e.target.getAttribute("data-type");
				console.log(`Fetching data for category: ${category}`);
				fetch(`http://germax-api/goods?category=${category}`)
					.then(response => {
						if (!response.ok) {
							console.error("Response status:", response.status);
							return response.json().then(error => {
								throw new Error(`Error from server: ${error.error}`);
							});
						}
						return response.json();
					})
					.then(data => displayEquipment(data))
					.catch(error => console.error("Error loading data: ", error));
			}
		});
	} else {
		console.error("Type-filter element not found");
	}
}

async function setupModelSearchEventListener() {
	const searchButton = document.getElementById("search-button");
	const modelSearchInput = document.getElementById("model-search");
	const equipmentList = document.getElementById("equipment-list");

	console.log("Model search event listener setup.");

	if (searchButton && modelSearchInput) {
			searchButton.addEventListener("click", async () => {
					const modelName = modelSearchInput.value.trim();
					if (modelName) {
							console.log(`Fetching data for model: ${modelName}`);
							try {
									const response = await fetch(`http://germax-api/goods?modelName=${encodeURIComponent(modelName)}`);
									if (!response.ok) {
											throw new Error(`HTTP status ${response.status}`);
									}
									const data = await response.json();
									if (data && data.success) {
											displayModelData(data.data);
									} else {
											equipmentList.innerHTML = '<p>Модель не найдена.</p>';
									}
							} catch (error) {
									console.error("Error loading model data: ", error);
									equipmentList.innerHTML = `<p>Ошибка при загрузке данных: ${error.message}</p>`;
							}
					} else {
							equipmentList.innerHTML = '<p>Введите название модели.</p>';
					}
			});
	} else {
			console.error("Search button or model search input not found");
	}
}


function displayEquipment(data) {
	const equipmentList = document.getElementById("equipment-list");
	equipmentList.innerHTML = ""; // Очистка предыдущих данных
	data.data.forEach((item) => {
		const itemElement = document.createElement("div");
		itemElement.innerHTML = `
					<h2>${item.model.name}</h2>
					<p>${item.model.description}</p>
					<img src="${item.model.photo}" alt="Фото ${item.model.name}" style="width: 100%;">
			`;
		equipmentList.appendChild(itemElement);
	});
}

function displayModelData(models) {
	const equipmentList = document.getElementById("equipment-list");
	equipmentList.innerHTML = ''; // Очистка списка оборудования перед отображением новых данных
	const seenModels = new Set(); // Используем Set для отслеживания уникальных имен моделей

	models.forEach(model => {
			if (!seenModels.has(model.model_name)) {
					seenModels.add(model.model_name); // Добавляем имя модели в Set
					const modelElement = document.createElement('div');
					modelElement.className = 'model-details';
					modelElement.innerHTML = `
							<h3>${model.model_name}</h3>
							<p>${model.model_description}</p>
							<img src="${model.model_photo || 'default-image.png'}" alt="${model.model_name}" style="width: 100%;">
					`;
					equipmentList.appendChild(modelElement);
			}
	});
}



export { setupCategoryFilterEventListener, setupModelSearchEventListener };
