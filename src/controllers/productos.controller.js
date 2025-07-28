import pool from "../config/db.js";

export const getProductos = async (req, res) => {
  try {
    const [result] = await pool.query("SELECT * FROM productos");
    res.json(result);
  } catch (err) {
    console.error("Ocurrio un error al procesar peticion", err);
    res.status(500).json({ message: "Error interno en el server" });
  }
};

export const crearProductos = async (req, res) => {
  const { nombre, descripcion = null, precio, stock } = req.body;

  if (!nombre || precio == null || stock == null) {
    return res.status(400).json({ message: "Todos los campos son requeridos: nombre, precio y stock" });
  }

  try {
    const [result] = await pool.query(
      "INSERT INTO productos (nombre, descripcion, precio, stock) VALUES (?, ?, ?, ?)",
      [nombre, descripcion, precio, stock]
    );
    res
      .status(201)
      .json({ message: "Producto creado correctamente", id: result.insertId });
  } catch (err) {
    console.log("Error al procesar la solicitud", err);
    res.status(500).json({ message: "Error al crear el producto" });
  }
};

export const editarProductos = async (req, res) => {
  const { id } = req.params;
  const { nombre, descripcion = null, precio, stock } = req.body;

  if (!nombre || precio == null || stock == null) {
    return res.status(400).json({ message: "complete los campos necesarios" });
  }
  try {
    const [result] = await pool.query(
      "UPDATE productos SET nombre = ?, descripcion = ?, precio = ?, stock = ? WHERE id = ?",
      [nombre, descripcion, precio, stock, id]
    );
    res.json({ message: "Producto actualizado corectamente" });
  } catch (err) {
    console.error(`error al actualizar producto ${err}`);
    res.status(500).json({ message: "error al actualizar el producto" });
  }
};
