import jwt from 'jsonwebtoken'
import { JWT_SECRET } from '../config/jwt.js'

// ---------------------------------------------------------------------------
// MIDDLEWARE — el guardia de las rutas protegidas.
// Corre ANTES del controller. Si el token es válido, deja pasar; si no, corta.
// ---------------------------------------------------------------------------

// TODO: verifica el token JWT.
//   1. Lee el header "Authorization: Bearer <token>".
//   2. Si falta o no empieza con "Bearer ", responde 401.
//   3. Extrae el token (lo que va después de "Bearer ").
//   4. jwt.verify(token, JWT_SECRET) → guarda el payload en req.usuario.
//      (el payload debería traer el id y el ROL — tú decides qué metes al firmarlo)
//   5. Si verify lanza (token alterado/expirado), responde 401.
//   6. Si todo bien, next().


//valida que el usuario tenga un token válido, si no lo tiene devuelve un error 401
export const proteger = (req, res, next) => {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token no proporcionado o inválido' })
  }
  const token = authHeader.slice(7) // Elimina "Bearer "
  jwt.verify(token, JWT_SECRET, (err, payload) => {
    if (err) {
      return res.status(401).json({ error: 'Token inválido o expirado' })
    }
    req.usuario = payload
    next()
  })  
}

// ---------------------------------------------------------------------------
// MIDDLEWARE — autorización por rol. Se usa DESPUÉS de proteger.
// Ej: router.post('/', proteger, soloRol('profesor'), controller.crear)
// ---------------------------------------------------------------------------

// TODO: devuelve un middleware que deje pasar solo si req.usuario.rol === rol.
//   Si no coincide, responde 403.

//valida al usuario según el rol que se le pase como parámetro, si no coincide devuelve un error 403
export const soloRol = (rol) => (req, res, next) => {
  if (!req.usuario || req.usuario.rol !== rol) {
    return res.status(403).json({ error: 'No autorizado para este rol' })
  }
  next();//deja pasar al usuario si el rol coincide
}
