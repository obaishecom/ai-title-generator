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
          inputs: `Generate 10 viral YouTube titles about: ${topic}`
        })
      }
    );

    const data = await response.json();

    console.log("HF RESPONSE:", JSON.stringify(data)); // 👈 DEBUG

    let text = "";

    if (Array.isArray(data) && data[0]?.generated_text) {
      text = data[0].generated_text;
    } else if (data.error) {
      return res.status(500).json({ error: data.error });
    } else {
      text = JSON.stringify(data);
    }

    const titles = text.split("\n").filter(t => t.trim() !== "");

    res.status(200).json({ titles });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
