<?php
require_once $_SERVER['DOCUMENT_ROOT'] . '/src/services/settings.service.php';
require_once $_SERVER['DOCUMENT_ROOT'] . '/src/services/auth.service.php';

class SettingsController
{
    private $settingsService;
    private $authService;

    public function __construct($settingsService, $authService)
    {
        $this->settingsService = $settingsService;
        $this->authService = $authService;
    }

    public function saveSettings($data, $token)
    {
        $user = $this->authService->getUserByToken($token);
        if ($user === null) {
            echo json_encode(['success' => false, 'message' => 'Invalid token or user not found']);
            return;
        }

        $response = $this->settingsService->saveSettings($data);
        echo json_encode($response);
    }

    public function getSettings($token)
    {
        $user = $this->authService->getUserByToken($token);
        if ($user === null) {
            echo json_encode(['success' => false, 'message' => 'Invalid token or user not found']);
            return;
        }

        $response = $this->settingsService->getSettings();
        echo json_encode($response);
    }
}
