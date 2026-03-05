import { Router } from "express";
import {
  obtenerAnimes,
  obtenerGeneros,
  obtenerAnimePorId,
  crearAnime,
  actualizarAnime,
  eliminarAnime,
} from "../controllers/anime.controller.js";
import { proteger, soloAdmin } from "../middleware/auth.middleware.js";

const router = Router();

// Rutas públicas → cualquiera puede acceder
router.get("/", obtenerAnimes);
router.get("/generos", obtenerGeneros);
router.get("/:id", obtenerAnimePorId);

// Rutas privadas → solo admin
router.post("/", proteger, soloAdmin, crearAnime);
router.put("/:id", proteger, soloAdmin, actualizarAnime);
router.delete("/:id", proteger, soloAdmin, eliminarAnime);

export default router;
