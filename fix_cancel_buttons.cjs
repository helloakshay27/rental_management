const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

const regexes = [
  /border-red-600\s+text-red-600\s+hover:bg-red-50\s+hover:text-red-700\s+font-medium/g,
  /border-red-600\s+text-red-600\s+hover:bg-red-50\s+hover:text-red-700/g,
  /border-red-600\s+text-red-600\s+hover:bg-red-50\s+w-full/g,
  /border-red-600\s+text-red-600\s+hover:bg-red-50/g
];

let filesModified = 0;

walkDir('./src', (filePath) => {
  if (filePath.endsWith('.tsx') || filePath.endsWith('.jsx')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;
    
    // Replace the exact patterns, keeping anything else like 'w-full' if it was matched, wait:
    // Actually, I should just remove the specific classes.
    content = content.replace(/border-red-600\s*/g, '');
    content = content.replace(/text-red-600\s*/g, (match, offset, string) => {
        // Only replace text-red-600 if it's inside a className string with border-red-600 earlier, or we can just replace the whole cluster.
        return match; 
    });
    
    // Safer:
    let newContent = original;
    regexes.forEach((regex, index) => {
       if (index === 2) {
           newContent = newContent.replace(regex, 'w-full'); // preserve w-full
       } else {
           newContent = newContent.replace(regex, '');
       }
    });

    // Cleanup empty classNames or trailing spaces
    newContent = newContent.replace(/className="\s+"/g, 'className=""');
    newContent = newContent.replace(/className='(.*?)'/g, (m, p1) => `className="${p1.trim()}"`);
    newContent = newContent.replace(/className="(.*?)"/g, (m, p1) => `className="${p1.trim()}"`);

    if (newContent !== original) {
      fs.writeFileSync(filePath, newContent, 'utf8');
      console.log(`Modified: ${filePath}`);
      filesModified++;
    }
  }
});

console.log(`Total files modified: ${filesModified}`);
