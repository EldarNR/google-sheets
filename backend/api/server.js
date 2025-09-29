import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());

const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyLtMhkOyFll-iSYiNNrskRe_68cwwEEr6kZ7OSIm2bnZhLS-7LjCXHeJJz0g3cGinVUg/exec";

app.get("/api/products", async (req, res) => {
    try {
        const queryString = new URLSearchParams(req.query).toString();
        const finalUrl = queryString ? `${GOOGLE_SCRIPT_URL}?${queryString}` : GOOGLE_SCRIPT_URL;

        const response = await fetch(finalUrl, {
            method: 'GET',
            redirect: 'follow'
        });

        const text = await response.text();
        const data = JSON.parse(text);

        res.json(data);
    } catch (err) {
        console.error("❌ Ошибка:", err.message);
        res.status(500).json({ success: false, error: err.message });
    }
});

const PORT = 4000;
app.listen(PORT, () => {
    console.log(`✅ Сервер запущен на http://localhost:${PORT}`);
    console.log(`📍 Тест напрямую: http://localhost:${PORT}/api/products`);
});
