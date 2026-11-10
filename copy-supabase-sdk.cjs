const fs = require('node:fs');
const path = require('node:path');

const source = path.join(__dirname, '..', 'node_modules', '@supabase', 'supabase-js', 'dist', 'umd', 'supabase.js');
const destination = path.join(__dirname, '..', 'supabase.js');

if (!fs.existsSync(source)) {
  console.error('Supabase UMD bundle was not found after npm install:', source);
  process.exit(1);
}

fs.copyFileSync(source, destination);
console.log('Published same-origin Supabase SDK:', destination, fs.statSync(destination).size, 'bytes');
