function getAdminNav() {
	// Nav tabs
	return `
	<div class="nav flex-column nav-pills" id="v-pills-tab" role="tablist" aria-orientation="vertical">
	<a class="nav-link active" id="locationsLink" href="./">Profil</a>
<a class="nav-link" id="adminClientManagementLink" href="/page-client-management">Gestion des utilisateurs</a>
<a class="nav-link" id="adminReservationHistoryLink" href="/page-reservation-history">Historique des résérvations</a>
<a class="nav-link" id="adminEquipmentManagementLink" href="/page-equipment-management">Attribuer un équipement</a>
<a class="nav-link" id="adminOrderNewEquipmentLink" href="/page-order-new-equipment">Gestion de l'équipement</a>
<a class="nav-link" id="adminReportsLink">Faire un rapport</a>
<a class="nav-link" id="adminFeedBackLink">Retours et remarques</a>
<a class="nav-link" id="adminSettingsLink">Réglages globales</a>
`;
}

function getRentalManagerNav() {
	return `<div class="nav flex-column nav-pills" id="v-pills-tab" role="tablist" aria-orientation="vertical">
	<a class="nav-link active" id="locationsLink" href="./">Profil</a>
	<a class="nav-link" id="indicateursLink" href="/page-order-new-equipment">Gestion du nouvel équipement</a>
	<a class="nav-link" id="bookingsLink" href="/page-bookings-management">Gestion des réservations</a>
	<a class="nav-link" id="usersManagementLink" href="/page-client-management">Gestion des utilisateurs</a>
	<a class="nav-link" id="indicateursLink" href="/page-orders">Gestion de l'équipement</a>
	</div>
`;
}

function getStockmanNav() {
	return `<div class="nav flex-column nav-pills" id="v-pills-tab" role="tablist" aria-orientation="vertical">
	<a class="nav-link active" id="locationsLink" href="./">Profil</a>
	<a class="nav-link" id="orderNewEquipment" href="/page-orders">Gestion de l'équipement</a>
	<a class="nav-link" id="indicateursLink" href="/page-order-new-equipment">Gestion des commandes</a>
	<a class="nav-link" id="locationsLink" href="/page-stockman-equipment-under-repair">Matériel en maintenance ou sous signalement</a>
</div>`;
}

function getStudentNav() {
	return `<div class="nav flex-column nav-pills" id="v-pills-tab" role="tablist" aria-orientation="vertical">
	<a class="nav-link" id="accountLink" href="#">Profil</a>
	<a class="nav-link" id="loansRequests" href="#" data-bs-toggle="tab" data-bs-target="#activeRequestReservations">Mes demandes de locations</a>
	<a class="nav-link" id="loansRealized" href="#" data-bs-toggle="tab" data-bs-target="#rentalHistoryLink">Mes locations</a>
	<a role="button" href="/loan-equipment" class="nav-link">
		Louer un nouveau matériel
	</a>
</div>
`;
}

function getTeacherNav() {
	return `<div class="nav flex-column nav-pills" id="v-pills-tab" role="tablist" aria-orientation="vertical">
	<a class="nav-link active" id="locationsLink" href="#">Profil</a>
	<a class="nav-link" id="loansRequests" href="#" data-bs-toggle="tab" data-bs-target="#activeRequestReservations">Mes demandes de locations</a>
	<a class="nav-link" id="loansRealized" href="#" data-bs-toggle="tab" data-bs-target="#rentalHistoryLink">Mes locations</a>
	<a role="button" href="/loan-equipment" class="nav-link">
		Louer un nouveau matériel
	</a>
</div>`;
}

function getAdminHorizontalNav() {
	return `<div class="collapse navbar-collapse justify-content-end" id="navbarSupport">
	<ul class="navbar-nav align-items-center">
		<li class="nav-item">
			<a class="nav-link" href="#">
				<i class="fa fa-bell">Notifications</i>
				<span class="badge badge-danger">3</span>
			</a>
		</li>`;
}

