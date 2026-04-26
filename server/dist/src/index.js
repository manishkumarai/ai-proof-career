import cors from "cors";
import express from "express";
import morgan from "morgan";
import { initDatabase } from "./lib/db.js";
import apiRouter from "./routes/api.js";
const app = express();
const port = Number(process.env.PORT ?? 4000);
initDatabase();
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));
app.use(express.json({ limit: "2mb" }));
app.use(morgan("dev"));
app.use("/api", apiRouter);
app.listen(port, () => {
    console.log(`AI Career server running on http://localhost:${port}`);
});
