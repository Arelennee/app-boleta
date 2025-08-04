import pool from "../config/db.js";
import { generarCodigoBoleta } from "../helpers/generarCodigoBoleta.js";

export const crearBoleta = async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const {
      nombre_cliente,
      dni_cliente,
      ruc_cliente,
      nombre_trabajador,
      dni_trabajador,
      total_boleta,
      estado,
      tipo,
      productos,
      descripcion, // array de { id_producto, cantidad }
    } = req.body;

    const codigo_boleta = await generarCodigoBoleta();
    const ruc_empresa = "20602547109";

    await connection.beginTransaction();

    if (tipo === "venta") {
      if (!productos || productos.length === 0) {
        return res
          .status(400)
          .json({ message: "No se proporcionaron productos." });
      }

      // Validar stock y calcular total
      let totalCalculado = 0;
      for (const item of productos) {
        const [producto] = await connection.query(
          "SELECT precio, stock FROM productos WHERE id = ?",
          [item.id_producto]
        );
        if (producto.length === 0) {
          await connection.rollback();
          return res.status(404).json({
            message: `Producto ID ${item.id_producto} no encontrado al calcular subtotal`,
          });
        }

        // Validar stock disponible
        if (producto[0].stock < item.cantidad) {
          await connection.rollback();
          return res.status(400).json({
            message: `Stock insuficiente para producto ID ${item.id_producto}. Stock disponible: ${producto[0].stock}, solicitado: ${item.cantidad}`,
          });
        }

        const precioUnitario = parseFloat(producto[0].precio);
        const subtotal = parseFloat(
          (precioUnitario * item.cantidad).toFixed(2)
        );
        totalCalculado += subtotal;
      }

      if (parseFloat(total_boleta) !== parseFloat(totalCalculado.toFixed(2))) {
        await connection.rollback();
        return res.status(400).json({
          message: `El total enviado (${total_boleta}) no coincide con el total calculado (${totalCalculado.toFixed(
            2
          )})`,
        });
      }

      const [boletaResult] = await connection.query(
        `INSERT INTO boletas 
          (codigo_boleta, ruc_empresa, nombre_cliente, dni_cliente, ruc_cliente, 
           nombre_trabajador, dni_trabajador, total_boleta, estado)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          codigo_boleta,
          ruc_empresa,
          nombre_cliente,
          dni_cliente,
          ruc_cliente,
          nombre_trabajador,
          dni_trabajador,
          total_boleta,
          estado,
        ]
      );

      const id_boleta = boletaResult.insertId;

      // Insertar en detalle_boleta y actualizar stock
      for (const item of productos) {
        const [producto] = await connection.query(
          "SELECT precio, stock FROM productos WHERE id = ?",
          [item.id_producto]
        );
        const precioUnitario = parseFloat(producto[0].precio);
        const subtotal = parseFloat(
          (precioUnitario * item.cantidad).toFixed(2)
        );

        await connection.query(
          "INSERT INTO detalle_boleta (codigo_boleta, id_producto, cantidad, subtotal) VALUES (?, ?, ?, ?)",
          [codigo_boleta, item.id_producto, item.cantidad, subtotal]
        );

        await connection.query(
          "UPDATE productos SET stock = stock - ? WHERE id = ?",
          [item.cantidad, item.id_producto]
        );
      }
    } else if (tipo === "proforma") {
      if (!descripcion || !total_boleta) {
        await connection.rollback();
        return res
          .status(400)
          .json({ message: "Descripcion o Total de boleta faltante" });
      }
      await connection.query(
        `INSERT INTO boletas 
          (codigo_boleta, ruc_empresa, nombre_cliente, dni_cliente, ruc_cliente, 
           nombre_trabajador, dni_trabajador, total_boleta, estado, tipo, descripcion)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          codigo_boleta,
          ruc_empresa,
          nombre_cliente,
          dni_cliente,
          ruc_cliente,
          nombre_trabajador,
          dni_trabajador,
          total_boleta,
          estado,
          tipo,
          descripcion,
        ]
      );
    } else {
      await connection.rollback();
      return res.status(400).json({ message: "tipo invalido de boleta" });
    }

    await connection.commit();

    res.status(201).json({ message: "Boleta creada con éxito", codigo_boleta });
  } catch (error) {
    await connection.rollback();
    console.error("Error al crear boleta:", error);
    res.status(500).json({ message: "Error al crear boleta" });
  } finally {
    connection.release();
  }
};

export const obtenerBoletas = async (req, res) => {
  try {
    const query = "SELECT * FROM boletas";
    const [result] = await pool.query(query);
    res.status(200).json(result);
  } catch (err) {
    console.log("Error al obtener las boletas", err);
    res.status(500).json({ message: "Error al obtener las boletas" });
  }
};

export const obtenerBoletasporId = async (req, res) => {
  try {
    const { id } = req.params;
    const query = "SELECT * FROM boletas WHERE id_boleta = ?";
    const [result] = await pool.query(query, [id]);

    if (result.length === 0) {
      return res.status(404).json({ message: "boleta no encontrada" });
    }
    res.status(200).json(result[0]);
  } catch (err) {
    console.log("Error al obtener la boleta", err);
    res.status(500).json({ message: "error al obtener la boleta" });
  }
};

export const actualizarBoleta = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      codigo_boleta,
      nombre_cliente,
      dni_cliente,
      ruc_cliente,
      nombre_trabajador,
      dni_trabajador,
      total_boleta,
      estado,
    } = req.body;

    const query = `
      UPDATE boletas SET
        codigo_boleta = ?,
        nombre_cliente = ?,
        dni_cliente = ?,
        ruc_cliente = ?,
        nombre_trabajador = ?,
        dni_trabajador = ?,
        total_boleta = ?,
        estado = ?
      WHERE id_boleta = ?
    `;

    const values = [
      codigo_boleta,
      nombre_cliente,
      dni_cliente,
      ruc_cliente || null,
      nombre_trabajador,
      dni_trabajador,
      total_boleta,
      estado,
      id,
    ];

    const [result] = await pool.query(query, values);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Boleta no encontrada" });
    }

    res.json({ message: "Boleta actualizada exitosamente" });
  } catch (err) {
    console.error("Error al actualizar boleta:", err);
    res.status(500).json({ message: "Error al actualizar boleta" });
  }
};
