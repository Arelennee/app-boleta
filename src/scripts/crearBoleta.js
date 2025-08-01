const productosList = document.getElementById("productosList");
const agregarProductoBtn = document.getElementById("agregarProducto");
const totalBoleta = document.getElementById("totalBoleta");
const boletaForm = document.getElementById("boletaForm");

let productosDisponibles = [];

fetch("http://localhost:3000/api/productos")
  .then((res) => {
    console.log("Response status:", res.status);
    return res.json();
  })
  .then((data) => {
    console.log("Products loaded:", data.length, "products");
    console.log("First product:", data[0]); // Debug: show structure
    productosDisponibles = data;
    addProducto();
  })
  .catch((err) => {
    console.error("Error fetching products:", err);
    alert("Error cargando productos. Revisa la consola para más detalles.");
  });

function addProducto() {
  if (productosDisponibles.length === 0) {
    alert("No hay productos disponibles. Asegúrate de que el servidor esté funcionando y la base de datos tenga productos.");
    return;
  }

  const div = document.createElement("div");
  div.className = "producto-item";

  const select = document.createElement("select");
  select.name = "producto_id";
  productosDisponibles.forEach((prod) => {
    const option = document.createElement("option");
    option.value = prod.id; // Use correct field name from API
    const precio = parseFloat(prod.precio); // Fix: convert string price to number
    option.textContent = `${prod.nombre} - S./${precio.toFixed(
      2
    )} (stock: ${prod.stock})`;
    option.dataset.precio = precio; // Fix: store as number
    option.dataset.stock = prod.stock;
    select.appendChild(option); // Fix: append option to select, not div
  });
  
  div.appendChild(select); // Move this outside the loop

  const inputCantidad = document.createElement("input");
  inputCantidad.type = "number";
  inputCantidad.name = "cantidad";
  inputCantidad.min = "1";
  inputCantidad.placeholder = "Cantidad";

  const spanSubtotal = document.createElement("span");
  spanSubtotal.textContent = "Subtotal: s/.0.00";
  
  const removeBtn = document.createElement("button");
  removeBtn.type = "button";
  removeBtn.textContent = "Borrar";
  removeBtn.style.marginLeft = "10px";
  removeBtn.className = "p-1 rounded-md bg-[#EF9A9A] cursor-pointer hover:bg-[#E57373] animated duration-150"
  removeBtn.addEventListener("click", () => {
    div.remove();
    actualizarTotal();
  });

  inputCantidad.addEventListener("input", () => {
    const precio = parseFloat(select.selectedOptions[0].dataset.precio);
    const cantidad = parseInt(inputCantidad.value) || 0;
    const stock = parseInt(select.selectedOptions[0].dataset.stock);
    
    // Validate quantity against stock
    if (cantidad > stock) {
      inputCantidad.value = stock;
      alert(`Stock insuficiente. Máximo disponible: ${stock}`);
      return;
    }
    
    const subtotal = precio * cantidad;
    spanSubtotal.textContent = `Subtotal: S/.${subtotal.toFixed(2)}`;
    actualizarTotal();
  });

  select.addEventListener("change", () => {
    inputCantidad.dispatchEvent(new Event("input"));
  });

  div.appendChild(inputCantidad);
  div.appendChild(spanSubtotal);
  div.appendChild(removeBtn);
  productosList.appendChild(div);
}

function actualizarTotal() {
  const items = productosList.querySelectorAll(".producto-item");
  let total = 0;

  items.forEach((item) => {
    const select = item.querySelector("select");
    const inputCantidad = item.querySelector("input");
    if (select.selectedOptions[0] && inputCantidad.value) {
      const precio = parseFloat(select.selectedOptions[0].dataset.precio);
      const cantidad = parseInt(inputCantidad.value) || 0;
      total += precio * cantidad;
    }
  });
  totalBoleta.textContent = total.toFixed(2);
}

agregarProductoBtn.addEventListener("click", addProducto);

boletaForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const nombreCliente = document.getElementById("nombreCliente").value;
  const dni = document.getElementById("dniCliente").value;
  const rucCliente = document.getElementById("rucCliente").value;
  const trabajador = document.getElementById("nombreTrabajador").value;
  const dniTrabajador = document.getElementById("dniTrabajador").value;

  const productos = [];

  const items = productosList.querySelectorAll(".producto-item");

  items.forEach((item) => {
    const select = item.querySelector("select");
    const inputCantidad = item.querySelector("input");
    const productoId = parseInt(select.value);
    const cantidad = parseInt(inputCantidad.value);

    if (cantidad > 0) {
      productos.push({ id_producto: productoId, cantidad });
    }
  });

  // Calculate total from current form values
  let total = 0;
  items.forEach((item) => {
    const select = item.querySelector("select");
    const inputCantidad = item.querySelector("input");
    if (select.selectedOptions[0] && inputCantidad.value) {
      const precio = parseFloat(select.selectedOptions[0].dataset.precio);
      const cantidad = parseInt(inputCantidad.value) || 0;
      total += precio * cantidad;
    }
  });

  const datosBoleta = {
    nombre_cliente: nombreCliente,
    dni_cliente: dni,
    ruc_cliente: rucCliente,
    nombre_trabajador: trabajador,
    dni_trabajador: dniTrabajador,
    total_boleta: total,
    estado: "activa",
    productos: productos,
  };

  // Debug: log what we're sending
  console.log("Sending boleta data:", datosBoleta);
  console.log("Products array:", productos);

  // Validate form before submitting
  if (productos.length === 0) {
    alert("Debe agregar al menos un producto");
    return;
  }
  
  if (total <= 0) {
    alert("El total debe ser mayor a 0");
    return;
  }

  fetch("http://localhost:3000/api/boletas", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(datosBoleta),
  })
    .then((res) => {
      if (!res.ok) {
        return res.json().then(err => Promise.reject(err));
      }
      return res.json();
    })
    .then((data) => {
      alert(`Boleta generada con éxito. Código: ${data.codigo_boleta}`);
      location.reload();
    })
    .catch((err) => {
      console.error("Error al guardar la boleta:", err);
      alert(`Error: ${err.message || 'Error desconocido al crear la boleta'}`);
    });
    //funcion de recara de pagina

    setInterval(function(){
      location.reload()
      boletaForm.reset()
    }, 700)
});
