const fs = require("fs");
const path = require("path");

const dir = "e:/Fuad/Architecture/app/client/src";

const walkSync = (dir, filelist = []) => {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filepath = path.join(dir, file);
    if (fs.statSync(filepath).isDirectory()) {
      if (
        !filepath.includes("assets") &&
        !filepath.includes("models") &&
        !filepath.includes("context")
      ) {
        filelist = walkSync(filepath, filelist);
      }
    } else {
      if (filepath.endsWith(".tsx")) {
        filelist.push(filepath);
      }
    }
  }
  return filelist;
};

const mapRules = [
  { match: /\bbg-white\b/g, replace: "bg-white dark:bg-card", check: /dark:bg-/ },
  { match: /\bbg-gray-50\b/g, replace: "bg-gray-50 dark:bg-white\/5", check: /dark:bg-/ },
  { match: /\bbg-gray-100\b/g, replace: "bg-gray-100 dark:bg-white\/10", check: /dark:bg-/ },
  { match: /\btext-\[\#5A270F\]\b/g, replace: "text-[#5A270F] dark:text-[#EEB38C]", check: /dark:text-/ },
  { match: /\btext-\[\#6C3B1C\]\b/g, replace: "text-[#6C3B1C] dark:text-[#EEB38C]", check: /dark:text-/ },
  { match: /\bbg-\[\#EFEDED\]\b/g, replace: "bg-[#EFEDED] dark:bg-white\/5", check: /dark:bg-/ },
  { match: /\bbg-\[\#faf9f6\]\b/g, replace: "bg-[#faf9f6] dark:bg-[#1A0B04]", check: /dark:bg-/ },
  { match: /\bborder-\[\#D9D9C2\]\b/g, replace: "border-[#D9D9C2] dark:border-white\/10", check: /dark:border-/ },
  { match: /\btext-gray-500\b/g, replace: "text-gray-500 dark:text-white\/40", check: /dark:text-/ },
  { match: /\btext-gray-600\b/g, replace: "text-gray-600 dark:text-white\/50", check: /dark:text-/ },
  { match: /\btext-gray-900\b/g, replace: "text-gray-900 dark:text-white", check: /dark:text-/ },
  { match: /\btext-slate-900\b/g, replace: "text-slate-900 dark:text-white", check: /dark:text-/ },
  { match: /\btext-slate-800\b/g, replace: "text-slate-800 dark:text-white\/80", check: /dark:text-/ },
  { match: /\btext-slate-500\b/g, replace: "text-slate-500 dark:text-white\/50", check: /dark:text-/ },
];

const files = walkSync(dir);

let changes = 0;

files.forEach((file) => {
  let content = fs.readFileSync(file, "utf8");
  
  // We'll replace class names carefully by splitting into class attributes/variables if possible.
  // A simpler strategy is replacing using word boundaries, but checking if the line already contains dark: equivalent.
  // Doing it line by line is safer.
  
  let lines = content.split('\n');
  let newLines = lines.map(line => {
    let newLine = line;
    for (const rule of mapRules) {
      if (rule.match.test(newLine)) {
        // if this line already contains a related dark class, skip it to avoid messing up manual overrides
        if (!rule.check.test(newLine)) {
            newLine = newLine.replace(rule.match, rule.replace);
        }
      }
    }
    return newLine;
  });

  const newContent = newLines.join('\n');

  if (content !== newContent) {
    fs.writeFileSync(file, newContent);
    changes++;
    console.log("Updated:", file.replace(dir, ""));
  }
});

console.log("Total files updated:", changes);
