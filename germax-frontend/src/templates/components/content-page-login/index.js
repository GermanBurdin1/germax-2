import './index.css';

document.getElementById('loginForm').addEventListener('submit', function(event) {
	event.preventDefault(); // Предотвратить стандартную отправку формы

	const formData = new FormData(this);
	const url = 'http://germax-api/src/endpoints/login.php'; // URL серверного скрипта обработки логина

	fetch(url, {
			method: 'POST', // Использовать метод POST
			body: formData  // Отправить данные формы
	})
	.then(response => response.json()) // Преобразовать ответ в JSON
	.then(data => {
			console.log('Login Response:', data); // Вывести данные ответа в консоль
			if (data.status === 'success') {
					// Обработка успешного входа
					window.location.href = '/page-dashboard'; // Перенаправить на страницу после входа
			} else {
					// Обработка ошибок входа
					alert('Login failed: ' + data.message);
			}
	})
	.catch((error) => {
			console.error('Error:', error); // Вывести ошибку в консоль, если она произошла
	});
});
