export default async function handler(req, res) {
  try {
    const { topic } = req.body;

    if (!topic) {
      return res.status(400).json({ error: "No topic provided" });
    }

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "meta-llama/llama-3-8b-instruct",
          messages: [
            {
              role: "user",
              content: `Generate 10 viral YouTube titles about "${topic}". Each on a new line.`
            }
          ]
        })
      }
    );

    const data = await response.json();

    console.log("OPENROUTER RESPONSE:", data);

    const text = data?.choices?.[0]?.message?.content;

    if (!text) {
      return res.status(500).json({ error: "No AI response" });
    }

    const titles = text
      .split("\n")
      .map(t => t.trim())
      .filter(t => t.length > 0);

    res.status(200).json({ titles });

  } catch (error) {
    console.error("SERVER ERROR:", error);
    res.status(500).json({ error: error.message });
  }
}
