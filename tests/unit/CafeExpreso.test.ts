import { describe, it, expect } from 'vitest';
import { CafeExpreso, PRECIO_BASE_EXPRESO } from '../../src/models/CafeExpreso.js';
import type { Variedad } from '../../src/models/Variedad.js';


// Mock de la interfaz Variedad para los tests
const mockVariedad: Variedad = {
    nombre: 'Colombia',
    precioPorGramo: 10,
} as Variedad;

describe('Clase CafeExpreso', () => {
    it('debería inicializarse con el nombre dinámico, precio base constante y tipo correcto', () => {
        const expreso = new CafeExpreso(1, 'Pocillo', mockVariedad);

        expect(expreso.id).toBe(1);
        expect(expreso.nombre).toBe('Expreso Pocillo Colombia');
        expect(expreso.precioBase).toBe(PRECIO_BASE_EXPRESO); // 2500
        expect(expreso.tamano).toBe('Pocillo');
        expect(expreso.variedad).toEqual(mockVariedad);
        expect(expreso.tipo).toBe('Expreso');
    });

    it('debería retornar la cantidad de gramos correcta según el tamaño "Pocillo"', () => {
        const expreso = new CafeExpreso(1, 'Pocillo', mockVariedad);
        expect(expreso.gramos).toBe(18);
    });

    it('debería retornar la cantidad de gramos correcta según el tamaño "Mediano"', () => {
        const expreso = new CafeExpreso(2, 'Mediano', mockVariedad);
        expect(expreso.gramos).toBe(27);
    });

    it('debería retornar la cantidad de gramos correcta según el tamaño "Taza grande"', () => {
        const expreso = new CafeExpreso(3, 'Taza grande', mockVariedad);
        expect(expreso.gramos).toBe(36);
    });

    it('debería calcular el precio total correctamente usando las propiedades heredadas', () => {
        // Para Pocillo (18 gramos) y variedad a 10 por gramo
        const expreso = new CafeExpreso(1, 'Pocillo', mockVariedad);
        
        // costoCafe = 18 * 10 = 180
        // precio total = 2500 + 180 = 2680
        expect(expreso.costoCafe).toBe(180);
        expect(expreso.calcularPrecio()).toBe(2680);
    });

    it('debería generar el DTO correctamente', () => {
        const expreso = new CafeExpreso(1, 'Pocillo', mockVariedad);
        const dto = expreso.toDTO();

        expect(dto).toEqual({
            id: 1,
            nombre: 'Expreso Pocillo Colombia',
            tipo: 'Expreso',
            precioBase: 2500,
            precio: 2680, 
            tamano: 'Pocillo',
            variedad: 'Colombia',
            gramos: 18,
            costoCafe: 180,
        });
    });
});