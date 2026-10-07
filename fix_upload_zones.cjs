const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    if (fs.statSync(dirPath).isDirectory()) {
      walkDir(dirPath, callback);
    } else {
      callback(dirPath);
    }
  });
}

let filesModified = 0;

walkDir('./src', (filePath) => {
  if (filePath.endsWith('.tsx') || filePath.endsWith('.jsx')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    // Pattern for the standard drag-drop zone
    const regex = /<div className="border-2 border-dashed border-gray-[0-9]+ rounded-lg p-4 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer relative">([\s\S]*?)<Upload className="h-6 w-6 text-gray-400 mb-1\.5" \/>\s*<p className="text-\[13px\] text-gray-600">Click to upload or drag and drop<\/p>\s*<p className="text-xs text-gray-400 mt-1">([^<]+)<\/p>\s*<\/div>/g;

    content = content.replace(regex, (match, inputHtml, subtext) => {
      return `<div className="border border-dashed border-gray-300 rounded-xl py-10 flex flex-col items-center justify-center bg-white hover:bg-gray-50 transition-colors cursor-pointer relative">\n${inputHtml}<Upload className="h-5 w-5 text-gray-700 mb-2" />\n<p className="text-[14px] font-medium text-gray-900">Drop a file or choose one</p>\n<p className="text-[13px] text-gray-400 mt-1">No file chosen</p>\n</div>`;
    });

    if (content !== original) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Modified drag drop zone in: ${filePath}`);
      filesModified++;
    }
  }
});

console.log(`Total files modified: ${filesModified}`);
