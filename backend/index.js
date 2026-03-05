import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./src/config/db.js";
import { errorHandler, notFound } from "./src/middleware/error.middleware.js";
import { requestLogger } from "./src/middleware/logger.middleware.js";
import authRoutes from "./src/routes/auth.routes.js";
import animeRoutes from "./src/routes/anime.routes.js";
import favoritoRoutes from "./src/routes/favorito.routes.js";
import resenaRoutes from "./src/routes/resena.routes.js";
import adminRoutes from "./src/routes/admin.routes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

connectDB();

app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:3000"],
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);

app.use("/api/auth", authRoutes);
app.use("/api/anime", animeRoutes);
app.use("/api/favoritos", favoritoRoutes);
app.use("/api/resenas", resenaRoutes);
app.use("/api/admin", adminRoutes);

app.get("/api/health", (req, res) => {
  res.json({ estado: "ok", mensaje: "Servidor funcionando correctamente" });
});

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
  console.log(`Entorno: ${process.env.NODE_ENV}`);
});
