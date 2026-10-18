import express, { type ErrorRequestHandler } from "express";
import { crearCatalogo } from "./data/catalogo.js";
import { NotFoundError, ValidationError } from "./errors/index.js";
import { makePedidosRouter } from "./routes/pedidos.js";
import { makeProductosRouter } from "./routes/productos.js";
import { makeReportesRouter } from "./routes/reportes.js";
import { PedidoService } from "./services/PedidoService.js";
import { ProductoService } from "./services/ProductoService.js";
import { ReporteService } from "./services/ReporteService.js";

const manejarErrores: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof ValidationError) {
    res.status(400).json({ message: err.message });
  } else if (err instanceof NotFoundError) {
    res.status(404).json({ message: err.message });
  } else if (err instanceof SyntaxError) {
    res.status(400).json({ message: "JSON inválido" });
  } else {
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

// Factory: cada llamada arma una app con servicios nuevos, así los tests de
// integración arrancan siempre con estado limpio. App y server están separados
// (no hay listen) para que Supertest pueda usar la app sin abrir un puerto.
export function crearApp() {
  const productoService = new ProductoService(crearCatalogo());
  const pedidoService = new PedidoService(productoService);
  const reporteService = new ReporteService(pedidoService, productoService);

  const app = express();
  app.use(express.json());

  app.use("/productos", makeProductosRouter(productoService));
  app.use("/pedidos", makePedidosRouter(pedidoService));
  app.use("/reportes", makeReportesRouter(reporteService));

  app.use(manejarErrores);

  if (process.env.NODE_ENV === 'test') {
    app.post('/__test__/reset', (_req, res) => {
      res.sendStatus(204);
    });

    app.post('/__test__/seed', (_req, res) => {
      res.status(201).json({ created: [] });
    });
  }
  return app;
}
