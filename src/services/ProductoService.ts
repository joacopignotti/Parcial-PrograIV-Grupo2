import type { Producto } from "../models/Producto.js";
import { NotFoundError } from "../errors/index.js";

export class ProductoService{
    constructor(private readonly productos: readonly Producto[]){}
    
    listar(): Producto[]{
        return [...this.productos];
    }
    
    obtener(id: number): Producto{
        const producto = this.productos.find((p)=> p.id === id);
        if(!producto){
            throw new NotFoundError(`Producto con id ${id} no encontrado`);
        }
        return producto;
    }

}