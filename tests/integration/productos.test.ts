import request from "supertest";
import { describe, expect, it } from "vitest";
import { crearApp } from "../../src/app.js";

describe("Rutas de productos", () => {
  describe("GET /productos", () => {
    it("debe devolver 200 y una lista de productos", async () => {
      const app = crearApp();

      const respuesta = await request(app).get("/productos");

      expect(respuesta.status).toBe(200);
      expect(Array.isArray(respuesta.body)).toBe(true);
      expect(respuesta.body.length).toBeGreaterThan(0);
    });
  });

  describe("GET /productos/:id", () => {
    it("debe devolver 200 y un producto existente", async () => {
      const app = crearApp();

      const respuesta = await request(app).get("/productos/1");

      expect(respuesta.status).toBe(200);
      expect(respuesta.body).toHaveProperty("id", 1);
    });

    it("debe devolver 400 cuando el ID no es válido", async () => {
      const app = crearApp();

      const respuesta = await request(app).get("/productos/abc");

      expect(respuesta.status).toBe(400);
    });

    it("debe devolver 404 cuando el producto no existe", async () => {
      const app = crearApp();

      const respuesta = await request(app).get("/productos/9999");

      expect(respuesta.status).toBe(404);
    });
  });
});