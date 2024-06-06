import './index.css';


// // Функция для отправки изменений в расписание обслуживания
// function submitMaintenanceChanges() {
//   const newEndDate = document.getElementById('newEndDate').value;
//   const messageToManager = document.getElementById('messageToManager').value;
//   const notifyRepair = document.getElementById('notifyRepair').checked;

//   const data = {
//     newEndDate: newEndDate,
//     messageToManager: messageToManager,
//     notifyRepair: notifyRepair
//   };

//   // Fetch API для отправки данных на сервер
//   fetch('/api/updateMaintenanceSchedule', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json'
//     },
//     body: JSON.stringify(data)
//   })
//   .then(response => response.json())
//   .then(data => {
//     console.log('Success:', data);
//     // Закрыть модальное окно после успешной отправки
//     $('#manageMaintenanceModal').modal('hide');
//   })
//   .catch((error) => {
//     console.error('Error:', error);
//   });

//   // Опционально отправить сообщение менеджеру, если задано
//   if (messageToManager) {
//     sendMessageToManager(messageToManager);
//   }
// }

// // Функция для отправки сообщения менеджеру
// function sendMessageToManager(message) {
//   console.log("Sending message to manager:", message);
//   // Дополнительная логика отправки сообщения, если нужно
// }

