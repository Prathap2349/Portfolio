const fs = require('fs');
let content = fs.readFileSync('src/components/Connect.tsx', 'utf8');

const newHandleSubmit = `  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const message = formData.get("message") as string;
    
    const subject = encodeURIComponent(\`Portfolio Contact from \${name}\`);
    const body = encodeURIComponent(\`Name: \${name}\\nEmail: \${email}\\n\\nMessage:\\n\${message}\`);
    
    window.location.href = \`mailto:\${profile.email}?subject=\${subject}&body=\${body}\`;
    
    setFormStatus("success");
    form.reset();
    setTimeout(() => setFormStatus("idle"), 3000);
  };`;

content = content.replace(/  const handleSubmit = async \(e: React\.FormEvent<HTMLFormElement>\) => \{[\s\S]*?3000\);\n    \}\n  \};/, newHandleSubmit);

fs.writeFileSync('src/components/Connect.tsx', content);
