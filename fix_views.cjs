const fs = require('fs');
const path = require('path');

const viewsDir = path.join(__dirname, 'src/js/views');
const viewFiles = fs.readdirSync(viewsDir).filter(f => f.endsWith('.js'));

for (const f of viewFiles) {
    const p = path.join(viewsDir, f);
    let content = fs.readFileSync(p, 'utf-8');
    
    // Fix imports
    content = content.replace(/from '\.\.\/services\//g, "from '../../services/");
    content = content.replace(/from '\.\.\/store\.js'/g, "from '../store.js'"); // No change, just in case
    
    if (f === 'UserManagementView.js') {
        content = content.replace(/window\.showUserModal = \(id\) => \{/g, 'window.showUserModal = async (id) => {');
        content = content.replace(/window\.saveUserModal = \(\) => \{/g, 'window.saveUserModal = async () => {');
        content = content.replace(/window\.deleteUser = \(id\) => \{/g, 'window.deleteUser = async (id) => {');
        content = content.replace(/handleRoute\(\);/g, 'if(window.router) window.router.handleRoute();');
    }
        
    if (f === 'SiteDetailView.js') {
        content = content.replace(/window\.addComment = \(\) => \{/g, 'window.addComment = async () => {');
        content = content.replace(/window\.updateStatus = \(s\) => \{/g, 'window.updateStatus = async (s) => {');
        content = content.replace(/window\.updateMPSA = \(\) => \{/g, 'window.updateMPSA = async () => {');
        content = content.replace(/window\.createV2 = \(\) => \{/g, 'window.createV2 = async () => {');
        content = content.replace(/window\.deleteSite = \(\) => \{/g, 'window.deleteSite = async () => {');
        content = content.replace(/handleRoute\(\);/g, 'if(window.router) window.router.handleRoute();');
        content = content.replace(/location\.hash='#sites';/g, 'location.hash="#sites"; if(window.router) window.router.handleRoute();');
    }
        
    if (f === 'CreateSiteView.js') {
        content = content.replace(/window\.saveSite = \(\) => \{/g, 'window.saveSite = async () => {');
        content = content.replace(/handleRoute\(\);/g, 'if(window.router) window.router.handleRoute();');
    }
    
    fs.writeFileSync(p, content, 'utf-8');
}

const compsDir = path.join(__dirname, 'src/js/components');
if (fs.existsSync(compsDir)) {
    const compFiles = fs.readdirSync(compsDir).filter(f => f.endsWith('.js'));
    for (const f of compFiles) {
        const p = path.join(compsDir, f);
        let content = fs.readFileSync(p, 'utf-8');
        content = content.replace(/from '\.\.\/services\//g, "from '../../services/");
        fs.writeFileSync(p, content, 'utf-8');
    }
}
