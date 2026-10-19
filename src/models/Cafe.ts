import { Producto, type  ProductoDTO } from './Producto.js';
import type { Variedad } from './Variedad.js';

export type Tamano = 'Pocillo' | 'Mediano' | 'Taza grande';

export abstract class Cafe extends Producto {
    constructor(
        id: number,
        nombre: string,
        precioBase: number,
        readonly tamano: Tamano,
        readonly variedad: Variedad,


    ) {
        super(id, nombre, precioBase);
    }


    abstract get gramos(): number;

    get costoCafe(): number {
        return this.gramos * this.variedad.precioPorGramo;

    }

    calcularPrecio(): number {
        return this.precioBase + this.costoCafe;
    }
    override toDTO(): ProductoDTO {
        return {
            ...super.toDTO(),
            tamano: this.tamano,
            variedad: this.variedad.nombre,
            gramos: this.gramos,
            costoCafe: this.costoCafe,
       };
    }
}