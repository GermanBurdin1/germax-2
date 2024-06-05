export function returnClientLoans(rentals = [], requests = []) {
	console.log("Received rentals:", rentals);
	console.log("Received requests:", requests);

	// Объединяем обе коллекции в одну для удобства обработки
	const allEntries = [
		...rentals.map((rental) => {
			const processedRental = {
				...rental,
				type: "rental",
				id: rental.id !== undefined ? rental.id : rental.id_request,
				model_name:
					rental.model_name !== undefined
						? rental.model_name
						: rental.equipment_name,
				date_start: rental.date_start,
				date_end: rental.date_end,
				statusMessage:
					rental.id_status === 4
						? `requête effectuée le ${formatDate(rental.date_start)}`
						: "Status non défini",
			};
			console.log("Processed rental entry:", processedRental);
			return processedRental;
		}),
		...requests.map((request) => {
			const processedRequest = {
				...request,
				id: request.id_request !== undefined ? request.id_request : request.id,
				model_name:
					request.equipment_name !== undefined
						? request.equipment_name
						: request.model_name,
				date_start: request.date_start || "unknown date",
				date_end: request.date_end || "unknown date",
				statusMessage: request.treatment_status,
				type: "request",
				photo: request.photo,
			};
			console.log("Processed request entry:", processedRequest);
			return processedRequest;
		}),
	];

	const rows = allEntries
		.map((entry) => {
			let statusMessage;
			let photoHtml = "";
			let actionsMarkup = "";
			if (entry.type === "rental") {
				statusMessage = entry.statusMessage;
				if (entry.id_status === 4) {
					statusMessage = `requête effectuée le ${formatDate(
						entry.date_start
					)}`;
				}
				actionsMarkup = `
                <li><a class="dropdown-item" href="#" data-bs-toggle="modal" data-bs-target="#student-communication-manager-modal">Contacter le manager</a></li>
                <li><a class="dropdown-item" href="#" data-bs-toggle="modal" data-bs-target="#reverse-loan-modal">Annuler la réservation</a></li>
            `;
			} else if (entry.type === "request") {
				statusMessage = entry.treatment_status || "unknown status";
				if (entry.statusMessage === "rental_details_discussion_manager_user") {
					statusMessage = "en attente de votre confirmation";
					actionsMarkup = `
                    <li><a class="dropdown-item view-manager-proposal" href="#" data-id="${entry.id}">Voir la proposition du manager</a></li>
                `;
				} else if (
					entry.statusMessage === "treated_manager_user" ||
					entry.statusMessage === "rental_details_discussion_manager_stockman"
				) {
					statusMessage = "votre matériel est recherché";
					actionsMarkup = `
                    <li><a class="dropdown-item" href="#" data-bs-toggle="modal" data-bs-target="#request--communication-manager-modal">Contacter le manager</a></li>
                    <li><a class="dropdown-item" href="#" data-bs-toggle="modal" data-bs-target="#request--reverse-loan-modal">Annuler la réservation</a></li>
                `;
					if (entry.photo) {
						photoHtml = `<tr class="photo-row"><td colspan="6"><img src="${entry.photo}" alt="Photo de l'équipement" class="equipment-photo" style="width: 200px; height: 200px; object-fit: cover;"></td></tr>`;
					}
				} else if (entry.statusMessage === "closed_by_stockman") {
					statusMessage = "vous pouvez récupérer le matériel";
					actionsMarkup = `
                    <li><a class="dropdown-item" href="#" data-bs-toggle="modal" data-bs-target="#request--communication-manager-modal">Contacter le manager</a></li>
                    <li><a class="dropdown-item" href="#" data-bs-toggle="modal" data-bs-target="#request--reverse-loan-modal">Annuler la réservation</a></li>
                `;
					if (entry.photo) {
						photoHtml = `<tr class="photo-row"><td colspan="6"><img src="${entry.photo}" alt="Photo de l'équipement" class="equipment-photo"></td></tr>`;
					}
				} else {
					actionsMarkup = `
                    <li><a class="dropdown-item" href="#" data-bs-toggle="modal" data-bs-target="#student-communication-manager-modal">Contacter le manager</a></li>
                    <li><a class="dropdown-item" href="#" data-bs-toggle="modal" data-bs-target="#request--reverse-loan-modal">Annuler la réservation</a></li>
                `;
				}
			}

			return `
		<tr data-id="${entry.id}" data-type="${entry.type}">
    <td>${entry.id || "N/A"}</td>
    <td>${entry.model_name || "N/A"}</td>
    <td>${formatDate(entry.date_start) || "N/A"}</td>
    <td>${formatDate(entry.date_end) || "N/A"}</td>
    <td>${statusMessage}</td>
    <td>
        ${entry.photo ? `<img src="${entry.photo}" alt="Photo de l'équipement" class="equipment-photo" style="width: 100px; height: 100px; object-fit: cover;">` : "N/A"}
    </td>
    <td>
        <div class="dropdown">
            <button class="btn btn-secondary dropdown-toggle" type="button"
                id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                Choisir une action
            </button>
            <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                ${actionsMarkup}
            </ul>
        </div>
    </td>
</tr>
					`;
		})
		.join("");

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
															<th>Photo</th>
															<th>Actions</th>
													</tr>
											</thead>
											<tbody>${rows}</tbody>
									</table>
							</div>
					</div>
			</div>

			<!-- Модальное окно для связи с менеджером -->
			<div class="modal fade" id="request--communication-manager-modal" tabindex="-1" aria-labelledby="request--communication-manager-modal-label" aria-hidden="true">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="request--communication-manager-modal-label">Pour la moindre question ou problème écrivez votre message au manager</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <div class="contact-info">
                    <p><strong>Téléphone:</strong> +33 1 23 45 67 89</p>
                    <p><strong>Heures de travail:</strong> Lundi - Vendredi, 9:00 - 18:00</p>
                    <p><strong>Email:</strong> <a href="mailto:manager@exemple.com">manager@exemple.com</a></p>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fermer</button>
            </div>
        </div>
    </div>
</div>

			<!-- Модальное окно для связи с менеджером -->
<div class="modal fade" id="student-communication-manager-modal" tabindex="-1" aria-labelledby="student-communication-manager-modal-label" aria-hidden="true">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="student-communication-manager-modal-label">Pour la moindre question ou problème écrivez votre message au manager</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <div class="contact-info">
                    <p><strong>Téléphone:</strong> +33 1 23 45 67 89</p>
                    <p><strong>Heures de travail:</strong> Lundi - Vendredi, 9:00 - 18:00</p>
                    <p><strong>Email:</strong> <a href="mailto:manager@exemple.com">manager@exemple.com</a></p>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fermer</button>
            </div>
        </div>
    </div>
</div>


<!-- Modal annulation-->
<div class="modal fade" id="request--reverse-loan-modal" tabindex="-1" aria-labelledby="modalLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="modalLabel">Confirmation d'annulation</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                Êtes-vous sûr de vouloir annuler cette réservation ? Vous ne pourrez pas réserver cet équipement de nouveau avant un certain temps.
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fermer</button>
                <button type="button" class="btn btn-danger" id="cancelReservationButton">Annuler la réservation</button>
            </div>
        </div>
    </div>
</div>

<!-- Modal annulation for loans-->
    <div class="modal fade" id="reverse-loan-modal" tabindex="-1" aria-labelledby="modalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="modalLabel">Confirmation d'annulation</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    Êtes-vous sûr de vouloir annuler cette réservation ? Vous ne pourrez pas réserver cet équipement de nouveau avant un certain temps.
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fermer</button>
                    <button type="button" class="btn btn-danger" id="cancelLoanButton">Annuler la réservation</button>
                </div>
            </div>
        </div>
    </div>


			<!-- Modal для подтверждения предложения менеджера -->
    <div class="modal fade" id="managerProposalModal" tabindex="-1" aria-labelledby="managerProposalModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="managerProposalModalLabel">Proposition du manager</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <p>En appuyant sur "confirmer" vous confirmer les réctifications du manager</p>
            <button type="button" class="btn btn-primary" id="confirmManagerProposal">Confirmer</button>
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Envoyer le message au manager</button>
          </div>
        </div>
      </div>
    </div>

		<!-- Modal для подтверждения предложения менеджера перед отправк-->
		<div class="modal fade" id="manageResponseModal" tabindex="-1" aria-labelledby="manageResponseModalLabel" aria-hidden="true">
			<div class="modal-dialog">
				<div class="modal-content">
					<div class="modal-header">
						<h5 class="modal-title" id="manageResponseModalLabel">Confirmer la requête</h5>
						<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
					</div>
					<div class="modal-body">
						<p>En appuyant "confirmer" le gestionnaire commencera à chercher votre équipement.</p>
						<button type="button" class="btn btn-primary" id="confirmManagerResponse">Confirmer</button>
						<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Envoyer le message au manager</button>
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
			let statusMessage = rental.loan_status === "cancelled"
				? "annulé"
				: `loué le ${formatDate(rental.date_accord)}`;

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
							<li><a class="dropdown-item" href="#" data-bs-toggle="modal" data-bs-target="#student-communication-manager-modal">Contacter le manager</a></li>
								<li><a class="dropdown-item" href="#" data-bs-toggle="modal" data-bs-target="#reverse-loan-modal">Annuler la réservation</a></li>
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
<div class="modal fade" id="student-communication-manager-modal" tabindex="-1" aria-labelledby="student-communication-manager-modal-label" aria-hidden="true">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="student-communication-manager-modal-label">Pour la moindre question ou problème écrivez votre message au manager</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <div class="contact-info">
                    <p><strong>Téléphone:</strong> +33 1 23 45 67 89</p>
                    <p><strong>Heures de travail:</strong> Lundi - Vendredi, 9:00 - 18:00</p>
                    <p><strong>Email:</strong> <a href="mailto:manager@exemple.com">manager@exemple.com</a></p>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fermer</button>
            </div>
        </div>
    </div>
</div>

		<!-- Modal annulation-->
    <div class="modal fade" id="reverse-loan-modal" tabindex="-1" aria-labelledby="modalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="modalLabel">Confirmation d'annulation</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    Êtes-vous sûr de vouloir annuler cette réservation ? Vous ne pourrez pas réserver cet équipement de nouveau avant un certain temps.
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fermer</button>
                    <button type="button" class="btn btn-danger" id="cancelLoanButton">Annuler la réservation</button>
                </div>
            </div>
        </div>
    </div>

		<!-- Modal for anticipate return -->
		<div class="modal fade" id="anticipate-return-loan-modal" tabindex="-1" aria-labelledby="anticipateReturnModalLabel" aria-hidden="true">
    	<div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="anticipateReturnModalLabel">Quelle date voulez-vous rendre l'équipement?</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <form>
                    <div class="mb-3">
                        <label for="newDate" class="form-label">Nouvelle date:</label>
                        <input type="date" class="form-control" id="newDate">
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fermer</button>
                <button type="button" class="btn btn-primary">Enregistrer les modifications</button>
            </div>
        </div>
    		</div>
		</div>

		<!-- Modal for extension -->
		<div class="modal fade" id="extension-loan-modal" tabindex="-1" aria-labelledby="extensionModalLabel" aria-hidden="true">
				<div class="modal-dialog">
						<div class="modal-content">
								<div class="modal-header">
										<h5 class="modal-title" id="extensionModalLabel">Modifier la date de réservation</h5>
										<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
								</div>
								<div class="modal-body">
										<form>
												<div class="mb-3">
														<label for="newDate" class="form-label">Nouvelle date:</label>
														<input type="date" class="form-control" id="newDate">
												</div>
										</form>
								</div>
								<div class="modal-footer">
										<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fermer</button>
										<button type="button" class="btn btn-primary">Enregistrer les modifications</button>
								</div>
						</div>
				</div>
		</div>

	`;
}

function formatDate(date) {
	if (!date) return "";
	const d = new Date(date);
	const year = d.getFullYear();
	const month = `0${d.getMonth() + 1}`.slice(-2);
	const day = `0${d.getDate()}`.slice(-2);
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

export function returnLoanFormModal() {
	return `<div class="modal fade" id="loanFormModal" tabindex="-1" aria-labelledby="loanFormModalLabel" aria-hidden="true">
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
export { returnLoanRequestModal };
