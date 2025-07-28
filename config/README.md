# 🗄️ Database Setup for Boleta App

This folder contains the complete database structure and data for the Boleta application.

## 📋 Database Contents

The `database.sql` file contains:

### 🏗️ **Database Structure:**
- **Database name**: `boleta_app`
- **Character set**: `utf8mb4`
- **Collation**: `utf8mb4_0900_ai_ci`

### 📊 **Tables:**

1. **`productos`** - Product inventory
   - `id` (auto_increment, primary key)
   - `nombre` (product name)
   - `descripcion` (product description, optional)
   - `precio` (price as decimal)
   - `stock` (available quantity)

2. **`boletas`** - Invoice/receipt records
   - `id_boleta` (auto_increment, primary key)
   - `codigo_boleta` (unique invoice code)
   - `fecha` (creation timestamp)
   - `ruc_empresa` (company RUC)
   - `nombre_cliente` (client name)
   - `dni_cliente` (client DNI)
   - `ruc_cliente` (client RUC, optional)
   - `nombre_trabajador` (worker name)
   - `dni_trabajador` (worker DNI)
   - `total_boleta` (total amount)
   - `estado` (status: pendiente/activa)
   - `fecha_pago` (payment date, optional)

3. **`detalle_boleta`** - Invoice details/line items
   - `id_detalle` (auto_increment, primary key)
   - `codigo_boleta` (foreign key to boletas)
   - `id_producto` (foreign key to productos)
   - `cantidad` (quantity)
   - `subtotal` (line total)

### 📦 **Sample Data Included:**
- **42 products** with realistic tech items (laptops, peripherals, components)
- **4 sample boletas** with their corresponding details
- Price range: S/.19,990 - S/.999,990

## 🚀 How to Import

### Method 1: Command Line
```bash
mysql -u your_username -p < config/database.sql
```

### Method 2: MySQL Workbench
1. Open MySQL Workbench
2. Connect to your MySQL server
3. Go to **Server → Data Import**
4. Select **Import from Self-Contained File**
5. Browse and select `config/database.sql`
6. Click **Start Import**

### Method 3: phpMyAdmin
1. Open phpMyAdmin
2. Click **Import** tab
3. Click **Choose File** and select `config/database.sql`
4. Click **Go**

## ⚙️ Connection Configuration

After importing, update your connection settings in `src/config/db.js`:

```javascript
const pool = mysql.createPool({
  host: "localhost",      // or your MySQL server
  user: "your_username",  // your MySQL username
  password: "your_password", // your MySQL password
  database: "boleta_app", // database name (fixed)
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});
```

## ✅ Verification

After import, verify the data:

```sql
-- Check tables were created
SHOW TABLES;

-- Check product count
SELECT COUNT(*) FROM productos;

-- Check sample boletas
SELECT * FROM boletas LIMIT 5;

-- Check relationships work
SELECT b.codigo_boleta, p.nombre, d.cantidad, d.subtotal 
FROM detalle_boleta d
JOIN boletas b ON d.codigo_boleta = b.codigo_boleta
JOIN productos p ON d.id_producto = p.id
LIMIT 5;
```

## 📋 Features Included

- ✅ Auto-increment primary keys
- ✅ Foreign key constraints
- ✅ Default values (timestamps, status)
- ✅ Proper data types (decimal for money, text for descriptions)
- ✅ UTF8MB4 encoding (supports emojis and special characters)
- ✅ Sample data for immediate testing

Your boleta application will work immediately after importing this database! 🎉
