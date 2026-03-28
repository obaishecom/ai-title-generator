export default async function handler(req, res) {
  const { topic } = req.body;

  const response = await fetch(
    "https://api-inference.huggingface.co/models/google/flan-t5-large",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.HF_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        inputs: `Generate 10 viral YouTube titles about: ${topic}`
      })
    }
  );

  const data = await response.json();

  let text = data[0]?.generated_text || "No result";

  const titles = text.split("\n").filter(t => t.trim() !== "");

  res.status(200).json({ titles });
}