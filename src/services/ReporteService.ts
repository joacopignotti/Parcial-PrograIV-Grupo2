import type { PedidoService } from "./PedidoService.js";
import type { ProductoService } from "./ProductoService.js";

export interface MasVendido {
  producto: string;
  cantidad: number;
}
export class ReporteService {
  constructor(
    private readonly pedidoService: PedidoService,
    private readonly productoService: ProductoService,
  ) {}

  // Suma de los totales de todos los pedidos.
  facturacionTotal(): number {
    return this.pedidoService.listar().reduce((acc, pedido) => acc + pedido.total, 0);
  }

  // { "Expreso": 10, "Filtrado": 4, "Pastelería": 3 }  (agrupado por tipo de producto)
  cantidadVendidaPorProducto(): Record<string, number> {
    return this.pedidoService
      .listar()
      .flatMap((pedido) => pedido.items)
      .reduce<Record<string, number>>((acc, item) => {
        const tipo = this.productoService.obtener(item.productoId).tipo;
        return { ...acc, [tipo]: (acc[tipo] ?? 0) + item.cantidad };
      }, {});
  }

  // Sale del resultado anterior. Si hay empate gana el primero que se vendió.
  productoMasVendido(): MasVendido | undefined {
    const vendidos = Object.entries(this.cantidadVendidaPorProducto());
    if (vendidos.length === 0) return undefined;

    const [producto, cantidad] = vendidos.reduce((max, actual) =>
      actual[1] > max[1] ? actual : max,
    );
    return { producto, cantidad };
  }
}
