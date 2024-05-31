import "./index.css";
document.addEventListener("DOMContentLoaded", function() {
	const backArrowContainer = document.getElementById("backArrowContainer");

	if (backArrowContainer) {
		const backArrow = document.createElement("a");
		backArrow.className = "back-arrow";
		backArrow.innerHTML = '<i class="fas fa-arrow-left"></i> Retour';

		// Определяем предыдущий URL
		const previousURL = document.referrer;

		// Логика для определения ссылки на возврат
		if (previousURL.includes("/page-dashboard")) {
			backArrow.href = "/page-dashboard";
		} else {
			backArrow.href = "/";
		}

		backArrowContainer.appendChild(backArrow);
	}
});
