import { ValidationError } from '../models/validators.js';

export function errorHandler(err, _req, res, _next) {
  console.error(err);

  if (err instanceof ValidationError) {
    return res.status(400).json({
      error: err.message,
      details: err.details,
    });
  }

  if (err.status) {
    return res.status(err.status).json({ error: err.message });
  }

  return res.status(500).json({
    error: err.message || 'Internal server error',
  });
}

export function notFoundHandler(_req, res) {
  res.status(404).json({ error: 'Route not found' });
}
