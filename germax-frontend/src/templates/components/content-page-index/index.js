import './index.css';
import { getUsers } from '../../../assets/js/get-users';
// Пример импортов js функций

const scrollToFaqNode = document.querySelector('#scrollToFaq');
const faqSectionNode = document.querySelector('#faq-section');

// Пример импортов js функций
const users = getUsers();
console.log(users, 'users');

if (scrollToFaqNode !== null && faqSectionNode !== null) {
	faqSectionNode.scrollIntoView({
		behavior: 'smooth'
	});
}
