const fs = require("fs");
const path = require("path");

const dir = "e:/Fuad/Architecture/app/client/src";

const walkSync = (dir, filelist = []) => {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filepath = path.join(dir, file);
    if (fs.statSync(filepath).isDirectory()) {
      if (!filepath.includes("assets") && !filepath.includes("models") && !filepath.includes("context")) {
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

const files = walkSync(dir);

let changes = 0;

files.forEach((file) => {
  let content = fs.readFileSync(file, "utf8");
  
  // Fix bg-white
  let newContent = content.replace(/bg-white dark:bg-card\/([0-9]+)/g, "bg-white/$1 dark:bg-card/$1");
  
  // Fix bg-gray-50
  newContent = newContent.replace(/bg-gray-50 dark:bg-white\/5\/([0-9]+)/g, "bg-gray-50/$1 dark:bg-white/$1");
  
  // Fix bg-gray-100
  newContent = newContent.replace(/bg-gray-100 dark:bg-white\/10\/([0-9]+)/g, "bg-gray-100/$1 dark:bg-white/$1");
  
  // Fix text-[#5A270F]
  newContent = newContent.replace(/text-\[\#5A270F\] dark:text-\[\#EEB38C\]\/([0-9]+)/g, "text-[#5A270F]/$1 dark:text-[#EEB38C]/$1");
  
  // Fix text-[#6C3B1C]
  newContent = newContent.replace(/text-\[\#6C3B1C\] dark:text-\[\#EEB38C\]\/([0-9]+)/g, "text-[#6C3B1C]/$1 dark:text-[#EEB38C]/$1");
  
  // Fix bg-[#EFEDED]
  newContent = newContent.replace(/bg-\[\#EFEDED\] dark:bg-white\/5\/([0-9]+)/g, "bg-[#EFEDED]/$1 dark:bg-white/$1");
  
  // Fix border-[#D9D9C2]
  newContent = newContent.replace(/border-\[\#D9D9C2\] dark:border-white\/10\/([0-9]+)/g, "border-[#D9D9C2]/$1 dark:border-white/$1");

  // Fix text-gray-500
  newContent = newContent.replace(/text-gray-500 dark:text-white\/40\/([0-9]+)/g, "text-gray-500/$1 dark:text-white/$1");

  // Fix text-gray-600
  newContent = newContent.replace(/text-gray-600 dark:text-white\/50\/([0-9]+)/g, "text-gray-600/$1 dark:text-white/$1");

  // Fix text-slate-800
  newContent = newContent.replace(/text-slate-800 dark:text-white\/80\/([0-9]+)/g, "text-slate-800/$1 dark:text-white/$1");

  // Fix text-slate-500
  newContent = newContent.replace(/text-slate-500 dark:text-white\/50\/([0-9]+)/g, "text-slate-500/$1 dark:text-white/$1");

  // A couple odd ones just in case
  newContent = newContent.replace(/dark:bg-white dark:bg-card\/5/g, "dark:bg-white/5");

  if (content !== newContent) {
    fs.writeFileSync(file, newContent);
    changes++;
    console.log("Fixed:", file.replace(dir, ""));
  }
});

console.log("Total files fixed:", changes);
