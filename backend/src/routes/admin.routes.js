import { Router } from "express";
import {
  obtenerEstadisticas,
  obtenerUsuarios,
  cambiarRolUsuario,
  toggleActivarUsuario,
  eliminarUsuario,
} from "../controllers/admin.controller.js";
import { proteger, soloAdmin } from "../middleware/auth.middleware.js";

const router = Router();

// Todas requieren ser admin
router.use(proteger, soloAdmin);

router.get("/estadisticas", obtenerEstadisticas);
router.get("/usuarios", obtenerUsuarios);
router.put("/usuarios/:id/rol", cambiarRolUsuario);
router.put("/usuarios/:id/activar", toggleActivarUsuario);
router.delete("/usuarios/:id", eliminarUsuario);

export default router;