// модалка
export function returnNotificationsModal() {
	return `
    <div class="modal fade" id="notificationsModal" tabindex="-1" role="dialog" aria-labelledby="notificationsModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="notificationsModalLabel">Notifications</h5>
            <button type="button" class="close" data-bs-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <!-- Содержимое уведомлений -->
            <div class="list-group" id="notificationsList">
              <!-- Динамически добавляемые уведомления -->
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

function getManagerHorizontalNav() {
	return `<div class="collapse navbar-collapse justify-content-end" id="navbarSupport">
	<ul class="navbar-nav align-items-center">
		<li class="nav-item">
			<a class="nav-link" href="#" data-bs-toggle="modal" data-bs-target="#notificationsModal">
					<i class="fa fa-bell">Notifications</i>
					<span id="notificationCount" class="badge badge-danger" style="display:none;">0</span>
			</a>
		</li>
		<li class="nav-item">
			<a class="nav-link" href="#settings" id="settings-link">
				<i class="fa fa-cog" aria-hidden="true"></i>
			</a>
		</li>
	</ul>
</div>`;
}

function getStockmanStudentTeacherHorizontalNav() {
	return `<div class="collapse navbar-collapse justify-content-end" id="navbarSupport">
	<ul class="navbar-nav align-items-center">
		<li class="nav-item">
			<a class="nav-link" href="#" data-bs-toggle="modal" data-bs-target="#notificationsModal">
				<i class="fa fa-bell">Notifications</i>
				<span class="badge badge-danger">3</span>
			</a>
		</li>
		<li class="nav-item">
			<a class="nav-link" href="#" id="settings-link">
				<i class="fa fa-cog" aria-hidden="true"></i>
			</a>
		</li>
	</ul>
</div>`;
}

function returnSettingsTab(userType) {
	let aboutPlaceholder = '';

	switch (userType) {
		case 'rental-manager':
			aboutPlaceholder = 'Entrez les informations utiles pour le géstionnaire des stocks';
			break;
		case 'student':
		case 'teacher':
			aboutPlaceholder = 'Entrez les informations utiles pour le gestionnaire';
			break;
		case 'stockman':
			aboutPlaceholder = 'Entrez les informations utiles pour le gestionnaire ou le client';
			break;
		default:
			aboutPlaceholder = 'Entrez des informations utiles';
	}

	return `
	<ul class="nav nav-tabs" id="myTab" role="tablist">
		<li class="nav-item">
			<a class="nav-link" id="general-tab" data-bs-toggle="tab" href="#general" role="tab" aria-controls="general"
				aria-selected="true">Réglages</a>
		</li>
	</ul>
	<div class="tab-content" id="myTabContent">
		<div class="tab-pane fade" id="general" role="tabpanel" aria-labelledby="general-tab">
			<div class="card shadow-sm mt-3">
				<div class="card-body">
					<form id="settingsForm">
						<div class="mb-3">
							<label for="contactNumber" class="form-label">Contact</label>
							<input type="text" class="form-control" id="contactNumber" placeholder="Entrez le numéro de contact">
						</div>
						<div class="mb-3">
							<label for="emailId" class="form-label">Email</label>
							<input type="email" class="form-control" id="emailId" placeholder="Entrez votre email">
						</div>
						<div class="mb-3">
							<label for="birthDay" class="form-label">Date de naissance</label>
							<input type="text" class="form-control" id="birthDay" placeholder="JJ/MM/AAAA">
						</div>
						<div class="mb-3">
							<label for="about" class="form-label">Informations utiles</label>
							<textarea class="form-control" id="about" rows="3" placeholder="${aboutPlaceholder}"></textarea>
						</div>
						<button type="button" id="saveChanges" class="btn btn-primary">Sauvegarder les modifications</button>
						<button type="button" id="resetChanges" class="btn btn-secondary">Réinitialiser les modifications</button>
					</form>
				</div>
			</div>
		</div>
	</div>
	`;
}





function returnSupportModal() {
	return `
	<!-- Modal -->
	<div class="modal fade" id="supportModal" tabindex="-1" role="dialog" aria-labelledby="supportModalLabel" aria-hidden="true">
		<div class="modal-dialog modal-lg">
			<div class="modal-content">
				<div class="modal-header">
					<h5 class="modal-title" id="supportModalLabel">Formulaire de contact du service support</h5>
					<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
				</div>
				<div class="modal-body">
					<form>
						<div class="form-group">
							<label for="topicSelect">Sujet de la demande</label>
							<select class="form-control" id="topicSelect">
								<option>Problèmes techniques avec l'équipement</option>
								<option>Erreurs sur la plateforme de réservation</option>
								<option>Dommage à l'équipement</option>
								<!-- Ajoutez d'autres sujets ici -->
							</select>
						</div>
						<div class="form-group">
							<label for="descriptionTextarea">Description du problème</label>
							<textarea class="form-control" id="descriptionTextarea" rows="3"></textarea>
						</div>
						<div class="form-group">
							<label for="prioritySelect">Priorité</label>
							<select class="form-control" id="prioritySelect">
								<option>Bas</option>
								<option>Moyen</option>
								<option>Élevé</option>
							</select>
						</div>
						<div class="form-group">
							<label for="fileUpload">Joindre des fichiers</label>
							<input type="file" class="form-control-file" id="fileUpload" multiple>
						</div>
						<div class="form-group">
							<label for="userName">Votre nom</label>
							<input type="text" class="form-control" id="userName" required>
						</div>
						<div class="form-group">
							<label for="userEmail">Votre email</label>
							<input type="email" class="form-control" id="userEmail" required>
						</div>
						<div class="form-group">
							<label for="userPhone">Votre téléphone</label>
							<input type="tel" class="form-control" id="userPhone">
						</div>
					</form>
				</div>
				<div class="modal-footer">
					<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fermer</button>
					<button type="submit" class="btn btn-primary">Envoyer</button>
				</div>
			</div>
		</div>
	</div>
	`;
}
export {
	getAdminNav,
	getRentalManagerNav,
	getStockmanNav,
	getStudentNav,
	getTeacherNav,
	getAdminHorizontalNav,
	getManagerHorizontalNav,
	returnSettingsTab,
	getStockmanStudentTeacherHorizontalNav,
	returnSupportModal,
};
