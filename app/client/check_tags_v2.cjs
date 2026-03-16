
const fs = require('fs');
let content = fs.readFileSync('e:/Fuad/Architecture/app/client/src/pages/admin/ManageUsers.tsx', 'utf8');

// Strip comments and strings to avoid false positives
content = content.replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, '');
// content = content.replace(/`[\s\S]*?`|'[\s\S]*?'|"[\s\S]*?"/g, ''); // Be careful with strings as they can contain tags

let divStack = [];
let formStack = [];
let braceStack = [];

// Match opening and closing tags, including self-closing
// Handle multi-line tags by using [^]*? or similar (in JS regex with /s flag)
let tagRegex = /<(\/?)(div|form)(?![a-zA-Z0-9])([\s\S]*?)(\/?)>/g;

let match;
while ((match = tagRegex.exec(content)) !== null) {
    let isClosing = match[1] === '/';
    let tagName = match[2];
    let isSelfClosing = match[5] === '/' || match[3].endsWith('/'); // Simplified self-closing check

    if (isClosing) {
        if (tagName === 'div') divStack.pop();
        if (tagName === 'form') formStack.pop();
    } else if (!isSelfClosing) {
        // Need to find line number
        let line = content.substring(0, match.index).split('\n').length;
        if (tagName === 'div') divStack.push(line);
        if (tagName === 'form') formStack.push(line);
    }
}

// Brace check
for (let i = 0; i < content.length; i++) {
    if (content[i] === '{') braceStack.push(i);
    if (content[i] === '}') braceStack.pop();
}

console.log('Div Stack size:', divStack.length);
if (divStack.length > 0) console.log('Unclosed div lines:', divStack);
console.log('Form Stack size:', formStack.length);
if (formStack.length > 0) console.log('Unclosed form lines:', formStack);
console.log('Brace Stack size:', braceStack.length);
