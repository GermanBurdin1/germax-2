let allModelsData = [];
let currentBrand = "";
let currentSearchQuery = "";
let isBrandFilterActive = false;

export function setupCategoryFilterEventListener() {
	const typeFilter = document.getElementById("type-filter");
	if (typeFilter) {
		typeFilter.addEventListener("click", function (e) {
			const target = e.target.closest("a[data-type]");
			if (target && !isBrandFilterActive) {
				const typeName = e.target.getAttribute("data-type");
				fetch(`http://germaloc-api/goods?typeName=${typeName}`)
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
						allModelsData = data.data;
						displayEquipment(data.data);
					})
					.catch((error) => console.error("Error loading data: ", error));
			}
		});
	} else {
		console.error("Type-filter element not found");
	}
}

export function setupBrandFilterEventListener() {
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

export async function setupModelSearchEventListener() {
	const searchButton = document.getElementById("search-button");
	const modelSearchInput = document.getElementById("model-search");
	const equipmentList = document.getElementById("equipment-list");

	if (searchButton && modelSearchInput) {
		searchButton.addEventListener("click", async () => {
			const modelName = modelSearchInput.value.trim();
			currentSearchQuery = modelName;
			if (modelName) {
				isBrandFilterActive = true;
				try {
					const response = await fetch(
						`http://germaloc-api/goods?modelName=${encodeURIComponent(modelName)}`
					);
					if (!response.ok) {
						throw new Error(`HTTP status ${response.status}`);
					}
					const data = await response.json();
					if (data && data.success) {
						allModelsData = data.data;
						if (data.data.length > 0) {
							currentBrand = data.data[0].model_brand_name;
						} else {
							currentBrand = "";
						}
						displayModelData(data.data);
					}
				} catch (error) {
					console.error("Error loading model data: ", error);
					equipmentList.innerHTML = `<p>Ошибка при загрузке данных: ${error.message}</p>`;
				}
			} else {
				isBrandFilterActive = false;
				equipmentList.innerHTML = "<p>Введите название модели.</p>";
			}
		});
	} else {
		console.error("Search button or model search input not found");
	}
}

export function displayEquipment(items) {
	const equipmentList = document.getElementById("equipment-list");
	equipmentList.innerHTML = "";
	const seenModels = new Set();
	if (Array.isArray(items)) {
		items.forEach((item) => {
			const normalizedData = normalizeModelData(item);
			if (!seenModels.has(normalizedData.id_model)) {
				seenModels.add(normalizedData.id_model);
				const itemElement = document.createElement("div");

				itemElement.innerHTML = `
					<br>
					<h2>${normalizedData.name}</h2>
					<p>${normalizedData.description}</p>
					<img src="${normalizedData.photo}" alt="Photo of ${normalizedData.name}" style="width: 100%;">
					<button class="btn btn-primary reservation-modal-btn" data-model-id="${normalizedData.id_model}" data-model-name="${normalizedData.name}" data-good-id="${normalizedData.id_good}">Demander la réservation</button><br>
				`;
				equipmentList.appendChild(itemElement);
			}
		});
	} else {
		console.error("Provided data is not an array:", items);
		equipmentList.innerHTML = "<p>Data not loaded or in incorrect format.</p>";
	}
}

export function displayModelData(models) {
	const equipmentList = document.getElementById("equipment-list");
	equipmentList.innerHTML = "";
	const seenModels = new Set();

	models.forEach((item) => {
		const model = item.model; // Здесь мы берем объект model из каждого item
		if (!seenModels.has(model.name)) {
			seenModels.add(model.name);
			const modelElement = document.createElement("div");
			modelElement.className = "model-details";
			modelElement.innerHTML = `
				<h3>${model.name}</h3>
				<p>${model.description}</p>
				<img
					src="${model.photo || "default-image.png"}"
					alt="${model.name}"
					style="width: 100%;"
				>
			`;
			equipmentList.appendChild(modelElement);
		}
	});
}

function normalizeModelData(item) {
	if (item.model && item.model.name) {
		return {
			id_good: item.id,
			id_model: item.model.id,
			name: item.model.name,
			description: item.model.description,
			photo: item.model.photo || "default-image.png",
		};
	} else {
		return {
			id: item.id_model,
			name: item.model_name,
			description: item.model_description,
			photo: item.model_photo || "default-image.png",
		};
	}
}

export function createAndAppendModalForTeachersOrStundents() {
		const modalHtml = `<div class="modal fade show" id="newLoanFormModal" tabindex="-1" aria-labelledby="loanFormModalLabel" aria-hidden="true">
		<div class="modal-dialog modal-lg">
			<div class="modal-content">
				<div class="modal-header">
					<h5 class="modal-title" id="loanFormModalLabel">Demande de location</h5>
					<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
				</div>
				<div class="modal-body">
					<form>
						<input type="hidden" id="modelId" value="ID_модели_здесь">  <!-- Скрытое поле для modelId -->
						<div class="mb-3">
							<label for="quantity" class="form-label">Quantité</label>
							<input type="number" class="form-control" id="quantity" placeholder="1">
						</div>
						<div class="mb-3">
							<label for="dateStart" class="form-label">Date de début</label>
							<input type="date" class="form-control" id="dateStart">
						</div>
						<div class="mb-3">
							<label for="dateEnd" class="form-label">Date de fin</label>
							<input type="date" class="form-control" id="dateEnd">
						</div>
						<div class="mb-3">
							<label for="comments" class="form-label">Commentaires</label>
							<textarea class="form-control" id="comments" rows="3"></textarea>
						</div>
					</form>
				</div>
				<div class="modal-footer">
					<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fermer</button>
					<button type="submit" class="btn btn-primary" id="confirmRentalButton">Confirmer la demande</button>
				</div>
			</div>
		</div>
		</div>
		</div>`;
	document.body.insertAdjacentHTML("beforeend", modalHtml);
}