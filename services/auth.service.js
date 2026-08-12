import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { JWT_SECRET, JWT_EXPIRA } from '../config/jwt.js'
import { Profesor } from '../models/profesor.model.js'
import { Alumno } from '../models/alumno.model.js'

// ---------------------------------------------------------------------------
// SERVICE — autenticación. Habla con la base de datos y con bcrypt/jwt.
// El controller no toca la base directamente: llama a estas funciones.
// ---------------------------------------------------------------------------

// Firma un token con el id y el rol. Úsalo al registrar y al hacer login.
export const firmarToken = (id, rol) =>
  jwt.sign({ id, rol }, JWT_SECRET, { expiresIn: JWT_EXPIRA })

// TODO: registra un profesor.
//   - hashea la password con bcrypt (bcrypt.hash(password, 10))
//   - créalo en la base
//   - devuelve { token, profesor } (sin la password)
export const registrarProfesor = async (datos) => {
  const { nombre, email, password } = datos
  // hashea la password
  const hashedPassword = await bcrypt.hash(password, 10)
  // crea el profesor en la base de datos
  const profesor = new Profesor({ nombre, email, password: hashedPassword })
  await profesor.save()
  // firma un token con el id y el rol
  const token = firmarToken(profesor._id, 'profesor')
  return { token, profesor }
}

// TODO: registra un alumno (igual que el profesor).
export const registrarAlumno = async (datos) => {
  const { nombre, email, password } = datos
  // hashea la password
  const hashedPassword = await bcrypt.hash(password, 10)
  // crea el alumno en la base de datos
  const alumno = new Alumno({ nombre, email, password: hashedPassword })
  await alumno.save()
  // firma un token con el id y el rol
  const token = firmarToken(alumno._id, 'alumno')
  return { token, alumno }
}


// TODO: login.
//   - busca al usuario por email (en Profesor y en Alumno)
//   - compara la password con bcrypt.compare(...)
//   - si coincide, devuelve { token, rol } con el rol correcto
//   - si no, devuelve null (para que el controller responda 401)
export const login = async (email, password) => {
  // busca al profesor por email
  const profesor = await Profesor.findOne({ email })
  if (profesor) {
    const isMatch = await bcrypt.compare(password, profesor.password)
    if (isMatch) {
      const token = firmarToken(profesor._id, 'profesor')
      return { token, rol: 'profesor' }
    }
  }

  // busca al alumno por email
  const alumno = await Alumno.findOne({ email })
  if (alumno) {
    const isMatch = await bcrypt.compare(password, alumno.password)
    if (isMatch) {
      const token = firmarToken(alumno._id, 'alumno')
      return { token, rol: 'alumno' }
    }
  }

  return null
}
