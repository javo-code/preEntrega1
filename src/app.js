// Importa las librerias.
import express from "express";
import productRouter from "./routes/product.router.js";
import serviceRouter from "./routes/service.router.js";
import usersRouter from "./routes/user.router.js";
import cartsRouter from "./routes/cart.router.js";
import { dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));
//console.log(__dirname);

const app = express();

app.use(express.static(__dirname + '/public'));

app.use('/products', productRouter);
app.use('/services', serviceRouter);
app.use('/users', usersRouter);
app.use('/carts', cartsRouter);


// Configura el puerto en el que escuchará el servidor Express y muestra un mensaje de inicio.
const PORT = 8080;
app.listen(PORT, () => console.log(`Listening on port: ${PORT}`));
