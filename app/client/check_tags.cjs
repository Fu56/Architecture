
const fs = require('fs');
const content = fs.readFileSync('e:/Fuad/Architecture/app/client/src/pages/admin/ManageUsers.tsx', 'utf8');

// A slightly better parser that handles multi-line tags
const lines = content.split('\n');
let divStack = [];
let formStack = [];
let braceStack = [];

let tagRegex = /<(\/?)(div|form)(?![a-zA-Z0-9])([^>]*?)(\/?)>/g;

for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    let match;
    while ((match = tagRegex.exec(line)) !== null) {
        let isClosing = match[1] === '/';
        let tagName = match[2];
        let attributes = match[3];
        let isSelfClosing = match[4] === '/';

        if (isSelfClosing) continue;

        if (tagName === 'div') {
            if (isClosing) {
                if (divStack.length === 0) {
                    console.log(`Stray </div> at line ${i + 1}`);
                } else {
                    divStack.pop();
                }
            } else {
                divStack.push(i + 1);
            }
        } else if (tagName === 'form') {
            if (isClosing) {
                if (formStack.length === 0) {
                    console.log(`Stray </form> at line ${i + 1}`);
                } else {
                    formStack.pop();
                }
            } else {
                formStack.push(i + 1);
            }
        }
    }
    
    // Check braces too
    for (let char of line) {
        if (char === '{') braceStack.push(i + 1);
        if (char === '}') {
            if (braceStack.length === 0) {
                console.log(`Stray } at line ${i + 1}`);
            } else {
                braceStack.pop();
            }
        }
    }
}

if (divStack.length > 0) console.log(`Unclosed div tags opened at lines: ${divStack.join(', ')}`);
if (formStack.length > 0) console.log(`Unclosed form tags opened at lines: ${formStack.join(', ')}`);
if (braceStack.length > 0) console.log(`Unclosed braces { opened at lines: ${braceStack.join(', ')}`);
