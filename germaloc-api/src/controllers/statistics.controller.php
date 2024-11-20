<?php

require_once $_SERVER['DOCUMENT_ROOT'] . '/src/utils/database.php';
require_once $_SERVER['DOCUMENT_ROOT'] . '/src/services/statistics.service.php';

class StatisticsController
{
    private $statisticsService;

    public function __construct()
    {
        $this->statisticsService = new StatisticsService();
    }

    public function getManagerStatistics()
    {
        return $this->statisticsService->fetchManagerStatistics();
    }

    public function getStockmanStatistics()
    {
        return $this->statisticsService->fetchStockmanStatistics();
    }

}
