<?php

session_start();
class Database
{
	private $host = 'localhost';
	private $dbname = 'version2';
	private $user = 'root';
	private $pass = '';
	private $options = [
		PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
		PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
		PDO::ATTR_EMULATE_PREPARES => false,
	];

	public function connect()
	{
		$dsn = "mysql:host=" . $this->host . ";dbname=" . $this->dbname;
		try {
			return new PDO($dsn, $this->user, $this->pass, $this->options);
		} catch (\PDOException $e) {
			throw new \PDOException($e->getMessage(), (int)$e->getCode());
		}
	}
}

?>
