const fs = require('fs');
let content = fs.readFileSync('src/components/Projects.tsx', 'utf8');

// 1. Remove imageRef usage
content = content.replace(/const imageRef = useRef<HTMLDivElement>\(null\);/g, '');

// 2. Remove gsap.to(imageRef.current) block in handleMouseMove
content = content.replace(/gsap\.to\(imageRef\.current, \{[\s\S]*?\}\);/g, '');

// 3. Remove image rendering block
const imageBlockRegex = /<div className="relative h-64 md:h-72 w-full overflow-hidden z-10" style=\{\{ perspective: "1000px" \}\}>[\s\S]*?<\/div>\s*<\/div>/g;
content = content.replace(imageBlockRegex, '');

// 4. Update the card padding and classes
content = content.replace(/<div ref=\{cardRef\} className="project-card group relative flex flex-col bg-white\/5 border border-white\/5 rounded-2xl overflow-hidden hover:border-accent-cyan\/30 transition-colors duration-500">/g, 
  '<div ref={cardRef} className="project-card group relative flex flex-col bg-white/5 border border-white/5 rounded-2xl overflow-hidden hover:border-accent-cyan/30 transition-colors duration-500 h-full min-h-[300px]">');

content = content.replace(/<div className="relative z-10 flex flex-col flex-grow p-6 md:p-8 bg-gradient-to-t from-background to-transparent">/g, 
  '<div className="relative z-10 flex flex-col flex-grow p-6 md:p-8 bg-transparent">');

// 5. Remove 'Image from "next/image";'
content = content.replace(/import Image from "next\/image";/g, '');

fs.writeFileSync('src/components/Projects.tsx', content);
