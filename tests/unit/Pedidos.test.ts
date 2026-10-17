import { describe, it, expect } from 'vitest';
import { Pedido, type ItemPedido } from '../../src/models/pedido.js';

describe('Clase Pedido', () => {
    const mockItems: ItemPedido[] = [
        { productoId: 10, cantidad: 2 },
        { productoId: 15, cantidad: 1 },
    ];

    it('debería inicializarse con las propiedades correctas', () => {
        const pedido = new Pedido(1, mockItems, 'pendiente', 5000);

        expect(pedido.id).toBe(1);
        expect(pedido.estado).toBe('pendiente');
        expect(pedido.total).toBe(5000);
    });

    it('debería devolver una copia de los items en el getter "items" evitando referencias directas', () => {
        const pedido = new Pedido(2, mockItems, 'entregado', 2500);
        const itemsObtenidos = pedido.items;

        // Debe tener el mismo contenido
        expect(itemsObtenidos).toEqual(mockItems);
        
        // Pero la referencia del array no debe ser la misma
        expect(itemsObtenidos).not.toBe(mockItems); 
        
        // Y los objetos dentro del array también deben ser copias (inmutabilidad)
        expect(itemsObtenidos[0]).not.toBe(mockItems[0]);
    });

    it('debería generar el objeto correctamente con el método toJSON()', () => {
        const pedido = new Pedido(3, mockItems, 'pendiente', 4200);
        
        const jsonOutput = pedido.toJSON();

        expect(jsonOutput).toEqual({
            id: 3,
            items: mockItems,
            estado: 'pendiente',
            total: 4200,
        });
    });
});