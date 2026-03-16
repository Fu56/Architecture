
const fs = require('fs');
const content = fs.readFileSync('e:/Fuad/Architecture/app/client/src/pages/admin/ManageUsers.tsx', 'utf8');

const cleanContent = content
    .replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, '') // Remove comments
    .replace(/`[\s\S]*?`|'[\s\S]*?'|"[\s\S]*?"/g, ''); // Remove strings

const stack = [];
const lines = content.split('\n');
lines.forEach((line, i) => {
    const chars = line.split('');
    chars.forEach((char) => {
        if (char === '{') stack.push(i + 1);
        if (char === '}') {
            if (stack.length > 0) {
                stack.pop();
            } else {
                console.log(`Stray closing brace at line ${i + 1}`);
            }
        }
    });
});

if (stack.length > 0) {
    console.log(`Unclosed braces opened at lines: ${stack.join(', ')}`);
} else {
    console.log('All braces properly closed.');
}
