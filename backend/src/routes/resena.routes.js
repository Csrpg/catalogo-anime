import { Router } from "express";
import {
  obtenerResenasPorAnime,
  crearResena,
  actualizarResena,
  eliminarResena,
} from "../controllers/resena.controller.js";
import { proteger } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/:animeId", obtenerResenasPorAnime); // pública
router.post("/:animeId", proteger, crearResena);
router.put("/:id", proteger, actualizarResena);
router.delete("/:id", proteger, eliminarResena);

export default router;
