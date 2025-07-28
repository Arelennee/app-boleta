# Gestión de Productos Fake 🛍️

Este proyecto incluye un script para agregar productos de prueba a la base de datos.

## Productos incluidos

El script agrega **20 productos fake** que incluyen:

- **Electrónicos**: Laptops, smartphones, tablets
- **Gaming**: Mouse gaming, teclados mecánicos, auriculares
- **Componentes PC**: Tarjetas gráficas, procesadores, RAM, SSD
- **Periféricos**: Monitores, webcams, micrófonos, impresoras
- **Accesorios**: Cables, hubs USB-C, routers

## Comandos disponibles

### 1. Agregar productos fake
```bash
npm run seed-products
```
Agrega los 20 productos fake a la base de datos. Si ya existen algunos, los agregará de todas formas (no verifica duplicados).

### 2. Limpiar todos los productos
```bash
npm run clean-products
```
**⚠️ CUIDADO**: Elimina TODOS los productos de la base de datos y resetea el contador de IDs.

### 3. Reset completo (limpiar + agregar)
```bash
npm run reset-products
```
Primero elimina todos los productos existentes y luego inserta los productos fake. Útil para comenzar con datos limpios.

## Estructura de los productos

Cada producto tiene los siguientes campos:
- `nombre`: Nombre del producto
- `descripcion`: Descripción detallada (puede ser null)
- `precio`: Precio en pesos chilenos (números enteros)
- `stock`: Cantidad disponible

## Ejemplo de uso

```bash
# 1. Limpiar base de datos
npm run clean-products

# 2. Agregar productos fake
npm run seed-products

# 3. Verificar que se agregaron (con el servidor corriendo)
curl http://localhost:3000/api/productos
```

## Precios incluidos

Los precios están en pesos chilenos y van desde $19.990 (cable HDMI) hasta $999.990 (iPhone 15), con una buena variedad para testing de diferentes rangos de precios.

## Personalización

Para agregar más productos o modificar los existentes, edita el array `fakeProducts` en el archivo `productos.js`.
