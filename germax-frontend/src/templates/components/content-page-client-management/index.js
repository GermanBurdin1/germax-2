import './index.css';
import Dropdown from "bootstrap/js/dist/dropdown";
import Modal from "bootstrap/js/dist/modal";

const dropdownElementList = [].slice.call(
	document.querySelectorAll(".dropdown-toggle")
);
const dropdownList = dropdownElementList.map(function (dropdownToggleEl) {
	return new Dropdown(dropdownToggleEl);
});

document.addEventListener("DOMContentLoaded", function () {
	// Инициализация модального окна
	const detailsModal = new Modal(document.getElementById("detailsClientModal"));

	// Обработка кликов по ссылкам для просмотра деталей
	document.querySelectorAll(".view-details").forEach((link) => {
			link.addEventListener("click", function (event) {
					event.preventDefault();

					// Заполнение модального окна данными
					const modalBody = document.querySelector("#detailsClientModal .modal-body");
					modalBody.innerHTML = `
							<div class="container pt-5">
									<div class="row justify-content-center">
											<div class="col-md-8">
													<div class="card mb-5">
															<div class="card-body p-5">
																	<div class="row">
																			<div class="col-md-8">
																					<h2 class="card-title mb-4">Informations du client</h2>
																					<p class="text-muted">Coordonnées: +33 1 23 45 67 89</p>
																					<p class="text-muted">Email: jean.dupont@example.com</p>
																					<p class="text-muted">Adresse: 123, rue de la République, Paris</p>
																					<a href="./modifyInfoClient.html" class="btn btn-primary mt-3">Mettre à jour</a>
																					<hr class="my-4">
																					<h4 class="mb-3">Détails de la location:</h4>
																					<p class="mb-2">Équipement loué: Appareil photo professionnel</p>
																					<p class="mb-2">Modèle: Canon EOS R5</p>
																					<p class="mb-2">Début de location: 01/07/2024</p>
																					<p class="mb-2">Fin de location: 31/07/2024</p>
																					<p class="mb-2">Temps restant: <strong>3 jours</strong></p>
																					<p class="mb-2">Statut de la location: <span class="badge badge-success">Active</span></p>
																					<button type="button" class="btn btn-warning mt-3">Prolonger la location</button>
																					<button type="button" class="btn btn-warning mt-3">Arrêter la location</button>
																			</div>
																			<div class="col-md-4 d-flex align-items-center justify-content-center">
																					<div class="client-photo bg-primary">
																							<i class="far fa-user"></i>
																					</div>
																			</div>
																	</div>
															</div>
													</div>
											</div>
									</div>
							</div>
					`;

					// Показываем модальное окно
					detailsModal.show();
			});
	});
});
