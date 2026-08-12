import mongoose from 'mongoose'

// ---------------------------------------------------------------------------
// MODELO — Profesor.
// ---------------------------------------------------------------------------
// TODO: define el schema del profesor. Campos (ver enunciado):
//   - nombre    (texto, obligatorio)
//   - email     (texto, único, obligatorio)
//   - password  (texto, obligatorio) → se guarda HASHEADO, nunca en texto plano
//
// Pista: usa { timestamps: true } para tener createdAt/updatedAt gratis.

const profesorSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }   
    
  },
  { timestamps: true },
);
// oculta el password cuando se haga JSON.stringify() o res.json() de un profesor
profesorSchema.methods.toJSON = function () {
  const profesor = this.toObject()
  delete profesor.password
  return profesor
}

export const Profesor = mongoose.model('Profesor', profesorSchema, 'profesores')
