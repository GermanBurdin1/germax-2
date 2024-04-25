import "./index.css";

let offset = 0;
const limit = 10;

function loadModel(type = "") {
	fetch(
		`../../controllers/load-equipment.php?type=${type}&offset=${offset}&limit=${limit}`
	)
		.then((response) => response.json())
		.then((data) => {
			const container = document.getElementById("equipment-list");
			container.innerHTML = "";
			data.forEach((item) => {
				const modelItem = `<div class="card mb-3 equipment-item" data-id="${item.id_model}">
			<div class="row no-gutters">
			  <div class="col-md-4">
				<img src="${item.photo}" class="card-img" alt="${item.name}">
			  </div>
			  <div class="col-md-8">
				<div class="card-body">
				  <h5 class="card-title">${item.name}</h5>
				</div>
			  </div>
			</div>
		  </div>`;
				container.insertAdjacentHTML("beforeend", modelItem);
			});

			document.querySelectorAll(".equipment-item").forEach((card) => {
				card.addEventListener("click", function () {
					const id = this.getAttribute("data-id");
					redirectToDetails(id);
				});
			});
		})
		.catch((error) => {
			console.error("Erreur lors du chargement de l'équipement:", error);
		});
}

document.querySelectorAll("#type-filter .list-group-item").forEach((item) => {
	item.addEventListener("click", function (event) {
		event.preventDefault();
		const type = this.getAttribute("data-type");
		loadModel(type);

		document
			.querySelectorAll("#type-filter .list-group-item")
			.forEach((i) => i.classList.remove("active"));
		this.classList.add("active");
		offset = 0;
	});
});

loadModel();

document.getElementById("load-more").addEventListener("click", function () {
	const activeType = document
		.querySelector("#type-filter .list-group-item.active")
		.getAttribute("data-type");
	offset += limit;
	loadModel(activeType);
});

function redirectToDetails(id) {
	window.location.href = `./item.html.php?id=${id}`;
}
