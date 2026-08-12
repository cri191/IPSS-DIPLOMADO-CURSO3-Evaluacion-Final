import mongoose from 'mongoose'

// ---------------------------------------------------------------------------
// MODELO — Alumno.
// ---------------------------------------------------------------------------
// TODO: define el schema del alumno. Campos (ver enunciado):
//   - nombre    (texto, obligatorio)
//   - email     (texto, único, obligatorio)
//   - telefono  (texto)
//   - password  (texto, obligatorio) → HASHEADO con bcrypt

const alumnoSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    telefono: { type: String },
    password: { type: String, required: true }   
  },
  { timestamps: true },
)

// oculta el password cuando se haga JSON.stringify() o res.json() de un alumno
alumnoSchema.methods.toJSON = function () {
  const alumno = this.toObject()
  delete alumno.password
  return alumno
}

export const Alumno = mongoose.model('Alumno', alumnoSchema, 'alumnos')
