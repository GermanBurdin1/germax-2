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

export {returnAdminReportsModal}
