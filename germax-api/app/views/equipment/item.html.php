<!DOCTYPE html>
<html lang="fr">

<head>
    <meta charset="UTF-8">
    <title>Location du matériel</title>

</head>

<body>
    <?php include '../shared/header.html.php'; ?>

    <?php include '../../controllers/load-description-item.php'; 

    $id_model = isset($_GET['id']) ? (int)$_GET['id'] : 0;

    if ($id_model > 0) {
        $model = loadEquipmentDescription($pdo, $id_model);

        if ($model) {
            echo "<div class='container mt-3'>";
            echo "<div class='row'>";
            echo "<div class='col-lg-8 mx-auto'>";
            echo "<div class='text-center'>";
            echo "<h1>Location {$model['name']}</h1>";
            echo "</div>";
            echo "<div class='card'>";
            echo "<div class='card-body'>";
            echo "<h2 class='card-title'>Caractéristiques</h2>";
            echo "<p>{$model['description']}</p>";
        } else {
            echo "<p>Modèle non trouvé.</p>";
        }
    } else {
        echo "<p>ID de modèle non spécifié.</p>";
    }
    ?>

    <script src="../../../dist/bundle.js"></script>
</body>

</html>