function returnAdminReportsModal() {
	return `<div class="modal fade show active" id="adminReportModal" tabindex="-1" aria-labelledby="adminReportModalLabel" aria-hidden="true">
<div class="modal-dialog">
	<div class="modal-content">
		<div class="modal-header">
			<h5 class="modal-title" id="adminReportModalLabel">Générer un Rapport</h5>
			<button type="button" class="close" data-bs-dismiss="modal" aria-label="Close">
				<span aria-hidden="true">&times;</span>
			</button>
		</div>
		<div class="modal-body">
			<form>
				<div class="form-group">
					<label for="reportType">Type de Rapport</label>
					<select class="form-control" id="reportType">
						<option>Utilisation d'Équipement</option>
						<option>Activité des Utilisateurs</option>
						<option>Performance du Service</option>
					</select>
				</div>
				<div class="form-group">
					<label for="reportPeriod">Période</label>
					<input type="date" class="form-control" id="startDate">
					<input type="date" class="form-control" id="endDate">
				</div>
		<div class="form-group">
		<label for="reportMessage">Message</label>
		<textarea class="form-control" id="reportMessage" rows="3"></textarea>
	</div>
			</form>
		</div>
		<div class="modal-footer">
			<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fermer</button>
			<button type="button" class="btn btn-primary">Générer</button>
		</div>
	</div>
</div>
</div>`;
}

function returnAdminFeedbackModal(){
	return `<!-- Модальное окно -->
	<div class="modal fade" id="adminFeedbackModal" tabindex="-1" aria-labelledby="adminFeedbackModalLabel" aria-hidden="true">
		<div class="modal-dialog modal-xl"> <!-- modal-xl для большего размера модального окна -->
			<div class="modal-content">
				<div class="modal-header">
					<h5 class="modal-title" id="adminFeedbackModalLabel">Retours et Remarques</h5>
					<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
				</div>
				<div class="modal-body">
					<!-- Навигация по вкладкам внутри модального окна -->
					<ul class="nav nav-pills mb-3" id="pills-tab" role="tablist">
						<li class="nav-item" role="presentation">
							<button class="nav-link active" id="pills-etudiant-tab" data-bs-toggle="pill" data-bs-target="#pills-etudiant" type="button" role="tab" aria-controls="pills-etudiant" aria-selected="true">Étudiant</button>
						</li>
						<li class="nav-item" role="presentation">
							<button class="nav-link" id="pills-enseignant-tab" data-bs-toggle="pill" data-bs-target="#pills-enseignant" type="button" role="tab" aria-controls="pills-enseignant" aria-selected="false">Enseignant</button>
						</li>
						<li class="nav-item" role="presentation">
							<button class="nav-link" id="pills-magasinier-tab" data-bs-toggle="pill" data-bs-target="#pills-magasinier" type="button" role="tab" aria-controls="pills-magasinier" aria-selected="false">Magasinier</button>
						</li>
						<li class="nav-item" role="presentation">
							<button class="nav-link" id="pills-gerant-tab" data-bs-toggle="pill" data-bs-target="#pills-gerant" type="button" role="tab" aria-controls="pills-gerant" aria-selected="false">Gérant de l'équipement</button>
						</li>
					</ul>

					<!-- Контент для каждой вкладки -->
					<div class="tab-content" id="pills-tabContent">
						<div class="tab-pane fade show active" id="pills-etudiant" role="tabpanel" aria-labelledby="pills-etudiant-tab">
							<h2>Retours et Remarques (Étudiant)</h2>
							<!-- Повторяющийся список... -->
						</div>
						<div class="tab-pane fade" id="pills-enseignant" role="tabpanel" aria-labelledby="pills-enseignant-tab">
							<h2>Retours et Remarques (Enseignant)</h2>
							<!-- Повторяющийся список... -->
						</div>
						<div class="tab-pane fade" id="pills-magasinier" role="tabpanel" aria-labelledby="pills-magasinier-tab">
							<h2>Retours et Remarques (Magasinier)</h2>
							<!-- Повторяющийся список... -->
						</div>
						<div class="tab-pane fade" id="pills-gerant" role="tabpanel" aria-labelledby="pills-gerant-tab">
							<h2>Retours et Remarques (Gérant de l'équipement)</h2>
							<!-- Повторяющийся список... -->
						</div>
					</div>
				</div>
				<div class="modal-footer">
					<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
				</div>
			</div>
		</div>
	</div>
	`
}
export {returnAdminReportsModal, returnAdminFeedbackModal}
