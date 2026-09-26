const express = require("express");

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        name: "OscuroAI",
        status: "online",
        message: "OscuroAI Backend funcionando 🚀"
    });
});

app.post("/generate", async (req, res) => {

    const { prompt } = req.body;

    if (!prompt) {
        return res.status(400).json({
            error: "Falta el prompt"
        });
    }

    console.log("Solicitud recibida:", prompt);

    // Todavía no conectamos la IA.
    // Primero comprobamos Roblox → servidor.

    res.json({
        success: true,
        message: "OscuroAI recibió tu solicitud",
        prompt: prompt
    });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`OscuroAI funcionando en puerto ${PORT}`);
});
