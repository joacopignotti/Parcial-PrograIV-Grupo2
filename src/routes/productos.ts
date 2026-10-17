import { Router } from "express";
import type { ProductoService } from "../services/ProductoService.js";
import { parsearId } from "./parsearId.js";

export function makeProductosRouter(service: ProductoService) {
  const router = Router();

  router.get("/", (_req, res) => {
    res.status(200).json(service.listar().map((p) => p.toDTO()));
  });

  router.get("/:id", (req, res) => {
    res.status(200).json(service.obtener(parsearId(req.params.id)).toDTO());
  });

  return router;
}



