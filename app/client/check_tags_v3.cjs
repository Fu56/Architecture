
const fs = require('fs');
let content = fs.readFileSync('e:/Fuad/Architecture/app/client/src/pages/admin/ManageUsers.tsx', 'utf8');

// Strip comments
content = content.replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, '');

let divStack = [];
let formStack = [];

// Regex to match tags properly
// Handle multi-line tags
let tagRegex = /<(\/?)(div|form)(?![a-zA-Z0-9])([\s\S]*?)(\/?)>/g;

let match;
while ((match = tagRegex.exec(content)) !== null) {
    let isClosing = match[1] === '/';
    let tagName = match[2];
    let attributes = match[3];
    let isSelfClosing = match[4] === '/';

    if (isClosing) {
        if (tagName === 'div') {
            if (divStack.length > 0) divStack.pop();
            else console.log(`Stray </div> at line ${content.substring(0, match.index).split('\n').length}`);
        } else if (tagName === 'form') {
            if (formStack.length > 0) formStack.pop();
            else console.log(`Stray </form> at line ${content.substring(0, match.index).split('\n').length}`);
        }
    } else if (!isSelfClosing) {
        let line = content.substring(0, match.index).split('\n').length;
        if (tagName === 'div') divStack.push(line);
        if (tagName === 'form') formStack.push(line);
    }
}

console.log('Final Div Stack size:', divStack.length);
if (divStack.length > 0) console.log('Unclosed div lines:', divStack);
console.log('Final Form Stack size:', formStack.length);
if (formStack.length > 0) console.log('Unclosed form lines:', formStack);
