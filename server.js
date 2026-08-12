// ---------------------------------------------------------------------------
// SERVER — arranque de la app. Esto ya está listo: tú construyes lo de adentro.
// ---------------------------------------------------------------------------
import express from 'express'
import cors from 'cors'
import { conectar } from './config/db.js'

// A medida que crees tus routers, descoméntalos:
import { authRoutes } from './routes/auth.routes.js'
import { cursoRoutes } from './routes/curso.routes.js'

const app = express()
app.use(cors())
app.use(express.json())

// Un saludo para saber que el servidor vive.
app.get('/', (req, res) => res.json({ ok: true, api: 'Plataforma de Cursos' }))

// Monta aquí tus rutas (descoméntalas cuando las tengas):
app.use('/api/auth', authRoutes)
app.use('/api/cursos', cursoRoutes)

const PORT = 3000
const start = async () => {
  try {
await conectar();

app.listen(PORT, () => {
  console.log(`✅ API escuchando en http://localhost:${PORT}`)
});

  } catch (error) {
    console.error('❌ Error al conectar a la base de datos:', error)
  }
}
start() 
