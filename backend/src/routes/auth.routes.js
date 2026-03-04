import { Router } from "express";
import {
  registro,
  login,
  obtenerPerfil,
  actualizarPerfil,
} from "../controllers/auth.controller.js";
import { proteger } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/registro", registro);
router.post("/login", login);
router.get("/perfil", proteger, obtenerPerfil);
router.put("/perfil", proteger, actualizarPerfil);

export default router;
