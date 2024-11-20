function addDashboardNavItems() {
	const navbar = document.querySelector(".navbar-collapse");

	if (!navbar) return;

	const authButton = navbar.querySelector(".btn-auth");
	if (authButton) {
		authButton.parentNode.removeChild(authButton);
	}

	const dashboardNav = document.createElement("nav");
	dashboardNav.className = "navbar navbar-expand-lg navbar-light bg-light";
	dashboardNav.innerHTML = `
		<div class="d-flex justify-content-end align-items-center" style="width: 100%;">
			<div id="horizontalNavbar" class="d-flex">
				<!-- генерация вертикального меню -->
			</div>
			<div id="notificationsModalPlace" class="ms-3"></div>
			<div id="supportModalContainer" class="ms-3"></div>
			<button class="btn btn-auth ms-3" id="logoutButton">Déconnexion</button>
		</div>
	`;

	navbar.parentNode.insertBefore(dashboardNav, navbar.nextSibling);
}

function isDashboardPage() {
	return window.location.pathname.includes("dashboard");
}

if (isDashboardPage()) {
	addDashboardNavItems();

	const dashboardNav = document.querySelector('.navbar-light');
	if (dashboardNav) {
		dashboardNav.classList.remove('bg-light');
	}
}
