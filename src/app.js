// Importa las librerias.
import express from "express";
import productRouter from "./routes/product.router.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/products', productRouter);

// Configura el puerto en el que escuchará el servidor Express y muestra un mensaje de inicio.
const PORT = 8080;
app.listen(PORT, () => console.log(`Listening on port: ${PORT}`));
