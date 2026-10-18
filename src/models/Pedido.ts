export type EstadoPedido = "pendiente" | "entregado" ;

export interface ItemPedido{
    readonly productoId: number;
    readonly cantidad: number;

}

export class Pedido {
    constructor(
        readonly id: number,
        private readonly _items: readonly ItemPedido[],
        readonly estado: EstadoPedido,
        readonly total: number,
    ) {}
    get items(): ItemPedido[] {
        return this._items.map((item)=> ({...item}));
    }    
    toJSON() {
        return{
            id: this.id,
            items: this.items,
            estado: this.estado,
            total: this.total,
        };
    }
}