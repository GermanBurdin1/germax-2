import "./index.css";

document.addEventListener("DOMContentLoaded", function() {
	const backArrowContainer = document.getElementById("backArrowContainer");

	if (backArrowContainer) {
			const backArrow = document.createElement("a");
			backArrow.href = "javascript:history.back()";
			backArrow.className = "back-arrow";
			backArrow.innerHTML = '<i class="fas fa-arrow-left"></i> Retour';
			backArrowContainer.appendChild(backArrow);
	}
});
