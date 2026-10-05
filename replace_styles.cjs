const fs = require('fs');
const path = require('path');

const filesToUpdate = [
  'TokenManager.tsx',
  'QuestionBank.tsx',
  'ScoreRecap.tsx',
  'SettingsProctor.tsx'
];

const dir = path.join(__dirname, 'src', 'Page', 'proctor');

for (const file of filesToUpdate) {
  const filePath = path.join(dir, file);
  if (!fs.existsSync(filePath)) continue;
  
  let content = fs.readFileSync(filePath, 'utf-8');

  // Outer wrapper
  content = content.replace(/className="h-screen overflow-hidden bg-\[url\('\/background\.jpg'\)\] bg-cover bg-center p-4 md:p-6 font-sans text-white flex gap-6 box-border selection:bg-[^"]+"/, 
    'className="h-screen overflow-hidden bg-[url(\'/background.jpg\')] bg-cover bg-center p-4 md:p-6 font-sans text-slate-800 flex gap-6 box-border selection:bg-teal-500/20 relative"');

  // General text colors
  content = content.replace(/text-white\/90/g, 'text-slate-800');
  content = content.replace(/text-white\/80/g, 'text-slate-700');
  content = content.replace(/text-white\/60/g, 'text-slate-500');
  content = content.replace(/text-white\/50/g, 'text-slate-400');
  // Be careful with exact text-white, don't replace inside strings blindly, but we can do safe ones:
  // Card backgrounds and borders
  content = content.replace(/bg-white\/10/g, 'bg-white/50 backdrop-blur-md');
  content = content.replace(/bg-white\/5(?!0)/g, 'bg-white/60');
  content = content.replace(/border-white\/20/g, 'border-white/50');
  content = content.replace(/border-white\/10/g, 'border-white/40');
  
  // Update "text-white" to "text-slate-800" in typical elements
  content = content.replace(/text-white/g, 'text-slate-800');
  // Restore text-white where needed (like blue buttons)
  content = content.replace(/bg-blue-600 hover:bg-blue-700 text-slate-800/g, 'bg-blue-600 hover:bg-blue-700 text-white');
  content = content.replace(/bg-slate-800 hover:bg-slate-900 text-slate-800/g, 'bg-slate-800 hover:bg-slate-900 text-white');
  
  // Specific fixes
  content = content.replace(/text-blue-100/g, 'text-slate-500');
  content = content.replace(/shadow-sm/g, 'shadow-[0_8px_30px_rgb(0,0,0,0.04)]');
  
  // Also fix QuestionBank and others specific styles if they have it
  content = content.replace(/bg-white\/20 hover:bg-white\/30/g, 'bg-white/60 hover:bg-white');
  
  // Specific to table
  content = content.replace(/border-b border-white\/10/g, 'border-b border-slate-200');
  content = content.replace(/border-slate-50/g, 'border-slate-100');
  content = content.replace(/hover:bg-slate-50\/50/g, 'hover:bg-white/40');
  
  fs.writeFileSync(filePath, content, 'utf-8');
}
console.log('Done replacing styles');
