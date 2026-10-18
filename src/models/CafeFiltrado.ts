
import { Cafe, type Tamano } from "./Cafe.js";
import type { Variedad } from "./Variedad.js";

export const PRECIO_BASE_FILTRADO = 3200;

const GRAMOS_FILTRADO: Readonly<Record<Tamano, number>> = {
  Pocillo: 6,
  Mediano: 15,
  "Taza grande": 25,
};

export class CafeFiltrado extends Cafe {
  constructor(
        id: number,
        tamano: Tamano,
        variedad: Variedad
    ) {
    super(id, `Filtrado ${tamano} ${variedad.nombre}`, PRECIO_BASE_FILTRADO, tamano, variedad);
  }

  get tipo(): string {
    return "Filtrado";
  }

  get gramos(): number {
    return GRAMOS_FILTRADO[this.tamano];
  }
}