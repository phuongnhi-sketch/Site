const fs = require('fs');
const path = require('path');

const viewsDir = path.join(__dirname, 'src/js/views');
const files = fs.readdirSync(viewsDir).filter(f => f.endsWith('.js'));

for (const file of files) {
    const filePath = path.join(viewsDir, file);
    let content = fs.readFileSync(filePath, 'utf-8');

    // Make render async
    content = content.replace(/render:\s*\((.*?)\)\s*=>\s*\{/g, 'render: async ($1) => {');
    
    // Replace sync service calls
    content = content.replace(/SiteService\.getSites\(\)/g, '(await SiteService.getSites())');
    content = content.replace(/SiteService\.getStats\(\)/g, '(await SiteService.getStats())');
    content = content.replace(/SiteService\.getSiteById\(/g, '(await SiteService.getSiteById(');
    content = content.replace(/UserService\.getUsers\(\)/g, '(await UserService.getUsers())');
    content = content.replace(/FormService\.getFormFields\(\)/g, '(await FormService.getFields())');
    content = content.replace(/FormService\.getFields\(\)/g, '(await FormService.getFields())');
    content = content.replace(/NotificationService\.get\(\)/g, '(await NotificationService.get())');
    
    const methodsToAsync = ['save', 'deleteSite', 'updateStatus', 'addComment', 'updateMPSA', 'createVersion2', 'saveUser', 'deleteUser', 'saveFields'];
    for (const method of methodsToAsync) {
        content = content.replace(new RegExp(`${method}:\\s*\\((.*?)\\)\\s*=>\\s*\\{`, 'g'), `${method}: async ($1) => {`);
        // if not already awaited (prevent double await)
        content = content.replace(new RegExp(`([^a-zA-Z0-9_]await\\s+)?SiteService\\.${method}\\(`, 'g'), (match, p1) => {
            return p1 ? match : `await SiteService.${method}(`;
        });
        content = content.replace(new RegExp(`([^a-zA-Z0-9_]await\\s+)?UserService\\.${method}\\(`, 'g'), (match, p1) => {
            return p1 ? match : `await UserService.${method}(`;
        });
    }

    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`Refactored ${file}`);
}
