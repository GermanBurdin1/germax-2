import '../css/style.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';
import { Modal } from 'bootstrap';
import { initCalendar } from '../../app/views/dashboard/calendar/calendar';

document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM fully loaded and parsed');
    // initCalendar();
    initModal();
  });

  function initModal() {
    const exampleModalNode = document.getElementById('exampleModal');
    if (exampleModalNode === null) return;
    const exampleModal = new Modal(exampleModalNode);

    document.getElementById('openModal').addEventListener('click', () => {
      console.log('Button clicked');
        exampleModal.show();
    });
  }