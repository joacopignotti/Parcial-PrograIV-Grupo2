import request from "supertest";
import { describe, expect, it } from "vitest";
import { crearApp } from "../../src/app.js";

describe("Rutas de reportes", () => {
  describe("GET /reportes/facturacion", () => {
    it("debe devolver 200 y la facturación total", async () => {
      const app = crearApp();

      const respuesta = await request(app).get("/reportes/facturacion");

      expect(respuesta.status).toBe(200);
      expect(respuesta.body).toHaveProperty("facturacionTotal");
      expect(typeof respuesta.body.facturacionTotal).toBe("number");
    });
  });

  describe("GET /reportes/mas-vendido", () => {
    it("debe devolver 404 si todavía no hay ventas registradas", async () => {
      const app = crearApp();

      const respuesta = await request(app).get("/reportes/mas-vendido");

      expect(respuesta.status).toBe(404);
      expect(respuesta.body).toHaveProperty(
        "message",
        "Todavía no hay ventas registradas",
      );
    });

    it("debe devolver 200 y el producto más vendido cuando hay ventas", async () => {
      const app = crearApp();

      await request(app)
        .post("/pedidos")
        .send({
          items: [
            {
              productoId: 1,
              cantidad: 2,
            },
          ],
        });

      const respuesta = await request(app).get("/reportes/mas-vendido");

      expect(respuesta.status).toBe(200);
      expect(respuesta.body).toHaveProperty("producto");
      expect(respuesta.body).toHaveProperty("cantidad");
    });
  });
});

