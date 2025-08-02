import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts.js";
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
      { text: codigoBoleta, style: "header" },
      {
        text: `Cliente: ${nombreCliente}`,
        style: "subheader",
        margin: [0, 10, 0, 10],
      },
      {
        text: `DNI Cliente: ${dniCliente}`,
        style: "subheader",
        margin: [0, 10, 0, 10],
      },
      {
        text: `RUC Cliente: ${rucCliente}`,
        style: "subheader",
        margin: [0, 10, 0, 10],
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
