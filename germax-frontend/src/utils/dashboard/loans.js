function returnClientLoans() {
	return `<div class="nav nav-tabs" id="reservationTabs" role="tablist">
	<a class="nav-link active" id="active-reservations-tab" data-bs-toggle="tab" href="#activeReservations"
		role="tab" aria-controls="activeReservations" aria-selected="true">Réservations</a>
</div>

<!-- Содержимое вкладок -->
<div class="tab-content" id="reservationTabsContent">
	<!-- Вкладка Активные резервации -->
	<div class="tab-pane fade show active" id="activeReservations" role="tabpanel"
		aria-labelledby="active-reservations-tab">
		<div class="table-responsive">
			<table class="table" id="reservationsTable">
				<thead>
					<tr>
						<th data-column="id" data-type="number">ID Réservation <button
								class="btn btn-link p-0 border-0 sortButton"><i class="fas fa-sort"></i></button>
						</th>
						<th data-column="equipment" data-type="text">Équipement loué
						</th>
						<th data-column="startdate" data-type="date">Date de location<button
								class="btn btn-link p-0 border-0 sortButton"><i class="fas fa-sort"></i></button>
						</th>
						<th data-column="enddate" data-type="date">Date de retour<button
								class="btn btn-link p-0 border-0 sortButton"><i class="fas fa-sort"></i></button>
						</th>
						<th>Actions</th>
					</tr>
				</thead>
				<tbody>
					<!-- Преподаватели -->
					<tr data-id="1" data-user="Enseignant A" data-equipment="Laptop" data-startdate="2023-04-01"
						data-enddate="2023-04-03" data-status="Actif">
						<td>1</td>
						<td>HUAWEI MateBook D 16</td>
						<td>
							<span class="view-mode" data-name="startdate">2023-04-01</span>
							<input type="date" class="edit-mode d-none" name="startdate" value="2023-04-01">
							<span class="error-message d-none"></span> <!-- Элемент для сообщения об ошибке -->
						</td>
						<td>
							<span class="view-mode" data-name="enddate">2023-04-03</span>
							<input type="date" class="edit-mode d-none" name="enddate" value="2023-04-03">
							<span class="error-message d-none"></span> <!-- Элемент для сообщения об ошибке -->
						</td>
						<td>
							<div class="dropdown">
								<button class="btn btn-secondary dropdown-toggle" type="button"
									id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
									Choisir une action
								</button>
								<ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
    							<li>
        						<a class="dropdown-item" href="#" data-bs-toggle="modal" data-bs-target="#communication-manager-modal">
            				Contacter le manager
        						</a>
    							</li>
    							<li>
        						<a class="dropdown-item" href="#" data-bs-toggle="modal" data-bs-target="#rentalDetailsModal">Détails de ma location</a>
    							</li>
								</ul>
							</div>
						</td>
					</tr>
			</table>
		</div>
	</div>
</div>

<div class="modal fade" id="rentalDetailsModal" tabindex="-1" aria-labelledby="rentalDetailsModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-lg"> <!-- modal-lg для большего модального окна -->
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="rentalDetailsModalLabel">Détails de la location</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <div class="row">
                    <div class="col-md-8">
                        <p class="mb-2">Équipement loué: <strong>Appareil photo professionnel</strong></p>
                        <p class="mb-2">Modèle: <strong>Canon EOS R5</strong></p>
                        <p class="mb-2">Début de location: <strong>01/07/2024</strong></p>
                        <p class="mb-2">Fin de location: <strong>31/07/2024</strong></p>
                        <p class="mb-2">Temps restant: <strong>3 jours</strong></p>
                        <p class="mb-2">Statut de la location: <span class="badge bg-success">Active</span></p>
                        <button type="button" class="btn btn-warning mt-3">Prolonger la location</button>
                        <button type="button" class="btn btn-danger mt-3">Arrêter la location</button>
                    </div>
                    <div class="col-md-4 d-flex align-items-center justify-content-center">
                        <div class="client-photo bg-primary" style="width: 100px; height: 100px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 2rem; color: white;">
                            <i class="far fa-user"></i>
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fermer</button>
            </div>
        </div>
    </div>
</div>

<!-- Модальное окно Bootstrap -->
<div class="modal fade" id="communication-manager-modal" tabindex="-1" aria-labelledby="communication-manager-modal-label" aria-hidden="true">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="communication-manager-modal-label">Communication avec les gestionnaires de location</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <div class="communication-form">
                    <form>
                        <div class="form-group">
                            <label for="managerSelect">Sélectionner le gestionnaire</label>
                            <select class="form-control" id="managerSelect">
                                <!-- Options des gestionnaires chargées dynamiquement -->
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="topicSelect">Sujet de la communication</label>
                            <select class="form-control" id="topicSelect">
                                <option value="maintenance">Maintenance de matériel</option>
                                <option value="reservation">Réservation d'équipement</option>
                                <option value="return">Retour d'équipement</option>
                                <option value="report">Signalement de problème</option>
                                <option value="other">Autre</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="messageText">Message</label>
                            <textarea class="form-control" id="messageText" rows="3"></textarea>
                        </div>
                        <button type="submit" class="btn btn-primary">Envoyer</button>
                    </form>
                </div>
                <div class="previous-communications">
                    <h3>Communications précédentes</h3>
                    <ul class="list-group">
                        <!-- La liste des messages précédents sera générée dynamiquement ici -->
                    </ul>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fermer</button>
            </div>
        </div>
    </div>
</div>
`;
}

