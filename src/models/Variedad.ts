export interface Variedad {
  readonly nombre: string;
  readonly precioPorGramo: number;
  readonly descripcion: string;
}

export const BRASIL: Variedad = {
  nombre: "Brasil",
  precioPorGramo: 140,
  descripcion: "Acidez baja, cuerpo denso y notas de avellana",
};

export const COLOMBIA: Variedad = {
  nombre: "Colombia",
  precioPorGramo: 180,
  descripcion: "Acidez media, cuerpo equilibrado y notas cítricas y florales",
};

export const ETIOPIA: Variedad = {
  nombre: "Etiopía",
  precioPorGramo: 240,
  descripcion: "Acidez muy viva, cuerpo ligero y notas frutales",
};

export const VARIEDADES: readonly Variedad[] = [BRASIL, COLOMBIA, ETIOPIA];
