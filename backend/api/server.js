import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());

const GOOGLE_SCRIPT_URL = process.env.GOOGLE_SCRIPT_URL;
const PORT = process.env.PORT || 4000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, "../public")));

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../public", "index.html"));
});

app.get("/api/products", async (req, res) => {
    try {
        if (!GOOGLE_SCRIPT_URL) {
            throw new Error("GOOGLE_SCRIPT_URL не установлен");
        }

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

app.listen(PORT, () => {
    console.log(`✅ Сервер запущен на http://localhost:${PORT}`);
});

export default app;
