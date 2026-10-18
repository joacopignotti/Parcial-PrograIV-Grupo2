import { describe, it, expect } from 'vitest';
import { BRASIL, COLOMBIA, ETIOPIA, VARIEDADES } from '../../src/models/Variedad.js';

describe('Constantes de Variedad', () => {
    it('debería definir la variedad BRASIL con los valores correctos', () => {
        expect(BRASIL).toEqual({
            nombre: 'Brasil',
            precioPorGramo: 140,
            descripcion: 'Acidez baja, cuerpo denso y notas de avellana',
        });
    });

    it('debería definir la variedad COLOMBIA con los valores correctos', () => {
        expect(COLOMBIA).toEqual({
            nombre: 'Colombia',
            precioPorGramo: 180,
            descripcion: 'Acidez media, cuerpo equilibrado y notas cítricas y florales',
        });
    });

    it('debería definir la variedad ETIOPIA con los valores correctos', () => {
        expect(ETIOPIA).toEqual({
            nombre: 'Etiopía',
            precioPorGramo: 240,
            descripcion: 'Acidez muy viva, cuerpo ligero y notas frutales',
        });
    });

    it('debería agrupar todas las variedades en el arreglo inmutable VARIEDADES', () => {
        // Verificamos el tamaño del arreglo
        expect(VARIEDADES).toHaveLength(3);
        
        // Verificamos que contenga las referencias exactas a las constantes
        expect(VARIEDADES).toContain(BRASIL);
        expect(VARIEDADES).toContain(COLOMBIA);
        expect(VARIEDADES).toContain(ETIOPIA);
        
        // Verificamos el orden exacto en el que fueron exportadas
        expect(VARIEDADES).toEqual([BRASIL, COLOMBIA, ETIOPIA]);
    });
});