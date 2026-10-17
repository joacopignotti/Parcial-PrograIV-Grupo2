import { Router } from "express";
import type { ReporteService } from "../services/ReporteService.js";

export function makeReportesRouter(service: ReporteService) {
  const router = Router();

  router.get("/facturacion", (_req, res) => {
    res.status(200).json({ facturacionTotal: service.facturacionTotal() });
  });

  router.get("/mas-vendido", (_req, res) => {
    const masVendido = service.productoMasVendido();
    if (!masVendido) {
      res.status(404).json({ message: "Todavía no hay ventas registradas" });
      return;
    }
    res.status(200).json(masVendido);
  });

  return router;
}


