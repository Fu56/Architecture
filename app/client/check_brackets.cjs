
const fs = require('fs');
const content = fs.readFileSync('e:/Fuad/Architecture/app/client/src/pages/admin/ManageUsers.tsx', 'utf8');

const stack = [];
const lines = content.split('\n');
lines.forEach((line, i) => {
    const chars = line.split('');
    chars.forEach((char) => {
        if (char === '(') stack.push({ char: '(', line: i + 1 });
        if (char === ')') {
            if (stack.length > 0) {
                const last = stack[stack.length - 1];
                if (last.char === '(') {
                    stack.pop();
                } else {
                    console.log(`Stray closing bracket ) at line ${i + 1}`);
                }
            } else {
                console.log(`Stray closing bracket ) at line ${i + 1}`);
            }
        }
    });
});

if (stack.length > 0) {
    console.log(`Unclosed brackets ( opened at lines: ${stack.map(s => s.line).join(', ')}`);
} else {
    console.log('All brackets properly closed.');
}
