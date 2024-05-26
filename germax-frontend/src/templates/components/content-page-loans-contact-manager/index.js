import './index.css';
// В разработке

import { ApiCommunications } from '../../../utils/classes/api-communication'; // Убедитесь, что путь правильный

const apiCommunications = new ApiCommunications();

document.getElementById('communicationForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const message = document.getElementById('communicationMessageText').value;

    if (!message.trim()) {
        alert('Please enter a message.');
        return;
    }

    try {
        const data = await apiCommunications.sendMessage(message);

        if (data.success) {
					displayMessages(data.messages);
        } else {
            alert('Failed to send message: ' + data.message);
        }
    } catch (error) {
        console.error('Error sending message:', error);
        alert('An error occurred while sending the message.');
    }
});


function displayMessages(messages) {
	const messagesList = document.querySelector('.previous-communications .list-group');
	messagesList.innerHTML = '';

	messages.forEach(message => {
			const messageItem = document.createElement('li');
			messageItem.className = 'list-group-item';
			messageItem.textContent = `${message.date_sent}: ${message.message}`;
			messagesList.appendChild(messageItem);
	});
}
