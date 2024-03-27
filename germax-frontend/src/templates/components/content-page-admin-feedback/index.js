import './index.css';
import { Tab } from 'bootstrap';

document.querySelectorAll('a[data-bs-toggle="pill"]').forEach(item => {
    item.addEventListener('click', function (e) {
        e.preventDefault();
        let tab = new Tab(this);
        tab.show();
    });
});
