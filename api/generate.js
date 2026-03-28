export default async function handler(req, res) {
  try {
    const { topic } = req.body;

    const response = await fetch(
      "https://router.huggingface.co/hf-inference/models/google/flan-t5-small",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.HF_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          inputs: `Generate exactly 10 YouTube titles about "${topic}". Each title on a new line.`
        })
      }
    );

    const data = await response.json();

    console.log("HF RESPONSE:", data);

    let text = data?.[0]?.generated_text || "";

    if (!text) {
      return res.status(500).json({ error: "No result from AI" });
    }

    const titles = text.split("\n").filter(t => t.trim() !== "");

    res.status(200).json({ titles });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
