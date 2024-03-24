<?php
class MenuController {
    public function getMenu($userType) {
        $menuItems = [];

        switch ($userType) {
            case 'admin':
                $menuItems = [
                    ['title' => 'Dashboard', 'url' => '/dashboard'],
                    ['title' => 'User Management', 'url' => '/user-management'],
                    ['title' => 'Settings', 'url' => '/settings']
                ];
                break;
            case 'manager':
                $menuItems = [
                    ['title' => 'Dashboard', 'url' => '/dashboard'],
                    ['title' => 'Equipment Management', 'url' => '/equipment-management'],
                    ['title' => 'Reservation Management', 'url' => '/reservation-management'],
                    ['title' => 'Reports', 'url' => '/reports']
                ];
                break;
            default:
                $menuItems = [
                    ['title' => 'Dashboard', 'url' => '/dashboard']
                ];
                break;
        }

        return $menuItems;
    }
}
?>

