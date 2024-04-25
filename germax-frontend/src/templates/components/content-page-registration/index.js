import './index.css';

document.getElementById('registrationForm').addEventListener('submit', function(event) {
	event.preventDefault(); // Предотвратить стандартную отправку формы

	const formData = new FormData(this); // Собрать данные формы
	const url = 'http://germax-api/src/endpoints/register.php'; // URL PHP скрипта

	fetch(url, {
			method: 'POST', // Использовать метод POST
			body: formData  // Отправить данные формы
	})
	.then(response => response.json()) // Преобразовать ответ в JSON
	.then(data => {
			console.log('Success:', data); // Вывести данные ответа в консоль
			if (data.status === 'success') {
				// Переход на страницу логина
				window.location.href = '/page-login';
		}
	})
	.catch((error) => {
			console.error('Error:', error); // Вывести ошибку в консоль, если она произошла
	});
});
