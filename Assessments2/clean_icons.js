const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, 'data');
const files = fs.readdirSync(dataDir).filter(f => f.endsWith('.js'));

// Regex to match icon: '...' or icon: "..." where ... is an emoji
const iconRegex = /icon:\s*['"]([^'"]+)['"]/g;

for (const file of files) {
  const filePath = path.join(dataDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Replace all icon properties that have emojis with an empty string
  let replaced = content.replace(iconRegex, (match, p1) => {
    // If the icon is not empty, we clear it
    if (p1.trim() !== '') {
      return `icon: ''`;
    }
    return match;
  });
  
  if (content !== replaced) {
    fs.writeFileSync(filePath, replaced, 'utf8');
    console.log(`Cleaned icons in ${file}`);
  }
}
console.log('Finished cleaning data files.');
