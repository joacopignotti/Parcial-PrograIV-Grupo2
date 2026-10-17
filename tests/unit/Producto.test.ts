import { describe, it, expect } from 'vitest';
import { Producto } from '../../src/models/Producto.js';

// 1. Creamos una clase concreta de prueba que hereda de la clase abstracta Producto
class ProductoConcretoMock extends Producto {
    get tipo(): string {
        return 'MockType';
    }

    calcularPrecio(): number {
        // Simulamos un cálculo de precio (ej. agregando un 10% de impuesto)
        return this.precioBase * 1.1; 
    }
}

describe('Clase abstracta Producto', () => {
    it('debería inicializar correctamente sus propiedades base', () => {
        const producto = new ProductoConcretoMock(1, 'Café Test', 1000);

        expect(producto.id).toBe(1);
        expect(producto.nombre).toBe('Café Test');
        expect(producto.precioBase).toBe(1000);
        expect(producto.tipo).toBe('MockType');
    });

    it('debería generar correctamente el DTO con el método toDTO()', () => {
        const producto = new ProductoConcretoMock(2, 'Medialuna Test', 500);
        
        const dto = producto.toDTO();

        // Verificamos que el DTO tenga la estructura exacta y el precio calculado
        expect(dto).toEqual({
            id: 2,
            nombre: 'Medialuna Test',
            tipo: 'MockType',
            precioBase: 500,
            precio: 550, // 500 * 1.1
        });
    });
});