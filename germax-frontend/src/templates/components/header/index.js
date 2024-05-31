function addDashboardNavItems() {
	const navbar = document.querySelector(".navbar-collapse");

	// Проверяем, существует ли navbar
	if (!navbar) return;

	// Удаляем оригинальную кнопку "Déconnexion/Inscription"
	const authButton = navbar.querySelector(".btn-auth");
	if (authButton) {
		authButton.parentNode.removeChild(authButton);
	}

	// Создаем новый элемент навигации
	const dashboardNav = document.createElement("nav");
	dashboardNav.className = "navbar navbar-expand-lg navbar-light bg-light";
	dashboardNav.innerHTML = `
		<div class="d-flex justify-content-end align-items-center" style="width: 100%;">
			<div id="horizontalNavbar" class="d-flex">
				<!-- генерация вертикального меню -->
			</div>
			<div id="notificationsModalPlace" class="ms-3"></div>
			<div id="supportModalContainer" class="ms-3"></div>
			<button class="btn btn-auth ms-3" onclick="location.href='auth.html'">Déconnexion</button>
		</div>
	`;

	// Вставляем новый элемент навигации после существующего navbar
	navbar.parentNode.insertBefore(dashboardNav, navbar.nextSibling);
}

// Функция для определения текущей страницы
function isDashboardPage() {
	return window.location.pathname.includes("dashboard");
}

// Если текущая страница - dashboard, добавляем элементы навигации
if (isDashboardPage()) {
	addDashboardNavItems();

	// Удаление класса bg-light у навигационного элемента
	const dashboardNav = document.querySelector('.navbar-light');
	if (dashboardNav) {
		dashboardNav.classList.remove('bg-light');
	}
}
