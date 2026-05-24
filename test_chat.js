async function test() {
  const res = await fetch('http://localhost:3000/api/chat', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      messages: [
        {role: 'assistant', content: "Hello! I'm **CropCure AI** 🌱 — your expert agricultural assistant. Ask me anything about crops, plant diseases, pests, weather impact, or farming techniques!"},
        {role: 'user', content: 'hi'}
      ]
    })
  });
  console.log('status:', res.status);
  const text = await res.text();
  console.log('response:', text);
}
test();
