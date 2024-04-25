import "./index.css";

document.addEventListener("DOMContentLoaded", function () {
	const userType = localStorage.getItem("userType");
	if (userType) {
		adjustUIBasedOnUserType(userType);
	}
});

function adjustUIBasedOnUserType(userType) {
	const dynamicMenu = document.getElementById("dynamicMenu");
	dynamicMenu.innerHTML = "";
	let content = "";
	switch (userType) {
		case "admin":
			content = `
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
			break;
		case "rental-manager":
			content = `<div class="nav flex-column nav-pills" id="v-pills-tab" role="tablist" aria-orientation="vertical">
			<a class="nav-link active" id="locationsLink" href="./">Profil</a>
			<a class="nav-link" id="locationsLink" href="/page-client-management">Gestion des utilisateurs</a>
			<a class="nav-link" id="emprunteursLink" href="/page-reservation-history">Historique des résérvations</a>
			<a class="nav-link" id="indicateursLink" href="/page-equipment-management">Gestion de l'équipement</a>
			<a class="nav-link" id="indicateursLink" href="/page-order-new-equipment">Commander un nouvel équipement</a>
			<a class="nav-link" id="indicateursLink" href="/page-ahead-of-time-and-future-reservations">Résérvations à venir et arrivant à échéance</a>
			<a class="nav-link" id="indicateursLink" href="/page-loans-contact-manager">Communication avec le gestionnaire d'inventaire</a>
			<a class="nav-link" id="indicateursLink" href="/page-loans-request">Adresser une demande de location</a>
		</div>`;
			break;
		case "stockman":
			content = `<div class="nav flex-column nav-pills" id="v-pills-tab" role="tablist" aria-orientation="vertical">
			<a class="nav-link active" id="locationsLink" href="./">Profil</a>
			<a class="nav-link" id="indicateursLink" href="/page-order-new-equipment">Commander un nouvel équipement</a>
			<a class="nav-link" id="locationsLink" href="/page-stockman-equipment-under-repair">Matériel en maintenance ou sous signalement</a>
			<a class="nav-link" id="reservations-echeance-link" href="/page-stockman-communication-with-rental-manager"
				role="tab" data-toggle="pill">Communication avec les gestionnaires de location</a>
		</div>`;
			break;
		case "student":
			content = `<div class="nav flex-column nav-pills" id="v-pills-tab" role="tablist" aria-orientation="vertical">
			<a class="nav-link active" id="locationsLink" href="./">Profil</a>
			<a class="nav-link" id="locationsLink" href="/page-info-user">Сделать таблицу! Mes
				locations</a>
			<a class="nav-link" id="indicateursLink" href="/page-loans-request">Louer un
				nouveau matériel</a>
				<a class="nav-link" id="rentalHistoryLink" href="./subpages/loansRequests/rentalHistory.html" data-toggle="pill">СДЕЛАТЬ!!История
					аренды и статус бронирований</a>
		</div>`;
			break;
		case "teacher":
			content = `<div class="nav flex-column nav-pills" id="v-pills-tab" role="tablist" aria-orientation="vertical">
			<a class="nav-link active" id="locationsLink" href="./">Profil</a>
			<a class="nav-link" id="myLocations" href="page-info-user">Mes
				locations. Сделать таблицу!!!</a>
			<a class="nav-link" id="indicateursLink" href="/page-loans-request">Louer un
				nouveau matériel</a>
			<a class="nav-link active" id="pageTeacherEquipmentUsageReports" href="/page-teacher-equipment-usage-reports" data-toggle="pill">Rapport sur l'utilisation de l'équipement
			</a>
		</div>`;
			break;
		default:
			console.log("Unknown user type");
	}
	dynamicMenu.innerHTML = content; // Вставка подготовленного контента в меню
}
