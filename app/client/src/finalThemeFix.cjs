const fs = require('fs');
const path = require('path');

function walk(dir) {
    let files = [];
    fs.readdirSync(dir).forEach(file => {
        const p = path.join(dir, file);
        if (fs.statSync(p).isDirectory()) {
            files = files.concat(walk(p));
        } else if (p.endsWith('.tsx')) {
            files.push(p);
        }
    });
    return files;
}

const replacements = [
    // Text colors - Seal Brown to Buff
    [/(?<!dark:)text-\[#5A270F\](?!\s*dark:text)/g, 'text-[#5A270F] dark:text-[#EEB38C]'],
    [/(?<!dark:)text-\[#6C3B1C\](?!\s*dark:text)/g, 'text-[#6C3B1C] dark:text-[#EEB38C]/80'],
    [/(?<!dark:)text-\[#92664A\](?!\s*dark:text)/g, 'text-[#92664A] dark:text-[#EEB38C]/40'],
    [/(?<!dark:)text-gray-500(?!\s*dark:text)/g, 'text-gray-500 dark:text-white/40'],
    [/(?<!dark:)text-gray-400(?!\s*dark:text)/g, 'text-gray-400 dark:text-white/30'],

    // Backgrounds - Immersive light grays to dark background/card
    [/(?<!dark:)bg-\[#EFEDED\](?!\s*dark:bg)/g, 'bg-[#EFEDED] dark:bg-background'],
    [/(?<!dark:)bg-\[#FAF9F6\](?!\s*dark:bg)/g, 'bg-[#FAF9F6] dark:bg-background'],
    [/(?<!dark:)bg-\[#FAF8F4\](?!\s*dark:bg)/g, 'bg-[#FAF8F4] dark:bg-white/5'],
    [/(?<!dark:)bg-white(?!\s*(dark:bg-card|dark:bg-background|\/))/g, 'bg-white dark:bg-card'],

    // Borders
    [/(?<!dark:)border-\[#D9D9C2\](?!\s*dark:border)/g, 'border-[#D9D9C2] dark:border-white/10'],
    [/(?<!dark:)border-\[#EEB38C\]\/30(?!\s*dark:border)/g, 'border-[#EEB38C]/30 dark:border-white/5'],
    [/(?<!dark:)border-gray-100(?!\s*dark:border)/g, 'border-gray-100 dark:border-white/10'],

    // Specific bad patterns from previous script
    [ /dark:bg-card dark:bg-primary/g, 'dark:bg-primary'],
    [ /bg-white dark:bg-card\/([0-9]+)/g, 'bg-white/$1 dark:bg-card/$1']
];

const files = walk('.');
files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let original = content;

    replacements.forEach(([regex, replacement]) => {
        content = content.replace(regex, replacement);
    });

    if (content !== original) {
        fs.writeFileSync(file, content);
        console.log(`Updated ${file}`);
    }
});
