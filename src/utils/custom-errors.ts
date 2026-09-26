/**
 * Custom error classes for directory scanning operations.
 */


export class DirectoryNotFoundError extends Error {
  constructor(path: string) {
    super(`[DirectoryNotFoundError] La ruta especificada no existe: "${path}"`);
    this.name = "DirectoryNotFoundError";
  }
}

export class AccessDeniedError extends Error {
  constructor(path: string) {
    super(`[AccessDeniedError] Permiso denegado para acceder a: "${path}"`);
    this.name = "AccessDeniedError";
  }
}