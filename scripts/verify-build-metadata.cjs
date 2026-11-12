const fs = require('fs');
const path = require('path');

const htmlPath = path.join(__dirname, '..', '.next/server/app/index.html');
const html = fs.readFileSync(htmlPath, 'utf8');

console.log('--- CANONICAL ---');
const canonicalMatch = html.match(/<link rel="canonical"[^>]*>/);
console.log(canonicalMatch ? canonicalMatch[0] : 'None');

console.log('\n--- OPEN GRAPH METADATA ---');
const ogMatches = html.match(/<meta property="og:[^"]*"[^>]*>/g) || [];
ogMatches.forEach(m => console.log(m));

console.log('\n--- TWITTER METADATA ---');
const twMatches = html.match(/<meta name="twitter:[^"]*"[^>]*>/g) || [];
twMatches.forEach(m => console.log(m));

console.log('\n--- STRUCTURED DATA (JSON-LD) ---');
const ldMatches = html.match(/<script type="application\/ld\+json"[^>]*>(.*?)<\/script>/s);
if (ldMatches) {
  const json = JSON.parse(ldMatches[1]);
  console.log(JSON.stringify(json, null, 2));
} else {
  console.log('No JSON-LD script found!');
}

