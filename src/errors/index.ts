// Errores de dominio. Los servicios lanzan estos errores (throw) y la capa HTTP
// los traduce a códigos de estado (400 / 404).
export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}

export class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "NotFoundError";
  }
}

