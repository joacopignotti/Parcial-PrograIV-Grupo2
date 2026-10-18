import { describe, it, expect } from 'vitest';
import { Cafe, type Tamano } from '../../src/models/Cafe.js';
import type { Variedad } from '../../src/models/Variedad.js';

// 1. Creamos un objeto simulado (mock) para cumplir con el tipo Variedad
const mockVariedad: Variedad = {
    nombre: 'Arábica Premium',
    precioPorGramo: 10,
    // Puedes agregar otras propiedades si Variedad las requiere en el futuro
} as Variedad;

// 2. Creamos una clase concreta para testear la clase abstracta Cafe
class CafeConcretoMock extends Cafe {
    get tipo(): string {
        return 'Café Especialidad';
    }

    // Implementamos el método abstracto requerido por Cafe
    get gramos(): number {
        return 15; // Asumimos 15 gramos para este test
    }
}

describe('Clase abstracta Cafe', () => {
    it('debería inicializar correctamente sus propiedades', () => {
        const cafe = new CafeConcretoMock(1, 'Café de Prueba', 500, 'Mediano', mockVariedad);

        expect(cafe.id).toBe(1);
        expect(cafe.nombre).toBe('Café de Prueba');
        expect(cafe.precioBase).toBe(500);
        expect(cafe.tamano).toBe('Mediano');
        expect(cafe.variedad).toEqual(mockVariedad);
    });

    it('debería calcular correctamente el costo del café (gramos * precioPorGramo)', () => {
        const cafe = new CafeConcretoMock(1, 'Café de Prueba', 500, 'Mediano', mockVariedad);
        
        // gramos (15) * precioPorGramo (10) = 150
        expect(cafe.costoCafe).toBe(150);
    });

    it('debería calcular el precio total (precioBase + costoCafe)', () => {
        const cafe = new CafeConcretoMock(1, 'Café de Prueba', 500, 'Mediano', mockVariedad);
        
        // precioBase (500) + costoCafe (150) = 650
        expect(cafe.calcularPrecio()).toBe(650);
    });

    it('debería generar correctamente el DTO extendido', () => {
        const cafe = new CafeConcretoMock(1, 'Café de Prueba', 500, 'Mediano', mockVariedad);
        const dto = cafe.toDTO();

        expect(dto).toEqual({
            id: 1,
            nombre: 'Café de Prueba',
            tipo: 'Café Especialidad',
            precioBase: 500,
            precio: 650, 
            tamano: 'Mediano',
            variedad: 'Arábica Premium',
            gramos: 15,
            costoCafe: 150,
        });
    });
});