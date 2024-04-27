function returnClientLoans() {
	return `<div class="nav nav-tabs" id="reservationTabs" role="tablist">
	<a class="nav-link active" id="active-reservations-tab" data-bs-toggle="tab" href="#activeReservations"
		role="tab" aria-controls="activeReservations" aria-selected="true">Réservations</a>
</div>

<!-- Содержимое вкладок -->
<div class="tab-content" id="reservationTabsContent">
	<!-- Вкладка Активные резервации -->
	<div class="tab-pane fade show active" id="activeReservations" role="tabpanel"
		aria-labelledby="active-reservations-tab">
		<div class="table-responsive">
			<table class="table" id="reservationsTable">
				<thead>
					<tr>
						<th data-column="id" data-type="number">ID Réservation <button
								class="btn btn-link p-0 border-0 sortButton"><i class="fas fa-sort"></i></button>
						</th>
						<th data-column="equipment" data-type="text">Équipement loué
						</th>
						<th data-column="startdate" data-type="date">Date de location<button
								class="btn btn-link p-0 border-0 sortButton"><i class="fas fa-sort"></i></button>
						</th>
						<th data-column="enddate" data-type="date">Date de retour<button
								class="btn btn-link p-0 border-0 sortButton"><i class="fas fa-sort"></i></button>
						</th>
						<th>Actions</th>
					</tr>
				</thead>
				<tbody>
					<!-- Преподаватели -->
					<tr data-id="1" data-user="Enseignant A" data-equipment="Laptop" data-startdate="2023-04-01"
						data-enddate="2023-04-03" data-status="Actif">
						<td>1</td>
						<td>HUAWEI MateBook D 16</td>
						<td>
							<span class="view-mode" data-name="startdate">2023-04-01</span>
							<input type="date" class="edit-mode d-none" name="startdate" value="2023-04-01">
							<span class="error-message d-none"></span> <!-- Элемент для сообщения об ошибке -->
						</td>
						<td>
							<span class="view-mode" data-name="enddate">2023-04-03</span>
							<input type="date" class="edit-mode d-none" name="enddate" value="2023-04-03">
							<span class="error-message d-none"></span> <!-- Элемент для сообщения об ошибке -->
						</td>
						<td>
							<div class="dropdown">
								<button class="btn btn-secondary dropdown-toggle" type="button"
									id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
									Choisir une action
								</button>
								<ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
    							<li>
        						<a class="dropdown-item" id="communication-manager-link" data-bs-toggle="modal" href="#" data-bs-target="#communication-manager-modal">
            				Contacter le manager
        						</a>
    							</li>
    							<li>
        						<a class="dropdown-item" href="#" data-bs-toggle="modal" data-bs-target="#rentalDetailsModal">Détails de ma location</a>
    							</li>
								</ul>
							</div>
						</td>
					</tr>
			</table>
		</div>
	</div>
</div>

<div class="modal fade" id="rentalDetailsModal" tabindex="-1" aria-labelledby="rentalDetailsModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-lg"> <!-- modal-lg для большего модального окна -->
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="rentalDetailsModalLabel">Détails de la location</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <div class="row">
                    <div class="col-md-8">
                        <p class="mb-2">Équipement loué: <strong>Appareil photo professionnel</strong></p>
                        <p class="mb-2">Modèle: <strong>Canon EOS R5</strong></p>
                        <p class="mb-2">Début de location: <strong>01/07/2024</strong></p>
                        <p class="mb-2">Fin de location: <strong>31/07/2024</strong></p>
                        <p class="mb-2">Temps restant: <strong>3 jours</strong></p>
                        <p class="mb-2">Statut de la location: <span class="badge bg-success">Active</span></p>
                        <button type="button" class="btn btn-warning mt-3">Prolonger la location</button>
                        <button type="button" class="btn btn-danger mt-3">Arrêter la location</button>
                    </div>
                    <div class="col-md-4 d-flex align-items-center justify-content-center">
                        <div class="client-photo bg-primary" style="width: 100px; height: 100px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 2rem; color: white;">
                            <i class="far fa-user"></i>
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fermer</button>
            </div>
        </div>
    </div>
</div>

<!-- Модальное окно Bootstrap -->
<div class="modal fade" id="communication-manager-modal" tabindex="-1" aria-labelledby="communication-manager-modal-label" aria-hidden="true">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="communication-manager-modal-label">Communication avec les gestionnaires de location</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <div class="communication-form">
                    <form>
                        <div class="form-group">
                            <label for="managerSelect">Sélectionner le gestionnaire</label>
                            <select class="form-control" id="managerSelect">
                                <!-- Options des gestionnaires chargées dynamiquement -->
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="topicSelect">Sujet de la communication</label>
                            <select class="form-control" id="topicSelect">
                                <option value="maintenance">Maintenance de matériel</option>
                                <option value="reservation">Réservation d'équipement</option>
                                <option value="return">Retour d'équipement</option>
                                <option value="report">Signalement de problème</option>
                                <option value="other">Autre</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="messageText">Message</label>
                            <textarea class="form-control" id="messageText" rows="3"></textarea>
                        </div>
                        <button type="submit" class="btn btn-primary">Envoyer</button>
                    </form>
                </div>
                <div class="previous-communications">
                    <h3>Communications précédentes</h3>
                    <ul class="list-group">
                        <!-- La liste des messages précédents sera générée dynamiquement ici -->
                    </ul>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fermer</button>
            </div>
        </div>
    </div>
</div>

`;
}

export { returnClientLoans };
