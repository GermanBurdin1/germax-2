function displayClient () {
    document.getElementById('emprunteursLink').addEventListener('click', function(e) {
        e.preventDefault();
        const content = document.getElementById('emprunteursContent');
        if (content.style.display === "none") {
            content.style.display = "block";
        } else {
            content.style.display = "none";
        }
    });
}
