import './index.css';

document.addEventListener('DOMContentLoaded', function() {
    fetch('/api/getMenu')
        .then(response => response.json())
        .then(data => {
            const menuContainer = document.getElementById('dynamicMenu');
            data.forEach(item => {
                const menuItem = document.createElement('a');
                menuItem.setAttribute('href', item.url);
                menuItem.setAttribute('class', 'list-group-item list-group-item-action');
                menuItem.textContent = item.title;
                menuContainer.appendChild(menuItem);
            });
        })
        .catch(error => console.error('Error loading the menu:', error));
});
