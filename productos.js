import pool from "./src/config/db.js";

// Array de productos fake para testing
const fakeProducts = [
  {
    nombre: "Laptop Gamer MSI",
    descripcion: "Laptop gaming con procesador Intel i7, 16GB RAM, RTX 3060",
    precio: 899999,
    stock: 15
  },
  {
    nombre: "Mouse Logitech G502",
    descripcion: "Mouse gaming con sensor óptico de alta precisión",
    precio: 45990,
    stock: 50
  },
  {
    nombre: "Teclado Mecánico Corsair",
    descripcion: "Teclado mecánico RGB con switches Cherry MX Blue",
    precio: 89990,
    stock: 25
  },
  {
    nombre: "Monitor 4K Samsung",
    descripcion: "Monitor 27 pulgadas 4K UHD con tecnología HDR",
    precio: 299990,
    stock: 8
  },
  {
    nombre: "Auriculares Sony WH-1000XM4",
    descripcion: "Auriculares inalámbricos con cancelación de ruido",
    precio: 199990,
    stock: 20
  },
  {
    nombre: "SSD Samsung 1TB",
    descripcion: "Disco sólido NVMe M.2 de alta velocidad",
    precio: 89990,
    stock: 30
  },
  {
    nombre: "Webcam Logitech C920",
    descripcion: "Cámara web Full HD 1080p para streaming",
    precio: 65990,
    stock: 40
  },
  {
    nombre: "Smartphone iPhone 15",
    descripcion: "iPhone 15 128GB con chip A17 Pro",
    precio: 999990,
    stock: 12
  },
  {
    nombre: "Tablet iPad Air",
    descripcion: "iPad Air 10.9 pulgadas 256GB WiFi",
    precio: 599990,
    stock: 18
  },
  {
    nombre: "Impresora HP LaserJet",
    descripcion: "Impresora láser monocromática con WiFi",
    precio: 149990,
    stock: 10
  },
  {
    nombre: "Router ASUS AX6000",
    descripcion: "Router WiFi 6 de alto rendimiento",
    precio: 249990,
    stock: 15
  },
  {
    nombre: "Micrófono Blue Yeti",
    descripcion: "Micrófono USB profesional para streaming",
    precio: 129990,
    stock: 22
  },
  {
    nombre: "Tarjeta Gráfica RTX 4070",
    descripcion: "Tarjeta gráfica NVIDIA GeForce RTX 4070 12GB",
    precio: 599990,
    stock: 6
  },
  {
    nombre: "Procesador AMD Ryzen 7",
    descripcion: "Procesador AMD Ryzen 7 5800X 8 núcleos",
    precio: 289990,
    stock: 14
  },
  {
    nombre: "Memoria RAM Corsair 32GB",
    descripcion: "Kit memoria DDR4 32GB (2x16GB) 3200MHz",
    precio: 159990,
    stock: 25
  },
  {
    nombre: "Fuente EVGA 750W",
    descripcion: "Fuente de poder modular 80+ Gold 750W",
    precio: 119990,
    stock: 20
  },
  {
    nombre: "Case Corsair RGB",
    descripcion: "Gabinete ATX con iluminación RGB y ventiladores",
    precio: 99990,
    stock: 12
  },
  {
    nombre: "Cooler Noctua NH-D15",
    descripcion: "Cooler de CPU de alto rendimiento ultra silencioso",
    precio: 89990,
    stock: 18
  },
  {
    nombre: "Cable HDMI 4K",
    descripcion: "Cable HDMI 2.1 de 2 metros compatible con 4K 120Hz",
    precio: 19990,
    stock: 100
  },
  {
    nombre: "Hub USB-C",
    descripcion: "Hub USB-C 7 en 1 con HDMI y carga rápida",
    precio: 39990,
    stock: 35
  }
];

const insertarProductos = async () => {
  try {
    console.log("🚀 Iniciando inserción de productos fake...");
    
    // Verificar conexión a la base de datos
    const connection = await pool.getConnection();
    console.log("✅ Conexión a la base de datos establecida");
    connection.release();

    let insertados = 0;
    let errores = 0;

    for (const producto of fakeProducts) {
      try {
        const [result] = await pool.query(
          "INSERT INTO productos (nombre, descripcion, precio, stock) VALUES (?, ?, ?, ?)",
          [producto.nombre, producto.descripcion, producto.precio, producto.stock]
        );
        
        console.log(`✅ Producto insertado: ${producto.nombre} (ID: ${result.insertId})`);
        insertados++;
      } catch (err) {
        console.error(`❌ Error insertando ${producto.nombre}:`, err.message);
        errores++;
      }
    }

    console.log("\n📊 Resumen:");
    console.log(`✅ Productos insertados exitosamente: ${insertados}`);
    console.log(`❌ Errores: ${errores}`);
    console.log(`📦 Total procesados: ${fakeProducts.length}`);

    if (insertados > 0) {
      console.log("\n🎉 ¡Productos fake agregados correctamente a la base de datos!");
    }

  } catch (err) {
    console.error("💥 Error general:", err);
  } finally {
    // Cerrar el pool de conexiones
    await pool.end();
    console.log("🔐 Conexión a la base de datos cerrada");
  }
};

// Función para limpiar todos los productos (útil para testing)
const limpiarProductos = async () => {
  try {
    console.log("🧹 Limpiando todos los productos...");
    const [result] = await pool.query("DELETE FROM productos");
    console.log(`✅ ${result.affectedRows} productos eliminados`);
    
    // Resetear el auto_increment
    await pool.query("ALTER TABLE productos AUTO_INCREMENT = 1");
    console.log("✅ Contador de ID reseteado");
  } catch (err) {
    console.error("❌ Error limpiando productos:", err);
  }
};

// Verificar argumentos de línea de comandos
const args = process.argv.slice(2);

if (args.includes('--clean')) {
  console.log("🧹 Modo limpieza activado");
  limpiarProductos().then(() => {
    pool.end();
  });
} else if (args.includes('--reset')) {
  console.log("🔄 Modo reset: limpiando e insertando productos");
  limpiarProductos().then(() => {
    insertarProductos();
  });
} else {
  // Por defecto, solo insertar productos
  insertarProductos();
}

export { fakeProducts, insertarProductos, limpiarProductos };
