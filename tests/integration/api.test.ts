import request from "supertest";
import { beforeEach, describe, expect, it } from "vitest";
import { crearApp } from "../../src/app.js";

const EXPRESO_POCILLO_BRASIL = 1; // $5.020
const MUFFIN = 19; // $2.500

describe("API Cafetería Origen (integración)", () => {
  let app: ReturnType<typeof crearApp>;

  beforeEach(() => {
    app = crearApp(); 
  });


//PRODUCTOS GET

  describe("GET /productos", () => {
    it("responde 200 con los 20 productos y su precio calculado", async () => {
      const res = await request(app).get("/productos");
      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(20);
      expect(res.body[0]).toMatchObject({
        id: 1,
        nombre: "Expreso Pocillo Brasil",
        tipo: "Expreso",
        precioBase: 2500,
        precio: 5020,
      });
    });
  });

// PRODUCTOS GET POR ID

  describe("GET /productos/:id", () => {
    it("responde 200 con el producto pedido", async () => {
      const res = await request(app).get("/productos/19");
      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({ id: 19, nombre: "Muffin de chocolate", precio: 2500 });
    });

    it("responde 404 si no existe", async () => {
      const res = await request(app).get("/productos/999");
      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty("message");
    });

    it("responde 400 si el id no es un número", async () => {
      const res = await request(app).get("/productos/abc");
      expect(res.status).toBe(400);
    });
  });


  // PEDDIDOS POST

  describe("POST /pedidos", () => {
    it("responde 201 con el pedido y su total calculado", async () => {
      const res = await request(app)
        .post("/pedidos")
        .send({ items: [{ productoId: EXPRESO_POCILLO_BRASIL, cantidad: 2 }, { productoId: MUFFIN, cantidad: 1 }] });

      expect(res.status).toBe(201);
      expect(res.body).toEqual({
        id: 1,
        items: [
          { productoId: EXPRESO_POCILLO_BRASIL, cantidad: 2 },
          { productoId: MUFFIN, cantidad: 1 },
        ],
        estado: "pendiente",
        total: 12540,
      });
    });

    it.each([
      ["sin body", undefined],
      ["items vacío", { items: [] }],
      ["cantidad 0", { items: [{ productoId: MUFFIN, cantidad: 0 }] }],
      ["producto inexistente", { items: [{ productoId: 999, cantidad: 1 }] }],
    ])("responde 400 %s", async (_caso, body) => {
      const res = await request(app).post("/pedidos").send(body);
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty("message");
    });

    it("responde 400 si el JSON es inválido", async () => {
      const res = await request(app)
        .post("/pedidos")
        .set("Content-Type", "application/json")
        .send("{ esto no es json");
      expect(res.status).toBe(400);
    });
  });


//PEDIDOS GET Y GET POR ID 

  describe("GET /pedidos y GET /pedidos/:id", () => {
    it("GET /pedidos responde 200 con lista vacía al inicio", async () => {
      const res = await request(app).get("/pedidos");
      expect(res.status).toBe(200);
      expect(res.body).toEqual([]);
    });

    it("GET /pedidos lista los pedidos creados", async () => {
      await request(app).post("/pedidos").send({ items: [{ productoId: MUFFIN, cantidad: 1 }] });
      await request(app).post("/pedidos").send({ items: [{ productoId: MUFFIN, cantidad: 2 }] });

      const res = await request(app).get("/pedidos");
      expect(res.body).toHaveLength(2);
      expect(res.body.map((p: { total: number }) => p.total)).toEqual([2500, 5000]);
    });

    it("GET /pedidos/:id devuelve el pedido pedido", async () => {
      await request(app).post("/pedidos").send({ items: [{ productoId: MUFFIN, cantidad: 1 }] });
      const res = await request(app).get("/pedidos/1");
      expect(res.status).toBe(200);
      expect(res.body.id).toBe(1);
    });

    it("GET /pedidos/:id responde 404 si no existe", async () => {
      const res = await request(app).get("/pedidos/42");
      expect(res.status).toBe(404);
    });
  });



//REPORTES GET

  describe("GET /reportes", () => {
    it("facturacion es 0 sin pedidos", async () => {
      const res = await request(app).get("/reportes/facturacion");
      expect(res.status).toBe(200);
      expect(res.body).toEqual({ facturacionTotal: 0 });
    });

    it("facturacion suma todos los pedidos", async () => {
      await request(app).post("/pedidos").send({ items: [{ productoId: EXPRESO_POCILLO_BRASIL, cantidad: 2 }] });
      await request(app).post("/pedidos").send({ items: [{ productoId: MUFFIN, cantidad: 1 }] });

      const res = await request(app).get("/reportes/facturacion");
      expect(res.body).toEqual({ facturacionTotal: 12540 });
    });

    it("mas-vendido responde 404 si todavía no hay ventas", async () => {
      const res = await request(app).get("/reportes/mas-vendido");
      expect(res.status).toBe(404);
    });

    it("mas-vendido devuelve el tipo de producto con más unidades", async () => {
      await request(app).post("/pedidos").send({ items: [{ productoId: EXPRESO_POCILLO_BRASIL, cantidad: 1 }, { productoId: MUFFIN, cantidad: 5 }] });

      const res = await request(app).get("/reportes/mas-vendido");
      expect(res.status).toBe(200);
      expect(res.body).toEqual({ producto: "Pastelería", cantidad: 5 });
    });
  });
});
