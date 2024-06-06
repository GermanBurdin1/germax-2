import './index.css';

var ctx = document.getElementById('clientsChart').getContext('2d');
		var clientsChart = new Chart(ctx, {
			type: 'line',
			data: {
				labels: [...Array(30).keys()].map(d => `1 мая + ${d}`),
				datasets: [{
					label: 'Clients',
					backgroundColor: 'rgb(255, 99, 132)',
					borderColor: 'rgb(255, 99, 132)',
					data: [0, 2, 4, 6, 3, 5, 2, 3, 1, 4, 7, 8]
				}]
			},
			options: {}
		});

		var ctx2 = document.getElementById('reservationsChart').getContext('2d');
		var reservationsChart = new Chart(ctx2, {
			type: 'line',
			data: {
				labels: [...Array(30).keys()].map(d => `1 мая + ${d}`),
				datasets: [{
					label: 'Réservations à venir',
					backgroundColor: 'rgb(54, 162, 235)',
					borderColor: 'rgb(54, 162, 235)',
					data: [0, 1, 3, 7, 4, 2, 5, 3, 6, 5, 9, 2]
				}]
			},
			options: {}
		});
