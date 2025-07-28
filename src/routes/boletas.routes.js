import { Router } from "express";

import {
  obtenerBoletas,
  obtenerBoletasporId,
  crearBoleta,
} from "../controllers/boletas.controller.js";

const router = Router();

router.get("/", obtenerBoletas);
router.get("/:id", obtenerBoletasporId);
router.post("/", crearBoleta);

export default router;
