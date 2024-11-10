const userId = '0bbf44ea-f93e-5c8f-8b2c-d9c6a37a303d';

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch(`http://127.0.0.1:3000/messages/conversations/${userId}`);
        if (response.ok) {
            const conversations = await response.json();
            const conversationList = document.getElementById('conversationList');
            const addedReceiverIds = new Set(); // Track unique receivers

            conversations.forEach(conversation => {
                const receiver = conversation.receiver;

                // Avoid duplicate names
                if (!addedReceiverIds.has(receiver.id)) {
                    addedReceiverIds.add(receiver.id);

                    const conversationDiv = document.createElement('div');
                    conversationDiv.className = 'p-4 border-b hover:bg-gray-100 cursor-pointer';
                    conversationDiv.innerHTML = `<p class="font-bold">${receiver.firstName} ${receiver.lastName}</p>`;

                    conversationDiv.addEventListener('click', () => {
                        loadMessages(receiver.id);
                        updateConversationName(`${receiver.firstName} ${receiver.lastName}`);
                    });

                    conversationList.appendChild(conversationDiv);
                }
            });
        }
    } catch (error) {
        console.error('Error loading conversations:', error);
    }

    const sendMessageButton = document.getElementById('sendMessage');
    sendMessageButton.addEventListener('click', async () => {
        const messageInput = document.getElementById('messageInput');
        const messageContent = messageInput.value.trim();
        if (!messageContent) return;

        const receiverId = currentReceiverId;

        try {
            const response = await fetch('http://127.0.0.1:3000/messages/send', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    senderId: userId,
                    receiverId,
                    content: messageContent
                })
            });

            if (response.ok) {
                const newMessage = await response.json();
                displayMessage(newMessage);
                messageInput.value = '';
            } else {
                console.error('Failed to send message:', response.statusText);
            }
        } catch (error) {
            console.error('Error sending message:', error);
        }
    });
});

async function loadMessages(receiverId) {
    currentReceiverId = receiverId;
    const messageList = document.getElementById('messageList');

    messageList.innerHTML = '';

    try {
        const response = await fetch(`http://127.0.0.1:3000/messages/conversations/${userId}/${receiverId}`);
        if (response.ok) {
            const messages = await response.json();
            messages.forEach(displayMessage);
        }
    } catch (error) {
        console.error('Error loading messages:', error);
    }
}

function updateConversationName(name) {
    const currentConversationName = document.getElementById('currentConversationName');
    currentConversationName.innerHTML = name;
}

// Updated displayMessage function to show messages on both sides
function displayMessage(message) {
    const messageList = document.getElementById('messageList');
    const messageDiv = document.createElement('div');

    // Check senderId to display on the correct side
    messageDiv.className = message.senderId === userId ? 'text-right' : 'text-left';
    messageDiv.innerHTML = `
                <div class="inline-block p-2 rounded-lg ${message.senderId === userId ? 'bg-primary text-white' : 'bg-gray-200 text-black'
        }">
                    ${message.content}
                </div>
            `;

    messageList.appendChild(messageDiv);
    messageList.scrollTop = messageList.scrollHeight;
}
