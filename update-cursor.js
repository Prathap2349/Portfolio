const fs = require('fs');
let content = fs.readFileSync('src/components/Cursor.tsx', 'utf8');

const oldClass = 'className="fixed top-0 left-0 w-6 h-6 border border-accent-cyan/50 rounded-full pointer-events-none z-[100] flex items-center justify-center hidden md:flex transition-colors"';
const newClass = 'className="fixed top-0 left-0 w-6 h-6 border border-accent-cyan/80 rounded-full pointer-events-none z-[100] flex items-center justify-center hidden md:flex transition-colors shadow-[0_0_15px_rgba(111,231,255,0.8)] backdrop-blur-sm bg-accent-cyan/10"';

content = content.replace(oldClass, newClass);

fs.writeFileSync('src/components/Cursor.tsx', content);
