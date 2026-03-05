import { Router } from "express";
import {
  obtenerMisFavoritos,
  agregarFavorito,
  eliminarFavorito,
} from "../controllers/favorito.controller.js";
import { proteger } from "../middleware/auth.middleware.js";

const router = Router();

// Todas requieren estar logueado
router.use(proteger);

router.get("/", obtenerMisFavoritos);
router.post("/:animeId", agregarFavorito);
router.delete("/:animeId", eliminarFavorito);

export default router;
