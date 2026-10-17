import { describe, it, expect } from 'vitest';
import { CafeFiltrado, PRECIO_BASE_FILTRADO } from '../../src/models/CafeFiltrado.js';
import type { Variedad } from '../../src/models/Variedad.js';

// Mock de la interfaz Variedad para los tests
const mockVariedad: Variedad = {
    nombre: 'Etiopía',
    precioPorGramo: 15,
} as Variedad;

describe('Clase CafeFiltrado', () => {
    it('debería inicializarse con el nombre dinámico, precio base constante y tipo correcto', () => {
        const filtrado = new CafeFiltrado(1, 'Mediano', mockVariedad);

        expect(filtrado.id).toBe(1);
        expect(filtrado.nombre).toBe('Filtrado Mediano Etiopía');
        expect(filtrado.precioBase).toBe(PRECIO_BASE_FILTRADO); // 3200
        expect(filtrado.tamano).toBe('Mediano');
        expect(filtrado.variedad).toEqual(mockVariedad);
        expect(filtrado.tipo).toBe('Filtrado');
    });

    it('debería retornar la cantidad de gramos correcta según el tamaño "Pocillo"', () => {
        const filtrado = new CafeFiltrado(2, 'Pocillo', mockVariedad);
        expect(filtrado.gramos).toBe(6);
    });

    it('debería retornar la cantidad de gramos correcta según el tamaño "Mediano"', () => {
        const filtrado = new CafeFiltrado(3, 'Mediano', mockVariedad);
        expect(filtrado.gramos).toBe(15);
    });

    it('debería retornar la cantidad de gramos correcta según el tamaño "Taza grande"', () => {
        const filtrado = new CafeFiltrado(4, 'Taza grande', mockVariedad);
        expect(filtrado.gramos).toBe(25);
    });

    it('debería calcular el precio total correctamente', () => {
        // Para tamaño Mediano (15 gramos) y variedad a 15 por gramo
        const filtrado = new CafeFiltrado(5, 'Mediano', mockVariedad);
        
        // costoCafe = 15 * 15 = 225
        // precio total = 3200 + 225 = 3425
        expect(filtrado.costoCafe).toBe(225);
        expect(filtrado.calcularPrecio()).toBe(3425);
    });

    it('debería generar el DTO correctamente', () => {
        const filtrado = new CafeFiltrado(6, 'Mediano', mockVariedad);
        const dto = filtrado.toDTO();

        expect(dto).toEqual({
            id: 6,
            nombre: 'Filtrado Mediano Etiopía',
            tipo: 'Filtrado',
            precioBase: 3200,
            precio: 3425, 
            tamano: 'Mediano',
            variedad: 'Etiopía',
            gramos: 15,
            costoCafe: 225,
        });
    });
});