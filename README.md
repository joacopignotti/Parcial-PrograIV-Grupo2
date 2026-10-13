# Cafetería Origen — Parcial I (Programación 4, UTN FRBB)

API REST en TypeScript + Express para organizar los pedidos de la cafetería de Valentina.
Testeada con Vitest + Supertest, siguiendo TDD (rojo → verde → refactor).

## Cómo correrlo

```bash
npm install
npm test            # 80 tests (unitarios + integración)
npm run coverage    # cobertura
npm run typecheck   # tsc --noEmit
npm start           # servidor en http://localhost:3000  (PORT para cambiarlo)
```

## Endpoints

| Método | Ruta | Respuesta |
|---|---|---|
| GET | `/productos` | 200 + lista de productos con su precio calculado |
| GET | `/productos/:id` | 200 + producto · 404 si no existe · 400 si el id es inválido |
| POST | `/pedidos` | 201 + pedido con `total` · 400 si los items son inválidos |
| GET | `/pedidos` | 200 + lista de pedidos |
| GET | `/pedidos/:id` | 200 + pedido · 404 si no existe |
| GET | `/reportes/facturacion` | 200 + `{ "facturacionTotal": 12540 }` |
| GET | `/reportes/mas-vendido` | 200 + `{ "producto": "Expreso", "cantidad": 5 }` · 404 si no hay ventas |

Ejemplos con curl:

```bash
curl localhost:3000/productos/1
curl -X POST localhost:3000/pedidos -H "Content-Type: application/json" \
  -d '{"items":[{"productoId":1,"cantidad":2},{"productoId":19,"cantidad":1}]}'
curl localhost:3000/reportes/facturacion
curl localhost:3000/reportes/mas-vendido
```

## Estructura

```
src/
├─ models/      Producto (abstracta) → Cafe (abstracta) → CafeExpreso, CafeFiltrado
│               Producto → Pasteleria · Variedad · Pedido
├─ data/        catalogo.ts (20 productos, ids 1-20)
├─ services/    ProductoService · PedidoService · ReporteService
├─ routes/      productos · pedidos · reportes (con inyección del servicio)
├─ errors/      ValidationError · NotFoundError
├─ app.ts       crearApp() — arma Express (sin listen)
└─ server.ts    listen
tests/
├─ unit/        modelos y servicios
└─ integration/ endpoints con Supertest
```

## Decisiones de diseño

1. **Herencia + polimorfismo :** `Producto` es abstracta y obliga a implementar `calcularPrecio()`.
   `Cafe` (abstracta) calcula `gramos × precioPorGramo + precioBase`; `CafeExpreso` y `CafeFiltrado`
   solo definen cuántos gramos usa cada tamaño. `Pasteleria` devuelve su precio base.
   Los servicios llaman a `calcularPrecio()` sin saber de qué tipo es el producto.
2. **Catálogo:** cada combinación tipo × tamaño × variedad es un producto con su propio id
   (9 expresos + 9 filtrados + 2 de pastelería = 20). Los precios salen de la tabla del enunciado y
   hay un test por cada fila que lo verifica.
3. **Total guardado en el pedido:** se calcula al crearlo, así la facturación no cambia si algún día
   cambian los precios.
4. **Reglas de la cátedra:** métodos de arrays (`map`, `reduce`, `flatMap`, `find`, `some`) en lugar de
   loops, sin mutar arrays originales, getters que devuelven copias, validaciones con `throw new Error`
   (subclases `ValidationError` / `NotFoundError`).
5. **Testabilidad :** `app` separada de `server`, `crearApp()` como factory (estado limpio por test)
   y routers que reciben el servicio por parámetro.
6. **Aclaraciones:**
   - El reporte "cantidad vendida por producto" agrupa por tipo de producto, como en el ejemplo del
     enunciado: `{ "Expreso": 10, "Filtrado": 4, "Pastelería": 3 }`. Por eso "más vendido" también
     devuelve un tipo (ej. `"Expreso"`).
   - En caso de empate en "más vendido" gana el que se vendió primero.
   - Sin ventas, `/reportes/mas-vendido` responde 404.
   - Todo pedido nace en estado `pendiente`.
   - La facturación suma todos los pedidos.
