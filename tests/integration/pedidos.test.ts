import request from "supertest";
import { describe, expect, it } from "vitest";
import { crearApp } from "../../src/app.js";

describe("Rutas de pedidos", () => {
  describe("POST /pedidos", () => {
    it("debe crear un pedido y devolver 201", async () => {
      const app = crearApp();

      const respuesta = await request(app)
        .post("/pedidos")
        .send({
          items: [
            {
              productoId: 1,
              cantidad: 2,
            },
          ],
        });

      expect(respuesta.status).toBe(201);
      expect(respuesta.body).toHaveProperty("id");
    });

    it("debe devolver 400 si los items son inválidos", async () => {
      const app = crearApp();

      const respuesta = await request(app)
        .post("/pedidos")
        .send({
          items: [],
        });

      expect(respuesta.status).toBe(400);
    });
  });

  describe("GET /pedidos", () => {
    it("debe devolver 200 y una lista de pedidos", async () => {
      const app = crearApp();

      const respuesta = await request(app).get("/pedidos");

      expect(respuesta.status).toBe(200);
      expect(Array.isArray(respuesta.body)).toBe(true);
    });
  });

  describe("GET /pedidos/:id", () => {
    it("debe devolver 200 al consultar un pedido existente", async () => {
      const app = crearApp();

      const creado = await request(app)
        .post("/pedidos")
        .send({
          items: [
            {
              productoId: 1,
              cantidad: 2,
            },
          ],
        });

      const respuesta = await request(app).get(
        `/pedidos/${creado.body.id}`,
      );

      expect(respuesta.status).toBe(200);
      expect(respuesta.body.id).toBe(creado.body.id);
    });

    it("debe devolver 400 si el ID no es válido", async () => {
      const app = crearApp();

      const respuesta = await request(app).get("/pedidos/abc");

      expect(respuesta.status).toBe(400);
    });

    it("debe devolver 404 si el pedido no existe", async () => {
      const app = crearApp();

      const respuesta = await request(app).get("/pedidos/9999");

      expect(respuesta.status).toBe(404);
    });
  });
});


