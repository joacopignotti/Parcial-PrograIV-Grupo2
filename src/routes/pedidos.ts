import { Router } from "express";
import type { PedidoService } from "../services/PedidoService.js";
import { parsearId } from "./parsearId.js";

export function makePedidosRouter(service: PedidoService) {
  const router = Router();

  router.post("/", (req, res) => {
    const pedido = service.crear(req.body?.items);
    res.status(201).json(pedido);
  });

  router.get("/", (_req, res) => {
    res.status(200).json(service.listar());
  });

  router.get("/:id", (req, res) => {
    res.status(200).json(service.obtener(parsearId(req.params.id)));
  });

  return router;
}



