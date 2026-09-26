const express = require("express");
const OpenAI = require("openai");

const app = express();

app.use(express.json({
    limit: "100kb"
}));

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

// Comprobar servidor
app.get("/", (req, res) => {
    res.json({
        name: "OscuroAI",
        status: "online",
        ai: "ready"
    });
});

// Generar con IA
app.post("/generate", async (req, res) => {

    try {

        const prompt = req.body.prompt;

        if (
            !prompt ||
            typeof prompt !== "string" ||
            prompt.trim().length === 0
        ) {
            return res.status(400).json({
                success: false,
                error: "Debes escribir una instrucción."
            });
        }

        // Evita solicitudes gigantes
        if (prompt.length > 4000) {
            return res.status(400).json({
                success: false,
                error: "La instrucción es demasiado larga."
            });
        }

        console.log(
            "OscuroAI recibió:",
            prompt.substring(0, 200)
        );

        const response = await openai.responses.create({

            model: "gpt-5.6-luna",

            instructions: `
Eres OscuroAI, un asistente especializado en Roblox Studio.

Tu trabajo es ayudar a crear juegos usando Luau.

Genera código claro, funcional y organizado para Roblox Studio.

Cuando el usuario solicite código:
- usa Luau compatible con Roblox Studio;
- evita APIs inexistentes;
- explica brevemente dónde debe colocarse el código;
- no incluyas Markdown innecesario;
- no inventes servicios de Roblox.

Esta es una versión inicial de OscuroAI.
Por ahora devuelve texto y código.
NO afirmes que modificaste Roblox Studio directamente.
            `,

            input: prompt
        });

        const answer =
            response.output_text ||
            "OscuroAI no generó una respuesta.";

        res.json({
            success: true,
            message: answer
        });

    } catch (error) {

        console.error(
            "ERROR OSCUROAI:",
            error
        );

        res.status(500).json({
            success: false,
            error: "No se pudo generar la respuesta."
        });
    }
});

const PORT =
    process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(
        `OscuroAI funcionando en puerto ${PORT}`
    );
});
