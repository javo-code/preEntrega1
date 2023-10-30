// Importa las librerias.
import express from "express";
import productRouter from "./routes/product.router.js";
import cartRouter from "./routes/cart.router.js";
import { dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));
//console.log(__dirname);

const app = express();

app.use(express.json())
app.use(express.static(__dirname + '/public'));

app.use('/api/products', productRouter);
app.use('/api/carts', cartRouter);

const PORT = 8080;
app.listen(PORT, () => console.log(`Listening on port: ${PORT}`));
