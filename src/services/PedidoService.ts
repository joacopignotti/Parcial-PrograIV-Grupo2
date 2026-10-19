import { Pedido, type ItemPedido } from "../models/Pedido.js";
import { NotFoundError, ValidationError } from "../errors/index.js";
import type { ProductoService } from "./ProductoService.js";

export class PedidoService {
    private pedidos: Pedido[] = [];
    private siguienteId=1;
    
    constructor(private productoService: ProductoService) {}

    crear(items: unknown[]): Pedido {
        const itemsValidos= this.validarItems(items);

        const total = itemsValidos.reduce ((acc, item) =>
        acc + this.productoService.obtener(item.productoId).calcularPrecio() * item.cantidad,
              0,
    );  

    const pedido = new Pedido(this.siguienteId++, itemsValidos, "pendiente", total);
    this.pedidos = [...this.pedidos, pedido];
    return pedido;
  }

    listar(): Pedido[] {
    return [...this.pedidos];
  }

  obtener(id: number): Pedido {
    const pedido = this.pedidos.find((p) => p.id === id);
    if (!pedido) {
      throw new NotFoundError(`Pedido ${id} no encontrado`);
    }
    return pedido;
  }

  private validarItems(items: unknown): ItemPedido[] {
    if (!Array.isArray(items) || items.length === 0) {
      throw new ValidationError("El pedido debe tener al menos un item");
    }

    return items.map((item: unknown) => {
      const { productoId, cantidad } = (item ?? {}) as Record<string, unknown>;

      if (!Number.isInteger(productoId)) {
        throw new ValidationError("Cada item debe tener un productoId entero");
      }
      if (!Number.isInteger(cantidad) || (cantidad as number) < 1) {
        throw new ValidationError("La cantidad debe ser un entero mayor o igual a 1");
      }
      const id = productoId as number;
      if (!this.existeProducto(id)) {
        throw new ValidationError(`El producto ${id} no existe`);
      }
      return { productoId: id, cantidad: cantidad as number };
    });
  }

  private existeProducto(id: number): boolean {
    return this.productoService.listar().some((p) => p.id === id);
  }
}
