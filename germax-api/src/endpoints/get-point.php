<?php
require_once '../controllers/auth-controllers.php'; // Убедитесь, что путь указан верно
session_start();

// Предполагаем, что тип пользователя сохраняется в сессии после входа
$userType = $_SESSION['type'] ?? 'student';

$menuController = new MenuController();
$menuItems = $menuController->getMenu($userType);

// Установим заголовок Content-Type для ответа
header('Content-Type: application/json');

// Отправляем данные меню в формате JSON
echo json_encode($menuItems);
?>
