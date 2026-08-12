import { Curso } from '../models/curso.model.js'

// ---------------------------------------------------------------------------
// SERVICE — cursos. Habla con la base de datos.
// Las REGLAS DE NEGOCIO (validar estado, propiedad, etc.) pueden ir aquí o en
// el controller: tú decides, pero que estén en el servidor, no en el cliente.
// ---------------------------------------------------------------------------

// TODO: implementa las funciones que tus controllers necesiten. Por ejemplo:
//   - listarCursos()            → Curso.find().populate('profesor').populate('alumnos')

export const listarCursos = async () => {
  return await Curso.find().populate('profesor').populate('alumnos')
};

//   - crearCurso(datos)
export const crearCurso = async (datos) => {
  const curso = new Curso(datos)
  await curso.save()
  return await Curso.findById(curso._id).populate('profesor').populate('alumnos')
}

//   - buscarCurso(id)
export const buscarCurso = async (id) => {
  return await Curso.findById(id).populate('profesor').populate('alumnos')
}

//   - editarCurso(id, datos)
export const editarCurso = async (id, datos) => {
  return await Curso.findByIdAndUpdate(id, datos, { new: true }).populate('profesor').populate('alumnos')
}

//   - borrarCurso(id)
export const borrarCurso = async (id) => {
  return await Curso.findByIdAndDelete(id)
}

//   - cursosDelProfesor(profesorId)
export const cursosDelProfesor = async (profesorId) => {
  return await Curso.find({ profesor: profesorId }).populate('profesor').populate('alumnos')
}

//   - cursosDelAlumno(alumnoId)
export const cursosDelAlumno = async (alumnoId) => {
  return await Curso.find({ alumnos: alumnoId }).populate('profesor').populate('alumnos')
}
//asignarProfesor(cursoId, profesorId)
export const asignarProfesor = async (cursoId, profesorId) => {
  return await Curso.findByIdAndUpdate(cursoId, { profesor: profesorId }, { new: true }).populate('profesor').populate('alumnos')
}
// obtener alumnos del curso
export const obtenerAlumnosDelCurso = async (cursoId) => {
  const curso = await Curso.findById(cursoId).populate('alumnos')
  return curso ? curso.alumnos : []
}

//   - agregarAlumno(cursoId, alumnoId)
export const agregarAlumno = async (cursoId, alumnoId) => {
  return await Curso.findByIdAndUpdate(cursoId, { $addToSet: { alumnos: alumnoId } }, { new: true }).populate('profesor').populate('alumnos')
}   

//matricularAlumno(cursoId, alumnoId) → lo mismo que agregarAlumno, pero con validación de estado
export const matricularAlumno = async (cursoId, alumnoId) => {
  const curso = await Curso.findById(cursoId)
  if (!curso) {
    throw new Error('Curso no encontrado')
  }
  if (curso.alumnos.includes(alumnoId)) {
    throw new Error('El alumno ya está matriculado en este curso')
  }
  return await Curso.findByIdAndUpdate(cursoId, { $addToSet: { alumnos: alumnoId } }, { new: true }).populate('profesor').populate('alumnos')
}
//listar cursos
export const listarCursosConAlumnos = async () => {
  return await Curso.find().populate('profesor').populate('alumnos')
}   