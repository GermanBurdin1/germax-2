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

export { setupCategoryFilterEventListener };
