import { test, expect, request } from '@playwright/test';
import { resetAndSeed } from './helpers.js';

test.describe('E2E Cafetería Origen', () => {
    
    test.beforeEach(async ({ baseURL }) => {
        await resetAndSeed(baseURL!);
    });

    test('GET /productos devuelve los 20 productos con precio calculado', async ({ baseURL }) => {
        const ctx = await request.newContext({ baseURL });
        const res = await ctx.get('/productos');
        
        expect(res.status()).toBe(200);
        const productos = await res.json();
        expect(productos.length).toBe(20);
        expect(productos[0]).toHaveProperty('precio');

        await ctx.dispose();
    });

    test('POST /pedidos crea un pedido exitosamente y actualiza la facturación', async ({ baseURL }) => {
        const ctx = await request.newContext({ baseURL });
        
        const resPedido = await ctx.post('/pedidos', {
        data: {
            items: [{ productoId: 1, cantidad: 2 }]
        }
        });

        expect(resPedido.status()).toBe(201);
        const pedidoCreado = await resPedido.json();
        expect(pedidoCreado.total).toBe(10040); // 5020 * 2

        const resFacturacion = await ctx.get('/reportes/facturacion');
        expect(resFacturacion.status()).toBe(200);
        const reporte = await resFacturacion.json();
        expect(reporte.facturacionTotal).toBe(10040);

        await ctx.dispose();
    });
});