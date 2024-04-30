function loansClientHistory() {
	return `<div class="table-responsive">
			<table class="table" id="reservationsTable">
					<thead>
							<tr>
									<th>Équipement</th>
									<th>Date Début</th>
									<th>Date Fin</th>
									<th>Actions</th>
							</tr>
					</thead>
					<tbody>
							<!-- Пример первой строки -->
							<tr>
									<td>Laptop</td>
									<td>2023-04-01</td>
									<td>2023-04-03</td>
									<td>
											<a href="#" class="view-details" >Voir les détails</a>
									</td>
							</tr>
							<!-- Пример второй строки -->
							<tr>
									<td>Tablet</td>
									<td>2023-04-04</td>
									<td>2023-04-05</td>
									<td>
											<a href="#" class="view-details" >Voir les détails</a>
									</td>
							</tr>
							<!-- Пример третьей строки -->
							<tr>
									<td>Smartphone</td>
									<td>2023-04-06</td>
									<td>2023-04-07</td>
									<td>
											<a href="#" class="view-details" >Voir les détails</a>
									</td>
							</tr>
					</tbody>
			</table>
	</div>`;
}


function rentalClientDetails(){
	return`<div class="modal fade" id="clientLoansModal" tabindex="-1" aria-labelledby="clientLoansModalLabel" aria-hidden="true">
	<div class="modal-dialog modal-lg"> <!-- modal-lg для большего модального окна -->
			<div class="modal-content">
					<div class="modal-header">
							<h5 class="modal-title" id="clientLoansModalLabel">Détails de la location</h5>
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
</div>`
}
export {loansClientHistory, rentalClientDetails};
