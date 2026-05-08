const fs = require('fs');

let c = fs.readFileSync('src/js/views/UserManagementView.js', 'utf8');

// 1. Remove table header
c = c.replace('<th>Tài khoản (Username)</th>', '');

// 2. Remove table column
c = c.replace('<td>${u.username}</td>', '');

// 3. Remove input field div
c = c.replace(
    /<div>\s*<label style="font-weight:700; font-size:0\.85rem">Tài khoản \(Username\) <span style="color:red">\*<\/span><\/label>\s*<input type="text" id="u-username" required style="width:100%; padding:10px; border-radius:10px; border:1px solid #ddd; margin-top:5px">\s*<\/div>/,
    ''
);

// 4. Update showUserModal (remove u-username assignment)
c = c.replace(`document.getElementById('u-username').value = u.username;`, '');
c = c.replace(`document.getElementById('u-username').value = '';`, '');

// 5. Update saveUserModal (map username to email)
c = c.replace(/username: document\.getElementById\('u-username'\)\.value,/g, 'username: email,');
c = c.replace(/username: u\.username,/g, 'username: email,');

fs.writeFileSync('src/js/views/UserManagementView.js', c);
console.log('UserManagementView updated.');
