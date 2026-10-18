import { describe, it, expect, beforeEach } from 'vitest';
import { ReporteService } from '../../src/services/ReporteService.js';
import { PedidoService } from '../../src/services/PedidoService.js';
import { ProductoService } from '../../src/services/ProductoService.js';
import { crearCatalogo } from '../../src/data/catalogo.js';

// ids del catálogo (ver src/data/catalogo.ts)
const EXPRESO_POCILLO_BRASIL = 1;    // $5.020
const EXPRESO_GRANDE_ETIOPIA = 9;    // $11.140
const FILTRADO_POCILLO_BRASIL = 10;  // $4.040
const MUFFIN = 19;                   // $2.500
const TORTA = 20;                    // $4.200

describe('ReporteService', () => {
    let pedidos: PedidoService;
    let reportes: ReporteService;

    beforeEach(() => {
        const productos = new ProductoService(crearCatalogo());
        pedidos = new PedidoService(productos);
        reportes = new ReporteService(pedidos, productos);
    });

    describe('facturacionTotal()', () => {
        it('debería ser 0 si no hay pedidos', () => {
            expect(reportes.facturacionTotal()).toBe(0);
        });

        it('debería devolver el total de un único pedido', () => {
            pedidos.crear([{ productoId: EXPRESO_POCILLO_BRASIL, cantidad: 2 }]);

            expect(reportes.facturacionTotal()).toBe(10040);
        });

        it('debería sumar los totales de todos los pedidos', () => {
            pedidos.crear([{ productoId: EXPRESO_POCILLO_BRASIL, cantidad: 2 }]); // 10.040
            pedidos.crear([{ productoId: MUFFIN, cantidad: 1 }]);                 // 2.500

            expect(reportes.facturacionTotal()).toBe(12540);
        });

        it('debería actualizarse cuando se crean pedidos nuevos', () => {
            pedidos.crear([{ productoId: MUFFIN, cantidad: 1 }]);
            expect(reportes.facturacionTotal()).toBe(2500);

            pedidos.crear([{ productoId: TORTA, cantidad: 1 }]);
            expect(reportes.facturacionTotal()).toBe(6700);
        });
    });

    describe('cantidadVendidaPorProducto()', () => {
        it('debería devolver un objeto vacío si no hay pedidos', () => {
            expect(reportes.cantidadVendidaPorProducto()).toEqual({});
        });

        it('debería agrupar las cantidades por tipo de producto', () => {
            pedidos.crear([
                { productoId: EXPRESO_POCILLO_BRASIL, cantidad: 3 },
                { productoId: FILTRADO_POCILLO_BRASIL, cantidad: 1 },
                { productoId: MUFFIN, cantidad: 2 },
            ]);

            expect(reportes.cantidadVendidaPorProducto()).toEqual({
                Expreso: 3,
                Filtrado: 1,
                Pastelería: 2,
            });
        });

        it('debería acumular las cantidades entre distintos pedidos', () => {
            pedidos.crear([{ productoId: EXPRESO_POCILLO_BRASIL, cantidad: 3 }]);
            pedidos.crear([{ productoId: EXPRESO_POCILLO_BRASIL, cantidad: 2 }]);

            expect(reportes.cantidadVendidaPorProducto()).toEqual({ Expreso: 5 });
        });

        it('debería sumar variantes distintas del mismo tipo (tamaño o variedad)', () => {
            pedidos.crear([
                { productoId: EXPRESO_POCILLO_BRASIL, cantidad: 1 },
                { productoId: EXPRESO_GRANDE_ETIOPIA, cantidad: 2 },
            ]);

            expect(reportes.cantidadVendidaPorProducto()).toEqual({ Expreso: 3 });
        });

        it('debería sumar el mismo producto repetido dentro de un pedido', () => {
            pedidos.crear([
                { productoId: MUFFIN, cantidad: 1 },
                { productoId: MUFFIN, cantidad: 4 },
            ]);

            expect(reportes.cantidadVendidaPorProducto()).toEqual({ Pastelería: 5 });
        });

        it('debería agrupar muffin y torta bajo el mismo tipo (Pastelería)', () => {
            pedidos.crear([
                { productoId: MUFFIN, cantidad: 2 },
                { productoId: TORTA, cantidad: 3 },
            ]);

            expect(reportes.cantidadVendidaPorProducto()).toEqual({ Pastelería: 5 });
        });
    });

    describe('productoMasVendido()', () => {
        it('debería devolver undefined si no hay ventas', () => {
            expect(reportes.productoMasVendido()).toBeUndefined();
        });

        it('debería devolver el único tipo vendido', () => {
            pedidos.crear([{ productoId: FILTRADO_POCILLO_BRASIL, cantidad: 2 }]);

            expect(reportes.productoMasVendido()).toEqual({ producto: 'Filtrado', cantidad: 2 });
        });

        it('debería devolver el tipo con más unidades vendidas', () => {
            pedidos.crear([
                { productoId: EXPRESO_POCILLO_BRASIL, cantidad: 2 },
                { productoId: FILTRADO_POCILLO_BRASIL, cantidad: 4 },
                { productoId: MUFFIN, cantidad: 7 },
            ]);

            expect(reportes.productoMasVendido()).toEqual({ producto: 'Pastelería', cantidad: 7 });
        });

        it('debería comparar el acumulado de todos los pedidos, no un pedido suelto', () => {
            pedidos.crear([{ productoId: EXPRESO_POCILLO_BRASIL, cantidad: 2 }]);
            pedidos.crear([{ productoId: EXPRESO_POCILLO_BRASIL, cantidad: 2 }]);
            pedidos.crear([{ productoId: MUFFIN, cantidad: 3 }]);

            expect(reportes.productoMasVendido()).toEqual({ producto: 'Expreso', cantidad: 4 });
        });

        it('debería quedarse con el primero que se vendió si hay empate', () => {
            pedidos.crear([{ productoId: EXPRESO_POCILLO_BRASIL, cantidad: 2 }]);
            pedidos.crear([{ productoId: MUFFIN, cantidad: 2 }]);

            expect(reportes.productoMasVendido()?.producto).toBe('Expreso');
        });
    });
});