
const fs = require('fs');
const content = fs.readFileSync('e:/Fuad/Architecture/app/client/src/pages/admin/ManageUsers.tsx', 'utf8');

const lines = content.split('\n');
let bracketStack = [];
let braceStack = [];
let startLineComp = -1;

for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('const ManageUsers = () => {')) {
        startLineComp = i + 1;
        braceStack.push(i + 1);
        continue;
    }
    if (startLineComp === -1) continue;

    const chars = lines[i].split('');
    chars.forEach((char) => {
        if (char === '{') braceStack.push(i + 1);
        if (char === '}') {
            if (braceStack.length > 0) {
                const popped = braceStack.pop();
                if (popped === startLineComp && braceStack.length === 0) {
                    console.log(`Component ManageUsers started at line ${startLineComp} and closed at line ${i + 1}`);
                }
            }
        }
    });
}
