function getAdminNav() {
	// Nav tabs
	return `
	<div class="nav flex-column nav-pills" id="v-pills-tab" role="tablist" aria-orientation="vertical">
	<a class="nav-link active" id="locationsLink" href="./">Profil</a>
<a class="nav-link" id="locationsLink" href="/page-client-management">Gestion des utilisateurs</a>
<a class="nav-link" id="emprunteursLink" href="/page-reservation-history">Historique des résérvations</a>
<a class="nav-link" id="indicateursLink" href="/page-equipment-management">Gestion de l'équipement</a>
<a class="nav-link" id="indicateursLink" href="/page-order-new-equipment">Commander un nouvel équipement</a>
<a class="nav-link" id="indicateursLink" href="/page-admin-reports">Faire un rapport</a>
<a class="nav-link" id="indicateursLink" href="/page-admin-feedback">Retours et remarques</a>
<a class="nav-link" id="indicateursLink" href="/page-admin-settings">Réglages globales</a>
</div>`;
}

function getRentalManagerNav() {
	return `<div class="nav flex-column nav-pills" id="v-pills-tab" role="tablist" aria-orientation="vertical">
	<a class="nav-link active" id="locationsLink" href="./">Profil</a>
	<a class="nav-link" id="locationsLink" href="/page-client-management">Gestion des utilisateurs</a>
	<a class="nav-link" id="emprunteursLink" href="/page-reservation-history">Historique des résérvations</a>
	<a class="nav-link" id="indicateursLink" href="/page-equipment-management">Gestion de l'équipement</a>
	<a class="nav-link" id="indicateursLink" href="/page-order-new-equipment">Commander un nouvel équipement</a>
	<a class="nav-link" id="indicateursLink" href="/page-ahead-of-time-and-future-reservations">Résérvations à venir et arrivant à échéance</a>
	<a class="nav-link" id="indicateursLink" href="/page-loans-contact-manager">Communication avec le gestionnaire d'inventaire</a>
	<a class="nav-link" id="indicateursLink" href="/page-loans-request">Adresser une demande de location</a>
</div>`;
}

function getStockmanNav() {
	return `<div class="nav flex-column nav-pills" id="v-pills-tab" role="tablist" aria-orientation="vertical">
	<a class="nav-link active" id="locationsLink" href="./">Profil</a>
	<a class="nav-link" id="indicateursLink" href="/page-order-new-equipment">Commander un nouvel équipement</a>
	<a class="nav-link" id="locationsLink" href="/page-stockman-equipment-under-repair">Matériel en maintenance ou sous signalement</a>
	<a class="nav-link" id="reservations-echeance-link" href="/page-stockman-communication-with-rental-manager"
		role="tab" data-bs-toggle="pill">Communication avec les gestionnaires de location</a>
</div>`;
}

function getStudentNav() {
	return `<div class="nav flex-column nav-pills" id="v-pills-tab" role="tablist" aria-orientation="vertical">
	<a class="nav-link" id="locationsLink" href="#">Profil</a>
	<a class="nav-link active" id="loans" href="#" data-bs-toggle="tab" data-bs-target="#reservationTabsContent">My loans</a>
	<a class="nav-link" id="indicateursLink" href="/page-loans-request">Louer un
		nouveau matériel</a>
	<a class="nav-link" id="rentalHistoryLink" href="#">СДЕЛАТЬ!!История
		аренды и статус бронирований</a>
	<a role="button" id="openFullScreenSearch" class="nav-link btn btn-primary">Mes locations
	</a>
</div>
`;
}

function getTeacherNav() {
	return `<div class="nav flex-column nav-pills" id="v-pills-tab" role="tablist" aria-orientation="vertical">
	<a class="nav-link active" id="locationsLink" href="./">Profil</a>
	<a class="nav-link" id="myLocations" href="page-info-user">Mes
		locations. Сделать таблицу!!!</a>
	<a class="nav-link" id="indicateursLink" href="/page-loans-request">Louer un
		nouveau matériel</a>
	<a class="nav-link active" id="pageTeacherEquipmentUsageReports" href="/page-teacher-equipment-usage-reports" data-bs-toggle="pill">Rapport sur l'utilisation de l'équipement
	</a>
</div>`;
}

function getAdminHorizontalNav() {
	return `<div class="collapse navbar-collapse justify-content-end" id="navbarSupport">
	<ul class="navbar-nav align-items-center">
		<li class="nav-item">
			<a class="nav-link" href="#" data-bs-toggle="modal" data-bs-target="#notificationsModal">
				<i class="fa fa-bell">Notifications</i>
				<span class="badge badge-danger">3</span>
			</a>
		</li>`;
}

// модалка
function returnAdminNotificationsModal() {
	return `<div class="modal fade" id="notificationsModal" tabindex="-1" role="dialog" aria-labelledby="notificationsModalLabel" aria-hidden="true">
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
		  <div class="list-group">
			  <!-- Уведомление о запросе на аренду оборудования -->
			  <a href="#" class="list-group-item list-group-item-action flex-column align-items-start">
				  <div class="d-flex w-100 justify-content-between">
					  <h5 class="mb-1">Demandes de location d'équipement</h5>
					  <small>À expirer</small>
				  </div>
				  <p class="mb-1">L'équipement XYZ doit être confirmé avant 18h00 aujourd'hui.</p>
			  </a>
			  <!-- Уведомление о просроченном возврате оборудования -->
			  <a href="#" class="list-group-item list-group-item-action flex-column align-items-start">
				  <div class="d-flex w-100 justify-content-between">
					  <h5 class="mb-1">Retour d'équipement en retard</h5>
					  <small class="text-muted">Il y a 3 jours</small>
				  </div>
				  <p class="mb-1">L'équipement ABC n'a pas été retourné à temps.</p>
			  </a>
			  <!-- Добавьте дополнительные уведомления по аналогии -->
		  </div>
		</div>
		<div class="modal-footer">
		  <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fermer</button>
		</div>
	  </div>
	</div>
  </div>`;
}

