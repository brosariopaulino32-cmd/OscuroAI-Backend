const express = require("express");
const OpenAI = require("openai");

const app = express();

app.use(
    express.json({
        limit: "100kb"
    })
);

// ================================
// OPENAI
// ================================

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

// ================================
// INFORMACIÓN DEL SERVIDOR
// ================================

app.get("/", (req, res) => {
    res.json({
        name: "OscuroAI",
        version: "0.3-TEST",
        status: "online",
        ai: "ready"
    });
});

// ================================
// HEALTH CHECK
// ================================

app.get("/health", (req, res) => {
    res.json({
        success: true,
        service: "OscuroAI Backend",
        version: "0.3-TEST",
        apiKeyConfigured: Boolean(
            process.env.OPENAI_API_KEY
        )
    });
});

// ================================
// GENERAR RESPUESTA
// ================================

app.post("/generate", async (req, res) => {

    console.log("");
    console.log("==============================");
    console.log("NUEVA SOLICITUD OSCURO AI");
    console.log("==============================");

    try {

        const prompt = req.body?.prompt;

        console.log(
            "Prompt recibido:",
            prompt
        );

        // ================================
        // VALIDAR PROMPT
        // ================================

        if (
            !prompt ||
            typeof prompt !== "string" ||
            prompt.trim().length === 0
        ) {

            console.log("ERROR: Prompt vacío");

            return res.status(400).json({
                success: false,
                error: "Debes escribir una instrucción."
            });
        }

        if (prompt.length > 4000) {

            console.log(
                "ERROR: Prompt demasiado largo"
            );

            return res.status(400).json({
                success: false,
                error:
                    "La instrucción es demasiado larga."
            });
        }

        // ================================
        // COMPROBAR API KEY
        // ================================

        if (!process.env.OPENAI_API_KEY) {

            console.error(
                "ERROR: OPENAI_API_KEY no está configurada."
            );

            return res.status(500).json({
                success: false,
                error:
                    "La API de OscuroAI no está configurada."
            });
        }

        console.log(
            "API Key configurada: SI"
        );

        console.log(
            "Enviando solicitud a OpenAI..."
        );

        // ================================
        // OPENAI
        // ================================

        const response =
            await openai.responses.create({

                model: "gpt-5.6-luna",

                instructions: `
Eres OscuroAI, un asistente especializado
en desarrollo para Roblox Studio.

Ayudas a crear juegos utilizando Luau.

Tus respuestas deben:

- Usar Luau compatible con Roblox Studio.
- Utilizar únicamente APIs reales de Roblox.
- Crear código organizado y funcional.
- Explicar brevemente dónde colocar cada script.
- Evitar código innecesariamente complicado.
- No afirmar que modificaste Roblox Studio directamente.

Cuando el usuario solicite un sistema de juego,
genera una solución útil y preparada para Roblox Studio.
                `,

                input: prompt
            });

        console.log(
            "OpenAI respondió correctamente."
        );

        // ================================
        // OBTENER TEXTO
        // ================================

        const answer =
            response.output_text ||
            "OscuroAI no generó texto.";

        console.log(
            "Respuesta preparada."
        );

        // ================================
        // ENVIAR A ROBLOX
        // ================================

        return res.json({
            success: true,
            version: "0.3-TEST",
            message: answer
        });

    } catch (error) {

        console.error("");
        console.error(
            "========== ERROR OSCUROAI =========="
        );

        console.error(
            "Nombre:",
            error?.name
        );

        console.error(
            "Mensaje:",
            error?.message
        );

        console.error(
            "Status:",
            error?.status
        );

        console.error(
            "Code:",
            error?.code
        );

        console.error(
            "===================================="
        );

        return res.status(500).json({
            success: false,
            version: "0.3-TEST",
            error:
                error?.message ||
                "No se pudo generar la respuesta."
        });
    }
});

// ================================
// ARRANCAR SERVIDOR
// ================================

const PORT =
    process.env.PORT || 3000;

app.listen(PORT, () => {

    console.log("");
    console.log("==============================");
    console.log("OSCURO AI BACKEND");
    console.log("Version: 0.3-TEST");
    console.log(`Puerto: ${PORT}`);

    console.log(
        "API Key:",
        process.env.OPENAI_API_KEY
            ? "CONFIGURADA"
            : "NO CONFIGURADA"
    );

    console.log("==============================");
    console.log("");
});
