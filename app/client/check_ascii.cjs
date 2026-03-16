
const fs = require('fs');
const content = fs.readFileSync('e:/Fuad/Architecture/app/client/src/pages/admin/ManageUsers.tsx', 'utf8');

for (let i = 0; i < content.length; i++) {
    if (content.charCodeAt(i) > 127) {
        console.log(`Non-ASCII character at index ${i} (char code ${content.charCodeAt(i)})`);
    }
}
