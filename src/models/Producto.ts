export interface ProductoDTO {
    id: number;
    nombre: string;
    tipo: string;
    precioBase: number;
    precio: number;
    [campo: string]: unknown;
}

    export abstract class Producto {
    constructor(
        readonly id: number,
        readonly nombre: string,
        readonly precioBase: number
    ) {}
    abstract get tipo():string;

    abstract calcularPrecio(): number;

    toDTO(): ProductoDTO {
        return {
            id: this.id,
            nombre: this.nombre,
            tipo: this.tipo,
            precioBase: this.precioBase,
            precio: this.calcularPrecio(),
        };
    }
}
