const fs = require('fs');
const path = require('path');

const gPath = path.join(__dirname, 'src/js/globals.js');
let content = fs.readFileSync(gPath, 'utf-8');

// Truncate the bad handleRoute
const hrIndex = content.indexOf('function if (window.router)');
if (hrIndex !== -1) {
    content = content.substring(0, hrIndex);
}

// Fix doLogin
content = content.replace(/window\.doLogin = \(\) => \{/g, 'window.doLogin = async () => {');

// Fix printSelected forEach loop
// selectedIds.forEach((id, index) => { ... }) -> for (let index = 0; index < selectedIds.length; index++) { const id = selectedIds[index]; ... }
content = content.replace(/selectedIds\.forEach\(\(id, index\) => \{/g, 'for (let index = 0; index < selectedIds.length; index++) { const id = selectedIds[index];');
// The closing `});` of that forEach is at the end of the printSelected function before `win.document.write('</body></html>');`
content = content.replace(/\s*\}\);\s*win\.document\.write\('<\/body><\/html>'\);/g, '\n            }\n            win.document.write(\'</body></html>\');');

fs.writeFileSync(gPath, content, 'utf-8');
console.log('Fixed globals.js');
