async function testRest() {
  const apiKey = process.env.GEMINI_API_KEY;
  const model = process.env.GEMINI_MODEL || "gemini-3.8-flash";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  console.log("Calling REST:", url.replace(apiKey, "[REDACTED]"));
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: "Respond with: OK" }] }]
    })
  });

  console.log("HTTP status:", res.status, res.statusText);
  const data = await res.json();
  console.log("Response text:", JSON.stringify(data.candidates?.[0]?.content?.parts?.[0]?.text || data));
}

testRest();

