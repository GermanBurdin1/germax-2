import "./index.css";
import Carousel from "bootstrap/js/dist/carousel";
import Collapse from "bootstrap/js/dist/collapse";
import Modal from "bootstrap/js/dist/modal";

const carouselElement = document.getElementById("equipmentCarousel");
const carousel = new Carousel(carouselElement, {
	interval: 5000,
	wrap: true,
});

const links = document.querySelectorAll('a[href^="#"]');

for (const link of links) {
	link.addEventListener("click", function (e) {
		e.preventDefault();
		const targetId = this.getAttribute("href").substring(1);
		const targetElement = document.getElementById(targetId);

		if (targetElement) {
			window.scrollTo({
				top: targetElement.offsetTop - 70,
				behavior: "smooth",
			});
		}
	});
}

const text = "Gères ta loc'";
const typewriterText = document.getElementById("typewriter-text");
let index = 0;

function type() {
	if (index < text.length) {
		typewriterText.textContent += text.charAt(index);
		index++;
		setTimeout(type, 150);
	} else {
		typewriterText.classList.remove("typewriter");
	}
}

type();

const accordionElements = document.querySelectorAll(".accordion");
accordionElements.forEach((accordion) => {
	new Collapse(accordion, {
		toggle: false,
	});
});

// Initialize Modals
const aboutModalElement = document.getElementById("aboutModal");
if (aboutModalElement) {
	const aboutModal = new Modal(aboutModalElement);
}

const contactModalElement = document.getElementById("contactModal");
if (contactModalElement) {
	const contactModal = new Modal(contactModalElement);
}
