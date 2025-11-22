if (!window.messageInitialized) {
    window.messageInitialized = true;

    console.log('Initializing message logic...');

    const sendBtn = document.querySelector('.btn-send');
    const messageInput = document.querySelector('.chat-input input');

    if (sendBtn && messageInput) {
        sendBtn.addEventListener('click', () => {
            const message = messageInput.value.trim();
            if (message) {
                console.log('Sending message:', message);
                messageInput.value = '';
            }
        });

        messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendBtn.click();
            }
        });
    }

    const messageItems = document.querySelectorAll('.message-item');
    messageItems.forEach(item => {
        item.addEventListener('click', () => {
            messageItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            console.log('Switched conversation');
        });
    });
}