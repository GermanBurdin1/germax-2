<!DOCTYPE html>
<html lang="en">

<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<link href="./style.css" rel="stylesheet">
	<title>Dashboard</title>
</head>

<body>
	<div class="container-fluid">
		<div class="row bg-light py-2">
			<div class="col-auto">
				<a href="/school/" class="navbar-brand">
					<img src="../../../public/images/GERMAX.jpg" alt="logo" style="height: 50px;">
				</a>
			</div>
			<div class="col d-flex justify-content-end align-items-center">
				<a href="link_to_other_page.html" class="mr-2">Foire Aux Questions</a>
				<div class="dropdown">
					<button class="btn btn-outline-primary btn-sm ml-2 dropdown-toggle" type="button" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false">
						Fonctionnalités
					</button>
					<div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
						<a class="dropdown-item" href="#">changement d’état du matériel</a>
						<a class="dropdown-item" href="#">ajout du matériel</a>
						<a class="dropdown-item" href="#">historique des locations</a>
						<a class="dropdown-item" href="#">demande de signalement</a>
					</div>
				</div>

			</div>
		</div>

		<div class="row mt-3">
			<div class="col-md-3">
				<ul class="nav flex-column">
					<li class="nav-item"><a href="#" id="locationsLink" class="nav-link active">Locations</a></li>
					<li class="nav-item"><a href="#" id="emprunteursLink" class="nav-link">Emprunteurs</a></li>
					<li class="nav-item"><a href="#" class="nav-link">Материалы</a></li>
					<li class="nav-item"><a href="#" class="nav-link">Уроки</a></li>
					<li class="nav-item"><a href="#" class="nav-link">Марафоны</a></li>
					<li class="nav-item"><a href="#" class="nav-link">Настройки</a></li>
					<li class="nav-item"><a href="#" class="nav-link">Тарифы</a></li>
				</ul>
			</div>
			<div class="col d-flex align-items-center">
				<h1>Agenda de locations</h1>
			</div>
		</div>
	</div>
	<div class="modal-backdrop" style="display:none;">
	</div>
	<div id="calendar"></div>
	<div id="emprunteursContent" class="modal">
		<div class="modal-content">
			<span class="close">&times;</span>
			<h2>Liste des Emprunteurs</h2>
			<p>Информация о арендаторах будет здесь.</p>
		</div>
	</div>


	<script src="/dist/bundle.js"></script>
	<script src="/dist/addModal.bundle.js"></script>
	<script src="/dist/calendar.bundle.js"></script>
	<script src="../dashboard/addModal/addClient/displayClient.js"></script>
</body>

</html>