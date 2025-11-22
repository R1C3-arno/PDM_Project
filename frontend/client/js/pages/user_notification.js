document.addEventListener('componentsLoaded', () => {
    console.log('Loading message page...');


    fetch('/frontend/client/components/notification/index.html')
        .then(r => r.text())
        .then(messageHTML => {
            const mainContainer = document.querySelector('.main__container');
            if (mainContainer) {
                mainContainer.innerHTML = messageHTML;
            } else {
                console.error('Main container not found');
            }
            return loadScript('/frontend/client/js/components/notification.js');
        })
        .then(() => {
        })
        .catch(error => {
        });
});