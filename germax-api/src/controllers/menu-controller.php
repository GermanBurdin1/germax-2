<?php
class MenuController
{
	public function getMenu($userType)
	{
		$menuItems = [];

		switch ($userType) {
			case 'admin':
				$menuItems = [
					['title' => 'Dashboard', 'url' => './dashboard.html'],
					['title' => 'User Management', 'url' => '#'],
					['title' => 'Equipment Management', 'url' => '#'],
					['title' => 'Reservation Management', 'url' => '#'],
					['title' => 'Reports', 'url' => '#'],
					['title' => 'Feedback and Issues', 'url' => '#'],
					['title' => 'Settings', 'url' => '#']
				];
				break;
			case 'stockman':
				$menuItems = [
					['title' => 'Profil', 'url' => './dashboard.html'],
					['title' => 'Réservations', 'url' => './subpages/futureReservations.html'],
					['title' => 'Réservations arrivant à échéance', 'url' => './subpages/reservationsApproachingExpiry.html'],
					['title' => 'Matériel en maintenance', 'url' => './subpages/equipmentUnderRepair.html'],
					['title' => 'Matériel en attente de maintenance', 'url' => './subpages/equipmentAwaitingRepair.html'],
					['title' => 'Matériel avec signalement', 'url' => './subpages/equipmentWithRemarks.html'],
					['title' => 'Commandes du nouveau matériel', 'url' => './subpages/equipmentOrders.html'],
					['title' => 'Contacter le gestionnaire de locations', 'url' => './subpages/communicationWithRentalManagers.html']
				];
				break;
			case 'teacher':
				$menuItems = [
					['title' => 'Profil', 'url' => './dashboard.html'],
					['title' => 'Mes locations', 'url' => './subpages/loansCalendar.html'],
					['title' => 'Louer un nouveau matériel', 'url' => './subpages/loansRequests/loansRequest.html'],
					['title' => 'История аренды и статус бронирований', 'url' => './subpages/loansRequests/rentalHistory.html']
				];
				break;
			case 'student':
				$menuItems = [
					['title' => 'Profil', 'url' => './dashboard.html'],
					['title' => 'Mes locations', 'url' => './subpages/loansCalendar.html'],
					['title' => 'Louer un nouveau matériel', 'url' => './subpages/loansRequests/loansRequest.html'],
					['title' => 'История аренды и статус бронирований', 'url' => './subpages/loansRequests/rentalHistory.html']
				];
				break;
			default:
				$menuItems = [
					['title' => 'Dashboard', 'url' => './dashboard.html']
				];
				break;
		}

		return $menuItems;
	}
}
