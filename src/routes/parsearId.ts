import { ValidationError } from "../errors/index.js";

export function parsearId(valor: string | undefined): number {
  const id = Number(valor);
  if (!Number.isInteger(id) || id < 1) {
    throw new ValidationError("El id debe ser un entero positivo");
  }
  return id;
}






