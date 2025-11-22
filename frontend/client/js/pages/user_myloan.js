document.addEventListener('componentsLoaded', () => {
    console.log('Loading message page...');


    fetch('/frontend/client/components/myloan/index.html')
        .then(r => r.text())
        .then(messageHTML => {
            const mainContainer = document.querySelector('.main__container');
            if (mainContainer) {
                mainContainer.innerHTML = messageHTML;
            }

            return loadScript('/frontend/client/js/components/myloan.js');
        })
        .then(() => {
        })
        .catch(error => {
        });
});