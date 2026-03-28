export default async function handler(req, res) {
  try {
    // ✅ FIX: safely parse body
    let body = req.body;

    if (!body) {
      body = await new Promise((resolve, reject) => {
        let data = "";
        req.on("data", chunk => data += chunk);
        req.on("end", () => resolve(JSON.parse(data)));
        req.on("error", reject);
      });
    }

    const topic = body.topic;

    if (!topic) {
      return res.status(400).json({ error: "No topic provided" });
    }

    // ✅ NOW API WILL RUN
    const response = await fetch(
      "https://router.huggingface.co/hf-inference/models/google/flan-t5-small",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.HF_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          inputs: `Generate 10 YouTube titles about "${topic}". Each on a new line.`
        })
      }
    );

    const data = await response.json();

    console.log("HF RESPONSE:", data);

    if (data.error) {
      return res.status(500).json({ error: data.error });
    }

    const text = data?.[0]?.generated_text || "";

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
