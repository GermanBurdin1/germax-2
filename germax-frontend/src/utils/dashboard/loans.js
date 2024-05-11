export function returnClientLoans(rentals = []) {
	const rows = rentals
		.filter((rental) => rental.accord === false || rental.accord === 0) // Только заявки
		.map((rental) => {
			let statusMessage = "";

			if (rental.id_status === 4) {
				statusMessage = `requête effectuée le ${formatDate(rental.date_start)}`;
			}

			return `
				<tr data-id="${rental.id}">
					<td>${rental.id}</td>
					<td>${rental.model_name}</td>
					<td>${formatDate(rental.date_start)}</td>
					<td>${formatDate(rental.date_end)}</td>
					<td>${statusMessage}</td>
					<td>
						<div class="dropdown">
							<button class="btn btn-secondary dropdown-toggle" type="button"
									id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
								Choisir une action
							</button>
							<ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
								<li><a class="dropdown-item" href="#" data-bs-toggle="modal" data-bs-target="#communication-manager-modal">Contacter le manager</a></li>
							</ul>
						</div>
					</td>
				</tr>
			`;
		}).join('');

	return `
		<div class="nav nav-tabs" id="requestReservationTabs" role="tablist">
			<a class="nav-link active" id="active-reservations-tab" data-bs-toggle="tab" href="#activeRequestReservations"
				role="tab" aria-controls="activeRequestReservations" aria-selected="true">Réservations</a>
		</div>

		<div class="tab-content" id="requestReservationTabsContent">
			<div class="tab-pane fade show active" id="activeRequestReservations" role="tabpanel"
				aria-labelledby="active-request-reservations-tab">
				<div class="table-responsive">
					<table class="table" id="reservationsTable">
						<thead>
							<tr>
								<th data-column="id" data-type="number">ID Réservation <button
												class="btn btn-link p-0 border-0 sortButton"><i class="fas fa-sort"></i></button>
								</th>
								<th data-column="equipment" data-type="text">Équipement loué</th>
								<th data-column="startdate" data-type="date">Date de location<button
												class="btn btn-link p-0 border-0 sortButton"><i class="fas fa-sort"></i></button>
								</th>
								<th data-column="enddate" data-type="date">Date de retour<button
												class="btn btn-link p-0 border-0 sortButton"><i class="fas fa-sort"></i></button>
								</th>
								<th>Status</th>
								<th>Actions</th>
							</tr>
						</thead>
						<tbody>
							${rows}
						</tbody>
					</table>
				</div>
			</div>
		</div>

		<!-- Модальное окно для связи с менеджером -->
		<div class="modal fade" id="communication-manager-modal" tabindex="-1" aria-labelledby="communication-manager-modal-label" aria-hidden="true">
			<div class="modal-dialog modal-lg">
				<div class="modal-content">
					<div class="modal-header">
						<h5 class="modal-title" id="communication-manager-modal-label">Communication avec le gestionnaire d'inventaire</h5>
						<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
					</div>
					<div class="modal-body">
						<form id="communicationForm">
							<div class="form-group">
								<label for="communicationTopicSelect">Sujet de la communication</label>
								<select class="form-control" id="communicationTopicSelect">
									<option value="reservation-cancellation">Annulation de réservation</option>
									<option value="reservation-extension">Autre</option>
								</select>
							</div>
							<div class="form-group">
								<label for="communicationMessageText">Message</label>
								<textarea class="form-control" id="communicationMessageText" rows="3" placeholder="décrivez votre situation"></textarea>
							</div>
							<button type="submit" class="btn btn-primary">Envoyer</button>
						</form>
					</div>
					<div class="modal-footer">
						<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fermer</button>
					</div>
				</div>
			</div>
		</div>
	`;
}

export function returnRentalHistoryLoans(rentals = []) {
	const rows = rentals
		.filter((rental) => rental.accord === true || rental.accord === 1) // Только подтвержденные аренды
		.map((rental) => {
			let statusMessage = `loué le ${formatDate(rental.date_accord)}`;

			return `
				<tr data-id="${rental.id}">
					<td>${rental.id}</td>
					<td>${rental.model_name}</td>
					<td>${formatDate(rental.date_start)}</td>
					<td>${formatDate(rental.date_end)}</td>
					<td>${statusMessage}</td>
					<td>
						<div class="dropdown">
							<button class="btn btn-secondary dropdown-toggle" type="button"
									id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
								Choisir une action
							</button>
							<ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
								<li><a class="dropdown-item" href="#" data-bs-toggle="modal" data-bs-target="#change-loan-dates-modal">Contacter le manager</a></li>
							</ul>
						</div>
					</td>
				</tr>
			`;
		})
		.join("");

	return `
		<div class="nav nav-tabs" id="historyTabs" role="tablist">
			<a class="nav-link active" id="completed-reservations-tab" data-bs-toggle="tab" href="#completedReservations"
				role="tab" aria-controls="completedReservations" aria-selected="true">Historique de mes locations</a>
		</div>

		<div class="tab-content" id="rentalHistoryLink">
			<div class="tab-pane fade show active" id="completedReservations" role="tabpanel"
				aria-labelledby="completed-reservations-tab">
				<div class="table-responsive">
					<table class="table" id="historyTable">
						<thead>
							<tr>
								<th>ID Réservation</th>
								<th>Équipement loué</th>
								<th>Date de location</th>
								<th>Date de retour</th>
								<th>Status</th>
								<th>Actions</th>
							</tr>
						</thead>
						<tbody>
							${rows}
						</tbody>
					</table>
				</div>
			</div>
		</div>

		<!-- Модальное окно для связи с менеджером -->
		<div class="modal fade" id="change-loan-dates-modal" tabindex="-1" aria-labelledby="change-loan-dates-modal-label" aria-hidden="true">
			<div class="modal-dialog modal-lg">
				<div class="modal-content">
					<div class="modal-header">
						<h5 class="modal-title" id="change-loan-dates-modal-modal-label">Communication avec le gestionnaire d'inventaire</h5>
						<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
					</div>
					<div class="modal-body">
						<form id="communicationForm">
							<div class="form-group">
								<label for="communicationTopicSelect">Sujet de la communication</label>
								<select class="form-control" id="communicationTopicSelect">
									<option value="reservation-cancellation">Annulation de réservation</option>
									<option value="general-query">Question générale</option>
									<option value="reservation-cancellation">Annulation de réservation</option>
									<option value="reservation-extension">Extension de réservation</option>
									<option value="maintenance-status">Statut de maintenance</option>
									<option value="future-availability">Disponibilité future</option>
								</select>
							</div>
							<div class="form-group">
								<label for="communicationMessageText">Message</label>
								<textarea class="form-control" id="communicationMessageText" rows="3"></textarea>
							</div>
							<button type="submit" class="btn btn-primary">Envoyer</button>
						</form>
					</div>
					<div class="modal-footer">
						<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fermer</button>
					</div>
				</div>
			</div>
		</div>
	`
	;
}

