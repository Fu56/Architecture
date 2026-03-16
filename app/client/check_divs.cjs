
const fs = require('fs');
const content = fs.readFileSync('e:/Fuad/Architecture/app/client/src/pages/admin/ManageUsers.tsx', 'utf8');

// Filter out strings and comments to avoid false positives
const cleanContent = content
    .replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, '') // Remove comments
    .replace(/`[\s\S]*?`|'[\s\S]*?'|"[\s\S]*?"/g, ''); // Remove strings

const openingDivs = cleanContent.match(/<div(?![^>]*\/>)/g) || [];
const closingDivs = cleanContent.match(/<\/div>/g) || [];

console.log(`Opening divs (non-self-closing): ${openingDivs.length}`);
console.log(`Closing divs: ${closingDivs.length}`);

const stack = [];
const lines = content.split('\n');
lines.forEach((line, i) => {
    // Crude check for tags in React/JSX
    const opens = line.match(/<div(?![^>]*\/>)/g) || [];
    const closes = line.match(/<\/div>/g) || [];
    opens.forEach(() => stack.push(i + 1));
    closes.forEach(() => {
        if (stack.length > 0) {
            stack.pop();
        } else {
            console.log(`Stray closing div at line ${i + 1}`);
        }
    });
});

if (stack.length > 0) {
    console.log(`Unclosed divs opened at lines: ${stack.join(', ')}`);
} else {
    console.log('All divs properly closed.');
}
