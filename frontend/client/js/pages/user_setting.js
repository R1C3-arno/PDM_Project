document.addEventListener('componentsLoaded', () => {
    console.log('Loading message page...');

    fetch('/frontend/client/components/setting/index.html')
        .then(r => r.text())
        .then(messageHTML => {
            const mainContainer = document.querySelector('.main__container');
            if (mainContainer) {
                mainContainer.innerHTML = messageHTML;
            }
            return loadScript('/frontend/client/js/components/setting.js');
        })
        .then(() => {
        })
        .catch(error => {
        });
});