function formatDate(date) {
	if (!date) return '';
	const d = new Date(date);
	const year = d.getFullYear();
	const month = (`0${d.getMonth() + 1}`).slice(-2);
	const day = (`0${d.getDate()}`).slice(-2);
	return `${year}-${month}-${day}`;
}



function returnLoanRequestModal() {
	return `<div class="modal fade" id="fullScreenModal" tabindex="-1" aria-labelledby="fullScreenModalLabel" aria-hidden="true">
	<div class="modal-dialog modal-fullscreen">
			<div class="modal-content">
					<div class="modal-header">
							<h5 class="modal-title" id="fullScreenModalLabel">Поиск и Фильтрация Оборудования</h5>
							<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
					</div>
					<div class="modal-body">
							<div class="jumbotron">
									<div class="input-group mb-3">
											<input type="text" class="form-control" id="model-search" placeholder="Rechercher par modèle">
											<div class="input-group-append">
													<button class="btn btn-outline-secondary" type="button" id="search-button">Rechercher</button>
											</div>
									</div>
									<div class="container-fluid">
											<div class="row">
													<div class="col-md-3">
															<div class="list-group" id="type-filter">
																	<a class="list-group-item list-group-item-action active" data-type="laptop">Ordinateurs portables</a>
																	<a class="list-group-item list-group-item-action" data-type="сomputer_monitor">Ecrans d'ordinateurs</a>
																	<a class="list-group-item list-group-item-action" data-type="smartphone">Smartphones</a>
																	<a class="list-group-item list-group-item-action" data-type="accessory">Accessoires</a>
																	<a class="list-group-item list-group-item-action" data-type="tablet">Tablettes</a>
																	<a class="list-group-item list-group-item-action" data-type="VR_headset">Casque VR</a>
															</div>
													</div>
													<div class="col-md-9">
															<div id="equipment-list">
																	<!-- Сюда будут загружаться результаты -->
															</div>
													</div>
											</div>
									</div>
							</div>
							<div class="jumbotron">
									<p class="lead">Vous n'avez pas trouvé ce dont vous avez besoin ?</p>
									<hr class="my-4">
									<p>Ici, vous pouvez rapidement et facilement envoyer une demande de location de l'équipement nécessaire au gestionnaire de l'entrepôt.</p>
									<a class="btn btn-primary btn-sm" id="loansRequest" href="#">Aller au formulaire</a>
							</div>
					</div>
					<div class="modal-footer">
							<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Закрыть</button>
					</div>
			</div>
	</div>
</div>
`;
}

function returnLoanFormModal() {
	return `<div class="modal fade show" id="loanFormModal" tabindex="-1" aria-labelledby="loanFormModalLabel" aria-hidden="true">
<div class="modal-dialog modal-lg">
	<div class="modal-content">
		<div class="modal-header">
			<h5 class="modal-title" id="loanFormModalLabel">Demande du matériel non trouvé</h5>
			<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
		</div>
		<div class="modal-body">
			<form>
				<div class="mb-3">
					<label for="equipmentCategory" class="form-label">Catégorie du matériel</label>
					<select class="form-select" id="equipmentCategory">
						<option>Ordinateurs portables</option>
						<option>Ecrans d'ordinateurs</option>
						<option>Smartphones/option>
						<option>Accessoires</option>
						<option>Tablettes</option>
						<option>Casques-VR</option>
					</select>
				</div>
				<div class="mb-3">
					<label for="modelInput" class="form-label">Commencez à rentrer le nom du modèle</label>
					<input type="text" class="form-control" id="modelInput" placeholder="Rentrez le nom du modèle">
				</div>
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
			<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Закрыть</button>
			<button type="submit" class="btn btn-primary">Envoyer la requête</button>
		</div>
	</div>
</div>
</div>
</div>`;
}
export { returnLoanRequestModal, returnLoanFormModal };
