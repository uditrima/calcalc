// Settings UI component
export function Settings(container) {
    if (!container) {
        throw new Error('Settings requires a container element');
    }
    
    // Clear container
    container.innerHTML = '';
    
    // Create settings structure
    const settings = document.createElement('div');
    settings.className = 'settings';
    
    // 1. Settings Header
    const header = createSettingsHeader();
    settings.appendChild(header);
    
    // 2. Edit Profile Section
    const editProfileSection = createEditProfileSection();
    settings.appendChild(editProfileSection);
    
    // 3. Goals Header
    const goalsHeader = createGoalsHeader();
    settings.appendChild(goalsHeader);
    
    // 4. Apps & Devices Header
    const appsDevicesHeader = createAppsDevicesHeader();
    settings.appendChild(appsDevicesHeader);
    
    // Add to container
    container.appendChild(settings);
    
    return settings;
}

function createSettingsHeader() {
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
        // Dispatch on the app container instead of document
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
    title.textContent = 'Indstillinger';
    header.appendChild(title);
    
    return header;
}


function createEditProfileSection() {
    const section = document.createElement('div');
    section.className = 'edit-profile-section';
    
    const title = document.createElement('h2');
    title.textContent = 'Rediger Profil';
    section.appendChild(title);
    
    // Make section clickable
    section.style.cursor = 'pointer';
    section.addEventListener('click', () => {
        // Navigate to edit profile page
        const customEvent = new CustomEvent('navigateToEditProfile', {
            bubbles: true
        });
        const appContainer = document.querySelector('#app');
        if (appContainer) {
            appContainer.dispatchEvent(customEvent);
        } else {
            document.dispatchEvent(customEvent);
        }
    });
    
    return section;
}

function createGoalsHeader() {
    const header = document.createElement('div');
    header.className = 'goals-header';
    
    const title = document.createElement('h2');
    title.textContent = 'Mål';
    header.appendChild(title);
    
    // Make section clickable
    header.style.cursor = 'pointer';
    header.addEventListener('click', () => {
        console.log('Goals section clicked');
        // TODO: Implement goals functionality
    });
    
    return header;
}

function createAppsDevicesHeader() {
    const header = document.createElement('div');
    header.className = 'apps-devices-header';
    
    const title = document.createElement('h2');
    title.textContent = 'Apps & Enheder';
    header.appendChild(title);
    
    // Make section clickable
    header.style.cursor = 'pointer';
    header.addEventListener('click', () => {
        console.log('Apps & Devices section clicked');
        // TODO: Implement apps & devices functionality
    });
    
    return header;
}
