import pool from "../config/db.js";

export const generarCodigoBoleta = async () => {
  const [result] = await pool.query(
    "SELECT codigo_boleta FROM boletas ORDER BY id_boleta DESC LIMIT 1"
  );

  let nuevoCodigo = "BOL01";

  if (result.length > 0) {
    const ultimoCodigo = result[0].codigo_boleta;
    const numero = parseInt(ultimoCodigo.replace("BOL", "")) + 1;
    nuevoCodigo = `BOL${numero.toString().padStart(3, "0")}`;
  }

  return nuevoCodigo;
};
