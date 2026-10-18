import { describe, it, expect } from 'vitest';
import { Pasteleria } from '../../src/models/pasteleria.js';

describe('Clase Pasteleria', () => {
    it('debería inicializarse con las propiedades correctas heredadas de Producto', () => {
        const pasteleria = new Pasteleria(1, 'Medialuna de manteca', 800);

        expect(pasteleria.id).toBe(1);
        expect(pasteleria.nombre).toBe('Medialuna de manteca');
        expect(pasteleria.precioBase).toBe(800);
    });

    it('debería retornar el tipo "Pastelería"', () => {
        const pasteleria = new Pasteleria(2, 'Cañoncito de dulce de leche', 900);
        
        expect(pasteleria.tipo).toBe('Pastelería');
    });

    it('debería calcular el precio devolviendo exactamente el precio base', () => {
        const pasteleria = new Pasteleria(3, 'Porción de Chocotorta', 4500);
        
        expect(pasteleria.calcularPrecio()).toBe(4500);
    });

    it('debería generar el DTO correctamente con las propiedades base y el precio calculado', () => {
        const pasteleria = new Pasteleria(4, 'Alfajor de maicena', 1200);
        const dto = pasteleria.toDTO();

        expect(dto).toEqual({
            id: 4,
            nombre: 'Alfajor de maicena',
            tipo: 'Pastelería',
            precioBase: 1200,
            precio: 1200, // En Pastelería el precio es igual al precioBase
        });
    });
});