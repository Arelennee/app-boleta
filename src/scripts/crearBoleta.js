import generarPdf from "./crearPdf.js";

const productosList = document.getElementById("productosList");
const agregarProductoBtn = document.getElementById("agregarProducto");
const totalBoleta = document.getElementById("totalBoleta");
const boletaForm = document.getElementById("boletaForm");
const tipoRadios = document.querySelectorAll('input[name="tipoBoleta"]');
const seccionVenta = document.getElementById("seccionVenta");
const seccionProforma = document.getElementById("seccionProforma");

let productosDisponibles = [];

// Mostrar/ocultar secciones
tipoRadios.forEach((radio) => {
  radio.addEventListener("change", () => {
    if (radio.value === "venta") {
      seccionVenta.style.display = "block";
      seccionProforma.style.display = "none";
    } else {
      seccionVenta.style.display = "none";
      seccionProforma.style.display = "block";
    }
  });
});

// Carga productos
fetch("http://localhost:3000/api/productos")
  .then((res) => res.json())
  .then((data) => {
    productosDisponibles = data;
    addProducto();
  })
  .catch((err) => {
    console.error("Error cargando productos:", err);
    alert("Error al cargar productos");
  });

function addProducto() {
  if (productosDisponibles.length === 0) {
    alert("No hay productos disponibles.");
    return;
  }
  const div = document.createElement("div");
  div.className = "producto-item";

  const select = document.createElement("select");
  productosDisponibles.forEach((prod) => {
    const option = document.createElement("option");
    option.value = prod.id;
    option.textContent = `${prod.nombre} - S/.${parseFloat(prod.precio).toFixed(
      2
    )} (stock: ${prod.stock})`;
    option.dataset.precio = parseFloat(prod.precio);
    option.dataset.stock = prod.stock;
    select.appendChild(option);
  });

  const inputCantidad = document.createElement("input");
  inputCantidad.type = "number";
  inputCantidad.min = "1";
  inputCantidad.placeholder = "Cantidad";

  const spanSubtotal = document.createElement("span");
  spanSubtotal.textContent = "Subtotal: S/.0.00";

  const removeBtn = document.createElement("button");
  removeBtn.type = "button";
  removeBtn.textContent = "Borrar";
  removeBtn.addEventListener("click", () => {
    div.remove();
    actualizarTotal();
  });

  inputCantidad.addEventListener("input", () => {
    const precio = parseFloat(select.selectedOptions[0].dataset.precio);
    const cantidad = parseInt(inputCantidad.value) || 0;
    const stock = parseInt(select.selectedOptions[0].dataset.stock);
    if (cantidad > stock) {
      inputCantidad.value = stock;
      alert(`Stock insuficiente. Máximo disponible: ${stock}`);
      return;
    }
    spanSubtotal.textContent = `Subtotal: S/.${(precio * cantidad).toFixed(2)}`;
    actualizarTotal();
  });

  select.addEventListener("change", () => {
    inputCantidad.dispatchEvent(new Event("input"));
  });

  div.append(select, inputCantidad, spanSubtotal, removeBtn);
  productosList.appendChild(div);
}

function actualizarTotal() {
  const items = productosList.querySelectorAll(".producto-item");
  let total = 0;
  items.forEach((item) => {
    const select = item.querySelector("select");
    const cantidad = parseInt(item.querySelector("input").value) || 0;
    if (cantidad > 0) {
      total += parseFloat(select.selectedOptions[0].dataset.precio) * cantidad;
    }
  });
  totalBoleta.textContent = total.toFixed(2);
}

agregarProductoBtn.addEventListener("click", addProducto);

// Manejo del submit del formulario
boletaForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const tipoSeleccionado = document.querySelector(
    'input[name="tipoBoleta"]:checked'
  ).value;
  const nombreCliente = document.getElementById("nombreCliente").value.trim();
  const dni = document.getElementById("dniCliente").value.trim();
  const rucCliente = document.getElementById("rucCliente").value.trim();
  const trabajador = document.getElementById("nombreTrabajador").value.trim();
  const dniTrabajador = document.getElementById("dniTrabajador").value.trim();

  const datosBoleta = {
    nombre_cliente: nombreCliente,
    dni_cliente: dni,
    ruc_cliente: rucCliente,
    nombre_trabajador: trabajador,
    dni_trabajador: dniTrabajador,
    estado: "pendiente",
    tipo: tipoSeleccionado,
    total_boleta: 0,
  };

  if (tipoSeleccionado === "venta") {
    const productos = [];
    let total = 0;
    productosList.querySelectorAll(".producto-item").forEach((item) => {
      const select = item.querySelector("select");
      const cantidad = parseInt(item.querySelector("input").value) || 0;
      if (cantidad > 0) {
        productos.push({ id_producto: parseInt(select.value), cantidad });
        total +=
          parseFloat(select.selectedOptions[0].dataset.precio) * cantidad;
      }
    });
    if (productos.length === 0) {
      alert("Debe agregar al menos un producto.");
      return;
    }
    if (total <= 0) {
      alert("El total debe ser mayor a 0.");
      return;
    }
    datosBoleta.productos = productos;
    datosBoleta.total_boleta = total;
  } else if (tipoSeleccionado === "proforma") {
    const descripcion = document
      .getElementById("descripcionProforma")
      .value.trim();
    const precio = parseFloat(document.getElementById("precioProforma").value);
    if (!descripcion || isNaN(precio) || precio <= 0) {
      alert("Descripción válida y precio mayor a 0 requeridos para proforma.");
      return;
    }
    datosBoleta.description = descripcion;
    datosBoleta.total_boleta = precio;
  }

  console.log("Enviando boleta:", datosBoleta);

  fetch("http://localhost:3000/api/boletas", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(datosBoleta),
  })
    .then((res) => {
      if (!res.ok) return res.json().then((err) => Promise.reject(err));
      return res.json();
    })
    .then((data) => {
      alert(`Boleta creada. Código: ${data.codigo_boleta}`);
      generarPdf({
        tipo: tipoSeleccionado,
        codigoBoleta: data.codigo_boleta,
        nombreCliente,
        dniCliente: dni,
        rucCliente,
        nombreTrabajador: trabajador,
        dniTrabajador,
        totalBoleta: datosBoleta.total_boleta,
        productos: datosBoleta.productos || [],
        descripcion: datosBoleta.description || "",
        productosDisponibles,
      });
      location.reload();
    })
    .catch((err) => {
      console.error("Error creando boleta:", err);
      alert(err.message || "Error desconocido al crear boleta.");
    });
});
