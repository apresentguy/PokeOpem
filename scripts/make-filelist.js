const fs = require('fs');
const path = require('path');

const PUBLIC_DIR = path.join(__dirname, '..', 'public');

function walk(dir, base = '') {
  let out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const rel = base ? `${base}/${entry.name}` : entry.name;
    if (entry.isDirectory()) out = out.concat(walk(path.join(dir, entry.name), rel));
    else if (/\.(png|jpe?g|webp|gif)$/i.test(entry.name)) out.push(rel);
  }
  return out;
}

const files = walk(PUBLIC_DIR);
fs.writeFileSync(path.join(PUBLIC_DIR, 'files.json'), JSON.stringify(files));
console.log(`Wrote files.json with ${files.length} images`);