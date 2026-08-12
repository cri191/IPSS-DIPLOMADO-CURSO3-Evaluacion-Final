import mongoose from 'mongoose'

// ---------------------------------------------------------------------------
// CONFIG — conexión a MongoDB.
// ---------------------------------------------------------------------------
// ⚠️ Reemplaza usuario-mongo y clave-secreta por los de TU cluster de Atlas.
//    (Atlas → Connect → Drivers → copia la cadena, pon tu usuario y contraseña.)
//
// ⚠️ Tu repo es PÚBLICO: no subas tu contraseña real. Deja los marcadores, o
//    apunta a una base local. Nadie debe poder entrar a tu base desde tu repo.

const MONGODB_URI =
  'mongodb://cri19142_db_user:BdowcK3aH9zP19zb@ac-av46c6m-shard-00-00.2mteewi.mongodb.net:27017,ac-av46c6m-shard-00-01.2mteewi.mongodb.net:27017,ac-av46c6m-shard-00-02.2mteewi.mongodb.net:27017/cursos?replicaSet=atlas-micdw3-shard-0&ssl=true&authSource=admin'

export const conectar = async () => {
  await mongoose.connect(MONGODB_URI)
  console.log(`🍃 conectado a MongoDB → base "${mongoose.connection.name}"`)
}
