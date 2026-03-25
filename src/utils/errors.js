// src/utils/errors.js

class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

class NotFoundError extends AppError {
  constructor(resource = 'Ressource') {
    super(`${resource} introuvable`, 404);
  }
}

class ValidationError extends AppError {
  constructor(message = 'Données invalides') {
    super(message, 400);
  }
}

class UnauthorizedError extends AppError {
  constructor(message = 'Non authentifié') {
    super(message, 401);
  }
}

class ForbiddenError extends AppError {
  constructor(message = 'Accès refusé') {
    super(message, 403);
  }
}

class ConflictError extends AppError {
  constructor(message = 'Conflit de données') {
    super(message, 409);
  }
}

module.exports = {
  AppError,
  NotFoundError,
  ValidationError,
  UnauthorizedError,
  ForbiddenError,
  ConflictError,
};