function returnLoanRequestModal() {
	return `<div class="modal fade" id="fullScreenModal" tabindex="-1" aria-labelledby="fullScreenModalLabel" aria-hidden="true">
<div class="modal-dialog modal-fullscreen">
	<div class="modal-content">
		<div class="modal-header">
			<h5 class="modal-title" id="fullScreenModalLabel">Поиск и Фильтрация Оборудования</h5>
			<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
		</div>
		<div class="modal-body">
		<div class="jumbotron">
		<div class="input-group mb-3">
			<input type="text" class="form-control" id="model-search" placeholder="Rechercher par modèle">
			<div class="input-group-append">
				<button class="btn btn-outline-secondary" type="button" id="search-button">Rechercher</button>
			</div>
		</div>
		<div class="container-fluid">
			<div class="row">
				<div id="type-filter" class="col-md-3">
					<div class="container-fluid">
						<div class="row">
							<div id="type-filter" class="col-md-9">
								<div class="list-group">
									<a href="#" class="list-group-item list-group-item-action active" data-type="laptop">Ordinateurs portables</a>
									<a href="#" class="list-group-item list-group-item-action" data-type="сomputer_monitor">Ecrans
										d'ordinateurs</a>
									<a href="#" class="list-group-item list-group-item-action" data-type="smartphone">Smartphones</a>
									<a href="#" class="list-group-item list-group-item-action" data-type="accessory">Accessoires</a>
									<a href="#" class="list-group-item list-group-item-action" data-type="tablet">Tablettes</a>
									<a href="#" class="list-group-item list-group-item-action" data-type="VR_headset">Casque VR</a>
								</div>
							</div>
							<div id="equipment-list" class="col-md-9">
								<!-- Les unités du matériel apparaîtront ici -->
							</div>
						</div>
					</div>
				</div>
				<div id="equipment-list" class="col-md-9">
					<!-- Сюда будут загружаться результаты -->
				</div>
			</div>
			<div class="col-md-12 text-center">
				<button id="load-more" class="btn btn-primary mt-3">Charger plus</button>
			</div>
		</div>
	</div>
			<div class="jumbotron">
	<p class="lead">Vous n'avez pas trouvé ce dont vous avez besoin ?</p>
	<hr class="my-4">
	<p>Ici, vous pouvez rapidement et facilement envoyer une demande de location de l'équipement nécessaire au gestionnaire de l'entrepôt.</p>
	<!-- Button trigger modal -->
	<a class="btn btn-primary btn-sm nav-link active" id="loansRequest" href="#" data-bs-toggle="modal"
		data-bs-target="#loanFormModal">Aller au formulaire</a>
	<div class="modal fade" id="loanFormModal" tabindex="-1" aria-labelledby="loanFormModalLabel" aria-hidden="true">
		<div class="modal-dialog modal-lg">
			<div class="modal-content">
				<div class="modal-header">
					<h5 class="modal-title" id="loanFormModalLabel">Форма запроса на аренду</h5>
					<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
				</div>
				<div class="modal-body">
					<form>
						<div class="mb-3">
							<label for="managerName" class="form-label">Ваше имя</label>
							<input type="text" class="form-control" id="managerName" placeholder="Иван Иванов">
						</div>
						<div class="mb-3">
							<label for="managerContact" class="form-label">Контактная информация</label>
							<input type="email" class="form-control" id="managerContact" placeholder="email@example.com">
						</div>
						<div class="mb-3">
							<label for="equipmentCategory" class="form-label">Категория оборудования</label>
							<select class="form-select" id="equipmentCategory">
								<option>Ноутбуки</option>
								<option>Мониторы</option>
								<option>Смартфоны</option>
								<option>Аксессуары</option>
								<option>Планшеты</option>
								<option>VR-гарнитуры</option>
							</select>
						</div>
						<div class="mb-3">
							<label for="modelInput" class="form-label">Начните вводить название модели</label>
							<input type="text" class="form-control" id="modelInput" placeholder="Введите название модели">
						</div>
						<div class="mb-3">
							<label for="quantity" class="form-label">Количество</label>
							<input type="number" class="form-control" id="quantity" placeholder="1">
						</div>
						<div class="mb-3">
							<label for="rentalDates" class="form-label">Даты аренды</label>
							<input type="text" class="form-control" id="rentalDates" placeholder="с 01.01.2024 по 10.01.2024">
						</div>
						<div class="mb-3">
							<label for="comments" class="form-label">Комментарии</label>
							<textarea class="form-control" id="comments" rows="3"></textarea>
						</div>
					</form>
				</div>
				<div class="modal-footer">
					<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Закрыть</button>
					<button type="submit" class="btn btn-primary">Отправить запрос</button>
				</div>
			</div>
		</div>
	</div>
</div>
			<!-- Здесь заканчивается ваш код -->
		</div>
		<div class="modal-footer">
			<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Закрыть</button>
		</div>
	</div>
</div>
</div>`;
}

export { returnClientLoans, returnLoanRequestModal };
