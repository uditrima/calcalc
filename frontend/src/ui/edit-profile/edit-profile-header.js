// Edit Profile Header Module
export function createSettingsHeader() {
    const header = document.createElement('div');
    header.className = 'settings-header';
    
    // Go back button
    const goBackBtn = document.createElement('button');
    goBackBtn.className = 'go-back-btn';
    goBackBtn.innerHTML = '←';
    goBackBtn.addEventListener('click', () => {
        const customEvent = new CustomEvent('onGoBack', {
            bubbles: true
        });
        const appContainer = document.querySelector('#app');
        if (appContainer) {
            appContainer.dispatchEvent(customEvent);
        } else {
            document.dispatchEvent(customEvent);
        }
    });
    header.appendChild(goBackBtn);
    
    // Title
    const title = document.createElement('h1');
    title.textContent = 'Rediger Profil';
    header.appendChild(title);
    
    return header;
}
