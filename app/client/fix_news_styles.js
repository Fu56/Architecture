import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const newsFile = path.join(__dirname, 'src', 'pages', 'News.tsx');
let content = fs.readFileSync(newsFile, 'utf8');

// Create News.css
const cssContent = `
/* External styles for News.tsx to avoid React inline-style warnings */

.news-bg-grid {
  background-image: linear-gradient(rgba(238,179,140,1) 1px, transparent 1px), linear-gradient(90deg, rgba(238,179,140,1) 1px, transparent 1px);
  background-size: 60px 60px;
}

.font-inter {
  font-family: 'Inter', 'Space Grotesk', system-ui, sans-serif;
}

.font-space-grotesk {
  font-family: 'Space Grotesk', 'Inter', sans-serif;
}

.input-height {
  height: 52px;
}
`;

fs.writeFileSync(path.join(__dirname, 'src', 'pages', 'News.css'), cssContent);

// Top level import
if (!content.includes('import "./News.css"')) {
  content = content.replace(/import .*?;\n/, match => match + 'import "./News.css";\n');
}

// Replace grid style -> className
content = content.replace(/className="absolute inset-0 opacity-\[0\.04\]"/, 'className="absolute inset-0 opacity-[0.04] news-bg-grid"');
content = content.replace(/\s*style={{\s*backgroundImage:[\s\S]*?backgroundSize:\s*"60px 60px",\s*}}/g, '');

// Replacements for other inline styles
content = content.replace(/\s*style={{\s*fontFamily:\s*"'Inter', 'Space Grotesk', system-ui, sans-serif"\s*}}/g, ' className="font-inter"');
content = content.replace(/\s*style={{\s*fontFamily:\s*"'Space Grotesk', 'Inter', sans-serif"\s*}}/g, ' className="font-space-grotesk"');
content = content.replace(/\s*style={{\s*fontFamily:\s*"'Space Grotesk', sans-serif"\s*}}/g, ' className="font-space-grotesk"');
content = content.replace(/\s*style={{\s*fontFamily:\s*"'Inter', sans-serif"\s*}}/g, ' className="font-inter"');

// Inputs
content = content.replace(/\s*style={{\s*height:\s*"52px",\s*fontFamily:\s*"'Inter', sans-serif"\s*}}/g, ' className="input-height font-inter"');
content = content.replace(/\s*style={{\s*height:\s*"52px"\s*}}/g, ' className="input-height"');

fs.writeFileSync(newsFile, content);
console.log("Replaced inline styles in News.tsx");
