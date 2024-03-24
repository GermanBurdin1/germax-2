<?php
// Database.php
class Database {
    private static $host = 'localhost';
    private static $dbname = 'version2';
    private static $user = 'root';
    private static $pass = '';
    private static $options = [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ];

    public static function connect() {
        $dsn = "mysql:host=" . self::$host . ";dbname=" . self::$dbname;
        try {
            return new PDO($dsn, self::$user, self::$pass, self::$options);
        } catch (\PDOException $e) {
            throw new \PDOException($e->getMessage(), (int)$e->getCode());
        }
    }
}
?>
