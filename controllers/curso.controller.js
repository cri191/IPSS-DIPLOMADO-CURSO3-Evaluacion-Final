import * as service from '../services/curso.service.js'

// ---------------------------------------------------------------------------
// CONTROLLERS — cursos. Aquí viven las reglas de negocio.
// El id y el rol del usuario que hace la petición vienen en req.usuario
// (lo puso el middleware `proteger` desde el token).
// ---------------------------------------------------------------------------

// GET /api/cursos — todos los cursos (con populate de profesor y alumnos).
export const listar = async (req, res) => {

  try {
    // TODO: devuelve todos los cursos, con .populate() del profesor y los alumnos.

const cursos = await service.listar()
    res.json(cursos)  

  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// POST /api/cursos — crea un curso (nace EN_MATRICULA, sin profesor).
export const crear = async (req, res) => {
  try {
    // TODO: crea el curso con los datos del body. Status 201.
    const curso = await service.crearCurso(req.body)
    res.status(201).json(curso) 
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

// PUT /api/cursos/:id — edita un curso.
export const editar = async (req, res) => {
  try {
    // TODO: edita el curso. Si no existe → 404.
    const curso = await service.editarCurso(req.params.id, req.body)
    if (!curso) {
      return res.status(404).json({ error: 'Curso no encontrado' })
    } 
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

// DELETE /api/cursos/:id — borra un curso.
export const borrar = async (req, res) => {
  try {
    // TODO: borra el curso. Si no existe → 404.
    const curso = await service.borrarCurso(req.params.id)
    if (!curso) {
      return res.status(404).json({ error: 'Curso no encontrado' })
    } 
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

// GET /api/cursos/mis-cursos — los cursos que dicta ESTE profesor.
export const misCursos = async (req, res) => {
  try {
    // TODO: filtra los cursos por profesor = req.usuario.id.
    const cursos = await service.cursosDelProfesor(req.usuario.id)
    res.json(cursos)    
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// POST /api/cursos/:id/asignarme — el profesor se asigna un curso libre.
export const asignarme = async (req, res) => {
  try {
    // TODO — REGLA DE NEGOCIO:
    //   1. Busca el curso. Si no existe → 404.
    //   2. Si YA tiene profesor → 409 (nadie se lo quita a otro).
    //   3. Si está libre → asígnale req.usuario.id como profesor. Guarda.
    const curso = await service.buscarCurso(req.params.id)
    if (!curso) {
      return res.status(404).json({ error: 'Curso no encontrado' })
    } 
    // 2. Si YA tiene profesor → 409 (nadie se lo quita a otro).
    if (curso.profesor) {
      return res.status(409).json({ error: 'Curso ya tiene profesor asignado' })
    } 
    // 3. Si está libre → asígnale req.usuario.id como profesor. Guarda.
    const cursoActualizado = await service.asignarProfesor(req.params.id, req.usuario.id)
    res.json(cursoActualizado)  
    
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

// GET /api/cursos/:id/alumnos — solo el profesor que dicta el curso.
export const alumnosDelCurso = async (req, res) => {
  try {
    // TODO — REGLA DE PROPIEDAD:
    const curso = await service.buscarCurso(req.params.id)
    if (!curso) {
      return res.status(404).json({ error: 'Curso no encontrado' })
    } 
    //   1. Busca el curso. Si no existe → 404.
    //   2. Si el profesor del curso NO es req.usuario.id → 403.
    if (curso.profesor.toString() !== req.usuario.id) {
      return res.status(403).json({ error: 'No autorizado para ver los alumnos de este curso' })
    }
    //   3. Devuelve la lista de alumnos (con populate).
    const alumnos = await service.obtenerAlumnosDelCurso(req.params.id)
    res.json(alumnos) 
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// GET /api/cursos/mis-matriculas — los cursos donde está matriculado ESTE alumno.
export const misMatriculas = async (req, res) => {
  try {
    // TODO: filtra los cursos que tengan a req.usuario.id en su array de alumnos.
    const cursos = await service.cursosDelAlumno(req.usuario.id)
    res.json(cursos)    
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// POST /api/cursos/:id/matricularme — el alumno se matricula a sí mismo.
export const matricularme = async (req, res) => {
  try {
    // TODO — REGLA DE NEGOCIO:
    //   1. Busca el curso. Si no existe → 404.
    const curso = await service.buscarCurso(req.params.id)
    if (!curso) {
      return res.status(404).json({ error: 'Curso no encontrado' })
    } 
    //   2. Si NO está EN_MATRICULA → 409 (curso cerrado).
    if (curso.estado !== 'EN_MATRICULA') {
      return res.status(409).json({ error: 'Curso cerrado para matrícula' })
    } 
    //   3. Si el alumno YA está en el curso → 409 (no duplicar).
    if (curso.alumnos.includes(req.usuario.id)) {
      return res.status(409).json({ error: 'Alumno ya está matriculado en este curso' })
    }
    //   4. Agrega req.usuario.id al array de alumnos. Guarda.
    const cursoActualizado = await service.matricularAlumno(req.params.id, req.usuario.id)
    res.json(cursoActualizado)  
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

// DELETE /api/cursos/:id/matricularme — el alumno se sale del curso.
export const desmatricularme = async (req, res) => {
  try {
    // TODO:
    //   1. Busca el curso. Si no existe → 404.
    const curso = await service.buscarCurso(req.params.id)
    if (!curso) {
      return res.status(404).json({ error: 'Curso no encontrado' })
    }
    //   2. Si NO está EN_MATRICULA → 409.
    if (curso.estado !== 'EN_MATRICULA') {
      return res.status(409).json({ error: 'Curso cerrado para desmatriculación' })
    } 
    //   3. Quita a req.usuario.id del array de alumnos. Guarda.
    const cursoActualizado = await service.quitarAlumno (req.params.id, req.usuario.id)
    res.json(cursoActualizado)    
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}
