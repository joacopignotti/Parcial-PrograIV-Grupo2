import { Cafe, type Tamano } from './Cafe.js';
import type { Variedad } from './Variedad.js';

export const PRECIO_BASE_EXPRESO = 2500;

const GRAMOS_EXPRESO: Readonly<Record<Tamano, number>> = {
    Pocillo: 18,
    Mediano: 27,
    "Taza grande" : 36,
};

export class CafeExpreso extends Cafe {
    constructor(
        id: number,
        tamano: Tamano,
        variedad: Variedad,
    ) {
        super(id,`Expreso ${tamano} ${variedad.nombre}`, PRECIO_BASE_EXPRESO, tamano, variedad);
    }
    
    get tipo(): string {
        return 'Expreso';
    }

    get gramos(): number {
        return GRAMOS_EXPRESO[this.tamano];
    }
}