const fs = require('fs');
const path = require('path');

const mapPath = path.join(__dirname, 'src/js/views/MapView.js');
let content = fs.readFileSync(mapPath, 'utf-8');

const markerIndex = content.indexOf('window.refreshMap');

if (markerIndex !== -1) {
    // Find the nearest }; before window.refreshMap
    const beforeStr = content.substring(0, markerIndex);
    const splitIndex = beforeStr.lastIndexOf('};') + 2;

    const mapContent = content.substring(0, splitIndex) + '\n';
    fs.writeFileSync(mapPath, mapContent, 'utf-8');
    
    // Globals content
    let globalsContent = content.substring(splitIndex);
    
    // We need to add imports to globals.js
    let out = `import { SiteService } from '../services/siteService.js';\n`;
    out += `import { FormService } from '../services/formService.js';\n`;
    out += `import { NotificationService } from '../services/notificationService.js';\n`;
    out += `import { store } from '../store.js';\n`;
    
    out += `
export const STATUS_LABELS = {
    DRAFT: 'Bản nháp',
    SUBMITTED: 'Chờ duyệt',
    GATE1: 'Survey / RSO',
    GATE2: 'Sitepack / T-Code',
    GATE3: 'Deal / P-Code',
    FINISH: 'Đã hoàn thành',
    REJECTED: 'Đã từ chối'
};
window.STATUS_LABELS = STATUS_LABELS;
`;
    
    out += globalsContent;
    
    // Now we must fix the async issues in globals.js
    out = out.replace(/window\.save = \(st\) => \{/g, 'window.save = async (st) => {');
    out = out.replace(/window\.upStatus = \(id, st\) => \{/g, 'window.upStatus = async (id, st) => {');
    out = out.replace(/window\.doComment = \(id\) => \{/g, 'window.doComment = async (id) => {');
    out = out.replace(/window\.unlock = \(id\) => \{/g, 'window.unlock = async (id) => {');
    out = out.replace(/window\.reqEdit = \(id\) => \{/g, 'window.reqEdit = async (id) => {');
    out = out.replace(/window\.mpsaPrompt = \(id\) => \{/g, 'window.mpsaPrompt = async (id) => {');
    out = out.replace(/window\.ver2 = \(id\) => \{/g, 'window.ver2 = async (id) => {');
    out = out.replace(/window\.exportCSV = \(\) => \{/g, 'window.exportCSV = async () => {');
    out = out.replace(/window\.printSelected = \(\) => \{/g, 'window.printSelected = async () => {');
    out = out.replace(/handleRoute\(\)/g, 'if (window.router) window.router.handleRoute()');
    
    const hrIndex = out.indexOf('function handleRoute()');
    if (hrIndex !== -1) {
        out = out.substring(0, hrIndex);
    }
    const htmlIndex = out.indexOf('</script>');
    if (htmlIndex !== -1) {
        out = out.substring(0, htmlIndex);
    }
    
    fs.writeFileSync(path.join(__dirname, 'src/js/globals.js'), out, 'utf-8');
    console.log('Successfully split MapView into MapView and globals.js');
} else {
    console.log('Marker not found!');
}
