const fs = require('fs');
let content = fs.readFileSync('src/components/NetworkBackground.tsx', 'utf8');

// Increase base particle speed
content = content.replace(/this\.vx = \(Math\.random\(\) - 0\.5\) \* 0\.5;/g, 'this.vx = (Math.random() - 0.5) * 1.5;');
content = content.replace(/this\.vy = \(Math\.random\(\) - 0\.5\) \* 0\.5;/g, 'this.vy = (Math.random() - 0.5) * 1.5;');

// Increase magnetic pull and range
content = content.replace(/if \(mouseDistance < 200\) \{/g, `
        // Draw a soft glowing aura around the cursor inside the canvas
        if (i === 0 && mouseRef.current.x !== -1000) {
          const gradient = ctx.createRadialGradient(
            mouseRef.current.x, mouseRef.current.y, 0,
            mouseRef.current.x, mouseRef.current.y, 400
          );
          gradient.addColorStop(0, "rgba(111, 231, 255, 0.15)");
          gradient.addColorStop(1, "rgba(111, 231, 255, 0)");
          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(mouseRef.current.x, mouseRef.current.y, 400, 0, Math.PI * 2);
          ctx.fill();
        }

        if (mouseDistance < 350) {`);

content = content.replace(/const mouseDistance = Math\.sqrt\(mouseDx \* mouseDx \+ mouseDy \* mouseDy\);/g, `const mouseDistance = Math.sqrt(mouseDx * mouseDx + mouseDy * mouseDy);`);
content = content.replace(/ctx\.strokeStyle = \`rgba\\(111, 231, 255, \\$\{0\.3 \* \(1 - mouseDistance \/ 200\)\}\\)\`;/g, 'ctx.strokeStyle = `rgba(111, 231, 255, ${0.4 * (1 - mouseDistance / 350)})`;');
content = content.replace(/particles\[i\]\.x -= mouseDx \* 0\.01;/g, 'particles[i].x -= mouseDx * 0.04;');
content = content.replace(/particles\[i\]\.y -= mouseDy \* 0\.01;/g, 'particles[i].y -= mouseDy * 0.04;');

fs.writeFileSync('src/components/NetworkBackground.tsx', content);
