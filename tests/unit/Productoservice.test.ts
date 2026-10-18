import { describe, it, expect, beforeEach } from 'vitest';
import { ProductoService } from '../../src/services/ProductoService.js';
import { crearCatalogo } from '../../src/data/catalogo.js';
import { NotFoundError } from '../../src/errors/index.js';

describe('ProductoService', () => {
    let service: ProductoService;

    beforeEach(() => {
        service = new ProductoService(crearCatalogo());
    });

    describe('listar()', () => {
        it('debería devolver todos los productos del catálogo', () => {
            expect(service.listar()).toHaveLength(20);
        });

        it('debería listar solo los productos que recibe por constructor', () => {
            const [muffin, torta] = crearCatalogo().slice(18); // ids 19 y 20
            const serviceChico = new ProductoService([muffin, torta]);

            expect(serviceChico.listar()).toEqual([muffin, torta]);
        });

        it('debería devolver una lista vacía si el catálogo está vacío', () => {
            expect(new ProductoService([]).listar()).toEqual([]);
        });

        it('debería devolver una copia: modificarla no afecta al service', () => {
            const lista = service.listar();
            lista.pop();

            expect(lista).toHaveLength(19);
            expect(service.listar()).toHaveLength(20);
        });

        it('debería devolver una copia distinta en cada llamada', () => {
            expect(service.listar()).not.toBe(service.listar());
        });
    });

    describe('obtener(id)', () => {
        it('debería devolver el producto que tiene ese id', () => {
            const producto = service.obtener(1);

            expect(producto.id).toBe(1);
            expect(producto.nombre).toBe('Expreso Pocillo Brasil');
        });

        it('debería devolver un producto que sabe calcular su precio', () => {
            expect(service.obtener(1).calcularPrecio()).toBe(5020);
            expect(service.obtener(19).calcularPrecio()).toBe(2500);
        });

        it('debería devolver el mismo objeto que aparece en listar()', () => {
            const producto = service.obtener(10);

            expect(service.listar()).toContain(producto);
        });

        it.each([0, -1, 21, 999])('debería lanzar NotFoundError si el id %i no existe', (id) => {
            expect(() => service.obtener(id)).toThrow(NotFoundError);
        });

        it('debería incluir el id en el mensaje del error', () => {
            expect(() => service.obtener(999)).toThrow(/999/);
        });
    });
});