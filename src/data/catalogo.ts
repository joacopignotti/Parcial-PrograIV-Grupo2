import { CafeExpreso } from "../models/CafeExpreso.js";
import { CafeFiltrado } from "../models/CafeFiltrado.js";
import { Pasteleria } from "../models/Pasteleria.js";
import type { Producto } from "../models/Producto.js";
import type { Tamano } from "../models/Cafe.js";
import { VARIEDADES } from "../models/Variedad.js";

const TAMANOS: readonly Tamano[] = ["Pocillo", "Mediano", "Taza grande"];

// Catálogo inicial (el mismo orden que la tabla de precios del enunciado):
//   ids 1-9   -> Expreso   (3 tamaños x 3 variedades)
//   ids 10-18 -> Filtrado  (3 tamaños x 3 variedades)
//   ids 19-20 -> Pastelería
export function crearCatalogo(): Producto[] {
  const combinaciones = TAMANOS.flatMap((tamano) =>
    VARIEDADES.map((variedad) => ({ tamano, variedad })),
  );

  const expresos = combinaciones.map(
    ({ tamano, variedad }, i) => new CafeExpreso(i + 1, tamano, variedad),
  );
  const filtrados = combinaciones.map(
    ({ tamano, variedad }, i) => new CafeFiltrado(expresos.length + i + 1, tamano, variedad),
  );
  const base = expresos.length + filtrados.length;

  return [
    ...expresos,
    ...filtrados,
    new Pasteleria(base + 1, "Muffin de chocolate", 2500),
    new Pasteleria(base + 2, "Porción de torta selva negra", 4200),
  ];
}
