import { Router } from "express";
import {
  getProductos,
  crearProductos,
  editarProductos,
} from "../controllers/productos.controller.js";

const router = Router();

router.get("/", getProductos);
router.post("/", crearProductos);
router.put("/:id", editarProductos);

export default router;
