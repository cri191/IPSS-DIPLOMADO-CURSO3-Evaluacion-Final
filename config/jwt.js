// ---------------------------------------------------------------------------
// CONFIG — el secreto para firmar y verificar los JWT.
// ---------------------------------------------------------------------------
// En un proyecto real esto va en una variable de entorno. Para la evaluación,
// puedes dejarlo aquí — pero cámbialo por una cadena tuya, larga y aleatoria.

export const JWT_SECRET = process.env.JWT_SECRET || 'llave_secreta_trabajo_final_2026'


// Cuánto dura la sesión.
export const JWT_EXPIRA = '7d';