function getManagerHorizontalNav() {
	return `<div class="collapse navbar-collapse justify-content-end" id="navbarSupport">
	<ul class="navbar-nav align-items-center">
		<li class="nav-item">
			<a class="nav-link" href="#" data-bs-toggle="modal" data-bs-target="#notificationsModal">
				<i class="fa fa-bell">Notifications</i>
				<span class="badge badge-danger">3</span>
			</a>
		</li>
		<li class="nav-item">
			<a class="nav-link" href="#settings" id="settings-link">
				<i class="fa fa-cog" aria-hidden="true"></i>
			</a>
		</li>
		<li class="nav-item dropdown">
			<a class="nav-link dropdown-toggle" href="#" id="navbarDropdownMenuLink" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
				<i class="fa fa-user"></i>
			</a>
			<div class="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
				<a class="dropdown-item" href="./">Profil</a>
				<a class="dropdown-item" href="#" id="settings-dropdown-link">Paramètres</a>
				<a class="dropdown-item" href="login.html">Déconnexion</a>
			</div>
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
			<a class="nav-link" href="#settings" id="settings-link">
				<i class="fa fa-cog" aria-hidden="true"></i>
			</a>
		</li>
		<li class="nav-item">
				<a class="nav-link" href="#" data-bs-toggle="modal" data-bs-target="#supportModal">
					<i class="fa fa-question-circle">Support</i>
				</a>
		</li>
		<li class="nav-item dropdown" id="nav-item-dropdown">
			<a class="nav-link dropdown-toggle" href="#" id="navbarDropdownMenuLink" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
				<i class="fa fa-user"></i>
			</a>
			<div class="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
				<a class="dropdown-item" href="./">Profil</a>
				<a class="dropdown-item" href="#" id="settings-dropdown-link">Paramètres</a>
				<a class="dropdown-item" href="login.html">Déconnexion</a>
			</div>
		</li>
	</ul>
</div>`;
}

function returnSettingsTab() {
	return `
	<ul class="nav nav-tabs" id="myTab" role="tablist">
		<li class="nav-item">
			<a class="nav-link" id="general-tab" data-bs-toggle="tab" href="#general" role="tab" aria-controls="general"
				aria-selected="true">Général</a>
		</li>
		<li class="nav-item">
			<a class="nav-link" id="settings-tab" data-bs-toggle="tab" href="#settings" role="tab" aria-controls="settings"
				aria-selected="false">Paramètres</a>
		</li>
		<!-- Ajoutez d'autres onglets ici -->
	</ul>
	<div class="tab-content" id="myTabContent">
		<div class="tab-pane fade" id="general" role="tabpanel" aria-labelledby="general-tab">
			<div class="card shadow-sm mt-3">
				<div class="card-body">
					<form>
						<div class="mb-3">
							<label for="fullName" class="form-label">Nom complet</label>
							<input type="text" class="form-control" id="fullName" placeholder="Entrez le nom complet">
						</div>
						<div class="mb-3">
							<label for="contactNumber" class="form-label">Contact</label>
							<input type="text" class="form-control" id="contactNumber" placeholder="Entrez le numéro de contact">
						</div>
						<div class="mb-3">
							<label for="emailId" class="form-label">Email</label>
							<input type="email" class="form-control" id="emailId" placeholder="Entrez l'email">
						</div>
						<div class="mb-3">
							<label for="birthDay" class="form-label">Date de naissance</label>
							<input type="text" class="form-control" id="birthDay" placeholder="JJ/MM/AAAA">
						</div>
						<div class="mb-3">
							<label for="about" class="form-label">À propos de vous</label>
							<textarea class="form-control" id="about" rows="3"></textarea>
						</div>
					</form>
				</div>
			</div>
			<!-- ... votre code pour les paramètres généraux ... -->
		</div>
		<div class="tab-pane fade" id="settings" role="tabpanel" aria-labelledby="settings-tab">
			<!-- Contenu de l'onglet Général -->
			<div class="card shadow-sm mt-3">
				<div class="card-body">
					<form>
						<div class="form-group">
							<label for="fullName">Nom complet</label>
							<input type="text" class="form-control" id="fullName" placeholder="Entrez votre nom complet">
						</div>
						<div class="form-group">
							<label for="contactNumber">Numéro de contact</label>
							<input type="tel" class="form-control" id="contactNumber" placeholder="Entrez votre numéro de contact">
						</div>
						<div class="form-group">
							<label for="emailAddress">Adresse Email</label>
							<input type="email" class="form-control" id="emailAddress" placeholder="Entrez votre email">
						</div>
						<div class="form-group">
							<label for="birthDate">Date de naissance</label>
							<input type="date" class="form-control" id="birthDate">
						</div>
						<div class="form-group">
							<label for="aboutYou">À propos de vous</label>
							<textarea class="form-control" id="aboutYou" rows="3" placeholder="Parlez un peu de vous"></textarea>
						</div>
					</form>
				</div>
			</div>

		</div>
		<!-- Ajoutez le contenu d'autres onglets ici si nécessaire -->
	</div>`;
}

function returnModalSupport() {
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
	returnAdminNotificationsModal,
	getAdminHorizontalNav,
	getManagerHorizontalNav,
	returnSettingsTab,
	getStockmanStudentTeacherHorizontalNav,
	returnModalSupport,
};
