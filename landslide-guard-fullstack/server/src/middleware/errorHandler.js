export function notFound(req, res) {
  res.status(404).json({ error: `Route not found: ${req.method} ${req.originalUrl}` });
}

// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, next) {
  console.error(err);
  // Multer's own errors (bad field name, disallowed mimetype, etc.) —
  // surface these as 400s with their real message instead of a bare 500.
  // Note: there is no LIMIT_FILE_SIZE case here on purpose, since the
  // upload middleware sets no fileSize limit.
  if (err.name === "MulterError" || /Only image or video files/.test(err.message || "")) {
    return res.status(400).json({ error: err.message });
  }
  const status = err.status || 500;
  res.status(status).json({
    error: err.publicMessage || "Internal server error.",
    ...(process.env.NODE_ENV !== "production" ? { detail: err.message } : {}),
  });
}
