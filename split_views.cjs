const fs = require('fs');

const content = fs.readFileSync('demo.html', 'utf-8');

// Extract CSS
const cssMatch = content.match(/<style>([\s\S]*?)<\/style>/);
if (cssMatch) {
    fs.writeFileSync('src/assets/css/main.css', cssMatch[1].trim(), 'utf-8');
    console.log('Extracted CSS');
}

// Extract Views
const views = ['DashboardView', 'SiteListView', 'DetailView', 'CreateSiteView', 'SettingsView', 'UserManagementView', 'MapView'];

for (let i = 0; i < views.length; i++) {
    const view = views[i];
    // Find the starting index
    const startIndex = content.indexOf(`const ${view} = {`);
    if (startIndex === -1) {
        console.log(`Could not find ${view}`);
        continue;
    }
    
    // Find the end by looking for the next top-level const or the end of the script
    let endIndex = content.length;
    
    // Look for the next view definition
    for (let j = i + 1; j < views.length; j++) {
        const nextView = views[j];
        const nextIndex = content.indexOf(`const ${nextView} = {`, startIndex + 1);
        if (nextIndex !== -1 && nextIndex < endIndex) {
            endIndex = nextIndex;
        }
    }
    
    // Also consider the window.router = { or function renderApp() as endpoints if it's the last view
    const routerIndex = content.indexOf(`const router = {`, startIndex + 1);
    if (routerIndex !== -1 && routerIndex < endIndex) endIndex = routerIndex;
    
    const renderAppIndex = content.indexOf(`function renderApp()`, startIndex + 1);
    if (renderAppIndex !== -1 && renderAppIndex < endIndex) endIndex = renderAppIndex;
    
    const initAppIndex = content.indexOf(`async function initApp()`, startIndex + 1);
    if (initAppIndex !== -1 && initAppIndex < endIndex) endIndex = initAppIndex;

    let viewContent = content.substring(startIndex, endIndex).trim();
    // remove trailing semicolon
    if (viewContent.endsWith(';')) viewContent = viewContent.slice(0, -1);
    
    const outContent = `import { SiteService } from '../services/siteService.js';
import { FormService } from '../services/formService.js';
import { UserService } from '../services/userService.js';
import { NotificationService } from '../services/notificationService.js';
import { store } from '../store.js';

export ${viewContent}
`;
    let filename = `src/js/views/${view}.js`;
    if (view === 'DetailView') filename = `src/js/views/SiteDetailView.js`;
    if (view === 'SettingsView') filename = `src/js/views/AdminSettingsView.js`;
    
    fs.writeFileSync(filename, outContent, 'utf-8');
    console.log(`Extracted ${view}`);
}
