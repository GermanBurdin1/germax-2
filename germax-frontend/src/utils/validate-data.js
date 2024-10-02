function validateEmail(email) {
	return email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
}

function validateDate(input) {
	const dateValue = new Date(input.value);
	const minDate = new Date(input.getAttribute("min"));
	const maxDate = new Date(input.getAttribute("max"));
	return !(isNaN(dateValue.getTime()) || dateValue < minDate || dateValue > maxDate);
}

export {validateDate,validateEmail}
