import jwt from "jsonwebtoken";

// Usa JWT_SECRET si existe; si no, mantiene compatibilidad con tu secreto actual.
const secret = process.env.JWT_SECRET || "mysecretstotoken";

export default function withAuth(req, res, next) {
  const token =
    req.body?.token ||
    req.query?.token ||
    req.headers?.['x-access-token'] ||
    req.cookies?.token;

  if (!token) {
    return res.status(401).send('Unauthorized: No token');
  }

  jwt.verify(token, secret, (err, decoded) => {
    if (err) {
      return res.status(401).send('Unauthorized: Invalid token');
    }
    req.cedula = decoded?.cedula;
    return next();
  });
}
