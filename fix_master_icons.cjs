const fs = require('fs');
const filePath = 'src/pages/Masters.tsx';
let content = fs.readFileSync(filePath, 'utf8');

// Replace all instances of `color: 'bg-... text-...'` with `color: 'bg-gray-100 text-black'`
content = content.replace(/color:\s*['"`]bg-[a-zA-Z]+-\d+\s+text-[a-zA-Z]+-\d+['"`]/g, "color: 'bg-gray-100 text-black'");

fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully updated Masters.tsx');
