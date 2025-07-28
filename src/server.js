import express, { json } from "express";
import morgan from "morgan";
import cors from "cors";

import productosRoutes from "./routes/productos.routes.js";
import boletasRoutes from "./routes/boletas.routes.js";

const app = express();
const PORT = 3000;

app.use(json());
app.use(cors());
app.use(morgan("dev"));

app.use("/api/productos", productosRoutes);
app.use("/api/boletas", boletasRoutes);

app.listen(PORT, () => {
  console.log(`Server corriendo en el puerto ${PORT}`);
});
