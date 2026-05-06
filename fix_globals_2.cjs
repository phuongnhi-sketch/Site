const fs = require('fs');
const path = require('path');

const gPath = path.join(__dirname, 'src/js/globals.js');
let content = fs.readFileSync(gPath, 'utf-8');

const marker = `win.document.write(\`<div class="\${index < selectedIds.length - 1 ? 'page-break' : ''}">\`);`;

const insertion = `
                win.document.write(\`<div class="header"><h1>#\${index + 1}. \${site.name}</h1><div class="version-tag">Mã: \${site.code}</div></div>\`);
                win.document.write(\`<img src="\${site.thumb}" class="thumb-img">\`);

                const renderSection = async (data, title) => {
                    const isMasked = (u.role === 'PROJECT' || (site.status === 'FINISH' && u.role !== 'ADMIN') || (site.status === 'REJECTED' && u.role !== 'ADMIN'));
                    win.document.write(\`<h2>\${title}</h2><div class="grid">\`);
                    const fields = await FormService.getFields();
                    fields.forEach(f => {
                        let v = data[f.id] || '';
                        if (isMasked && (f.id === 'f2_1' || f.id === 'f2_2' || f.id === 'f7')) {
                            v = '*******';
                        }
                        let displayVal = v || '---';
                        if (f.num && v && v !== '*******') {
                            const num = parseFloat(v.toString().replace(/,/g, ''));
                            if (!isNaN(num)) displayVal = num.toLocaleString('en-US');
                        }
                        win.document.write(\`<div class="field"><label>\${f.label}</label><p>\${displayVal}</p></div>\`);
                    });
                    win.document.write('</div>');
                };

                const verOpt = window.siteFilters?.exportVer || 'BOTH';
                if (verOpt === 'BOTH') {
                    await renderSection(site.answers || {}, 'PHIÊN BẢN GỐC (V1)');
                    if (site.v2_data) await renderSection(site.v2_data, 'PHIÊN BẢN CHỐT DEAL (V2)');
                } else {
                    const data = site.v2_data || site.answers || {};
                    const title = site.v2_data ? 'PHIÊN BẢN CHỐT DEAL (V2)' : 'PHIÊN BẢN GỐC (V1)';
                    await renderSection(data, title);
                }
`;

content = content.replace(marker, marker + insertion);
fs.writeFileSync(gPath, content, 'utf-8');
console.log('Fixed renderSection');
