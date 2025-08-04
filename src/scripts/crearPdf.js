import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts.js";
import imagen from "../img/imagen.js";
import rucEmpresa from "../middleware/ruc.js";
pdfMake.vfs = pdfFonts.vfs;

export default function generarPdf({
  codigoBoleta,
  nombreCliente,
  dniCliente,
  rucCliente,
  nombreTrabajador,
  dniTrabajador,
  totalBoleta,
  productos,
  productosDisponibles,
}) {
  const docDefinition = {
    content: [
      {
        columns: [
          {
            image: imagen,
            width: 225,
            height: 123.75,
            margin: [0, 0, 0, 10],
          },
          {
            width: "*",
            stack: [
              { text: `R.U.C ${rucEmpresa}` },
              { text: "Boleta de Pago" },
              { text: codigoBoleta },
            ],
            margin: [0, 0, 10, 0],
            alignment: "right",
          },
        ],
        columnGap: 10,
      },
      {
        stack: [
          {
            columns: [
              { text: `Cliente: ${nombreCliente}` },
              { text: `DNI Cliente: ${dniCliente}` },
            ],
          },
          { text: `R.U.C Cliente: ${rucCliente}` },
        ],
      },
      {
        text: `Trabajador: ${nombreTrabajador}`,
        style: "subheader",
        margin: [0, 10, 0, 10],
      },
      {
        text: `DNI Trabajador: ${dniTrabajador}`,
        style: "subheader",
        margin: [0, 10, 0, 10],
      },
      // Products table
      {
        text: "Productos:",
        style: "subheader",
        margin: [0, 20, 0, 10],
      },
      {
        table: {
          headerRows: 1,
          widths: ["*", "auto", "auto", "auto"],
          body: [
            ["Producto", "Cantidad", "Precio", "Total"],
            ...(productos || []).map((producto) => {
              // Find product details from the ID
              const productDetails =
                productosDisponibles?.find(
                  (p) => p.id === producto.id_producto
                ) || {};
              const precio = parseFloat(productDetails.precio || 0);
              const cantidad = parseInt(producto.cantidad || 0);
              const subtotal = precio * cantidad;

              return [
                productDetails.nombre || "Producto desconocido",
                cantidad.toString(),
                `S/.${precio.toFixed(2)}`,
                `S/.${subtotal.toFixed(2)}`,
              ];
            }),
          ],
        },
        margin: [0, 0, 0, 20],
      },
      {
        text: `Total de la Boleta: S/.${parseFloat(totalBoleta || 0).toFixed(
          2
        )}`,
        style: "total",
        margin: [0, 10, 0, 10],
      },
    ],
    styles: {
      header: { fontSize: 20, bold: true },
      subheader: { fontSize: 14, bold: false },
      total: { fontSize: 16, bold: true, alignment: "right" },
    },
  };
  pdfMake.createPdf(docDefinition).download(`Boleta_${codigoBoleta}.pdf`);
}
