const fs = require('fs');
let content = fs.readFileSync('src/components/Connect.tsx', 'utf8');

const newHandleSubmit = `  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormStatus("loading");
    
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    
    try {
      const response = await fetch("https://formsubmit.co/ajax/prathapsenthilkumar9@gmail.com", {
        method: "POST",
        body: formData,
      });
      
      if (response.ok) {
        setFormStatus("success");
        form.reset();
      } else {
        setFormStatus("idle");
        alert("Failed to send message. Please try again or email directly.");
      }
    } catch (error) {
      setFormStatus("idle");
      alert("An error occurred. Please try again.");
    }
    
    if (formStatus !== "idle") {
      setTimeout(() => setFormStatus("idle"), 3000);
    }
  };`;

content = content.replace(/const handleSubmit = \(e: React\.FormEvent<HTMLFormElement>\) => \{[\s\S]*?1500\);\n  \};/, newHandleSubmit);

content = content.replace(/<input required type="text" id="name"/g, '<input name="name" required type="text" id="name"');
content = content.replace(/<input required type="email" id="email"/g, '<input name="email" required type="email" id="email"');
content = content.replace(/<textarea required id="message"/g, '<textarea name="message" required id="message"');

fs.writeFileSync('src/components/Connect.tsx', content);
