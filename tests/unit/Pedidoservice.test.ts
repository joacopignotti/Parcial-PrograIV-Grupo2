import { describe, it, expect, beforeEach } from 'vitest';
import { PedidoService } from '../../src/services/PedidoService.js';
import { ProductoService } from '../../src/services/ProductoService.js';
import { crearCatalogo } from '../../src/data/catalogo.js';
import { NotFoundError, ValidationError } from '../../src/errors/index.js';

// ids del catálogo (ver src/data/catalogo.ts)
const EXPRESO_POCILLO_BRASIL = 1;  // $5.020
const FILTRADO_POCILLO_BRASIL = 10; // $4.040
const MUFFIN = 19;                  // $2.500

describe('PedidoService', () => {
    let service: PedidoService;

    // crear() recibe datos que vienen de un body HTTP, por eso los tests
    // pueden pasarle cualquier cosa (texto, null, undefined...).
    const crear = (items: unknown) => service.crear(items as unknown[]);

    beforeEach(() => {
        service = new PedidoService(new ProductoService(crearCatalogo()));
    });

    describe('crear() - total del pedido', () => {
        it('debería calcular el total de un item como precio × cantidad', () => {
            const pedido = crear([{ productoId: EXPRESO_POCILLO_BRASIL, cantidad: 2 }]);

            expect(pedido.total).toBe(10040);
        });

        it('debería sumar los totales de varios items', () => {
            const pedido = crear([
                { productoId: EXPRESO_POCILLO_BRASIL, cantidad: 2 },  // 10.040
                { productoId: FILTRADO_POCILLO_BRASIL, cantidad: 1 }, // 4.040
                { productoId: MUFFIN, cantidad: 3 },                  // 7.500
            ]);

            expect(pedido.total).toBe(21580);
        });

        it('debería calcular bien el total si el mismo producto aparece dos veces', () => {
            const pedido = crear([
                { productoId: MUFFIN, cantidad: 1 },
                { productoId: MUFFIN, cantidad: 2 },
            ]);

            expect(pedido.total).toBe(7500);
        });
    });

    describe('crear() - datos del pedido', () => {
        it('debería crear el pedido en estado pendiente', () => {
            expect(crear([{ productoId: MUFFIN, cantidad: 1 }]).estado).toBe('pendiente');
        });

        it('debería asignar ids incrementales empezando en 1', () => {
            const p1 = crear([{ productoId: MUFFIN, cantidad: 1 }]);
            const p2 = crear([{ productoId: MUFFIN, cantidad: 1 }]);
            const p3 = crear([{ productoId: MUFFIN, cantidad: 1 }]);

            expect([p1.id, p2.id, p3.id]).toEqual([1, 2, 3]);
        });

        it('debería guardar los items del pedido', () => {
            const pedido = crear([{ productoId: MUFFIN, cantidad: 2 }]);

            expect(pedido.items).toEqual([{ productoId: MUFFIN, cantidad: 2 }]);
        });

        it('debería guardar solo productoId y cantidad, ignorando otros campos', () => {
            const pedido = crear([{ productoId: MUFFIN, cantidad: 1, precio: 1, extra: 'x' }]);

            expect(pedido.items).toEqual([{ productoId: MUFFIN, cantidad: 1 }]);
        });

        it('no debería modificar el array de items que recibe', () => {
            const items = [{ productoId: MUFFIN, cantidad: 1 }];
            crear(items);

            expect(items).toEqual([{ productoId: MUFFIN, cantidad: 1 }]);
        });

        it('debería dejar el pedido guardado y disponible en listar()', () => {
            const pedido = crear([{ productoId: MUFFIN, cantidad: 1 }]);

            expect(service.listar()).toEqual([pedido]);
        });
    });

    describe('crear() - validaciones', () => {
        it.each([
            ['no es un array', 'hola'],
            ['es undefined', undefined],
            ['es null', null],
            ['es un objeto', { productoId: MUFFIN, cantidad: 1 }],
            ['está vacío', []],
        ])('debería lanzar ValidationError si items %s', (_caso, items) => {
            expect(() => crear(items)).toThrow(ValidationError);
        });

        it.each([
            ['es null', null],
            ['es un texto', 'muffin'],
            ['no tiene productoId', { cantidad: 1 }],
            ['tiene productoId como texto', { productoId: '19', cantidad: 1 }],
            ['tiene productoId decimal', { productoId: 1.5, cantidad: 1 }],
            ['no tiene cantidad', { productoId: MUFFIN }],
            ['tiene cantidad 0', { productoId: MUFFIN, cantidad: 0 }],
            ['tiene cantidad negativa', { productoId: MUFFIN, cantidad: -1 }],
            ['tiene cantidad decimal', { productoId: MUFFIN, cantidad: 1.5 }],
            ['tiene cantidad como texto', { productoId: MUFFIN, cantidad: '2' }],
            ['tiene un producto que no existe', { productoId: 999, cantidad: 1 }],
        ])('debería lanzar ValidationError si un item %s', (_caso, item) => {
            expect(() => crear([item])).toThrow(ValidationError);
        });

        it('debería aceptar la cantidad mínima (1)', () => {
            expect(() => crear([{ productoId: MUFFIN, cantidad: 1 }])).not.toThrow();
        });

        it('debería incluir el id en el mensaje cuando el producto no existe', () => {
            expect(() => crear([{ productoId: 999, cantidad: 1 }])).toThrow(/999/);
        });

        it('no debería guardar ningún pedido si un item es inválido', () => {
            expect(() =>
                crear([
                    { productoId: MUFFIN, cantidad: 1 },
                    { productoId: 999, cantidad: 1 },
                ]),
            ).toThrow(ValidationError);

            expect(service.listar()).toHaveLength(0);
        });

        it('no debería consumir un id si el pedido es inválido', () => {
            expect(() => crear([])).toThrow(ValidationError);

            const pedido = crear([{ productoId: MUFFIN, cantidad: 1 }]);
            expect(pedido.id).toBe(1);
        });
    });

    describe('listar()', () => {
        it('debería devolver una lista vacía si todavía no hay pedidos', () => {
            expect(service.listar()).toEqual([]);
        });

        it('debería devolver todos los pedidos en el orden en que se crearon', () => {
            crear([{ productoId: MUFFIN, cantidad: 1 }]);
            crear([{ productoId: MUFFIN, cantidad: 2 }]);

            expect(service.listar().map((p) => p.total)).toEqual([2500, 5000]);
        });

        it('debería devolver una copia: modificarla no afecta al service', () => {
            crear([{ productoId: MUFFIN, cantidad: 1 }]);

            service.listar().pop();

            expect(service.listar()).toHaveLength(1);
        });
    });

    describe('obtener(id)', () => {
        it('debería devolver el pedido que tiene ese id', () => {
            crear([{ productoId: MUFFIN, cantidad: 1 }]);
            const segundo = crear([{ productoId: MUFFIN, cantidad: 2 }]);

            expect(service.obtener(2)).toBe(segundo);
        });

        it('debería lanzar NotFoundError si el pedido no existe', () => {
            expect(() => service.obtener(42)).toThrow(NotFoundError);
        });

        it('debería incluir el id en el mensaje del error', () => {
            expect(() => service.obtener(42)).toThrow(/42/);
        });
    });

    describe('inmutabilidad de los pedidos guardados', () => {
        it('no debería permitir modificar los items de un pedido desde afuera', () => {
            const pedido = crear([{ productoId: MUFFIN, cantidad: 1 }]);

            pedido.items.pop();

            expect(pedido.items).toHaveLength(1);
        });
    });
});