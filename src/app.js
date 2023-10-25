// Importa la biblioteca Express y el ProductManager.
import express from "express";
import { ProductManager } from "./manager/product.manager.js";

// Crea una instancia de ProductManager con un archivo JSON como fuente de datos.
const productManager = new ProductManager('./products.json');

// Crea una instancia de Express.
const app = express();

// Configura Express para manejar solicitudes JSON y datos codificados en URL.
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ruta para obtener todos los productos o productos limitados.
app.get("/products", async (req, res) => {
    try {
        // Extrae el parámetro "limit" de la solicitud si está presente.
        const { limit } = req.query;

        // Obtiene todos los productos desde el ProductManager.
        const products = await productManager.getProducts();

        if (!limit) {
            // Si no se proporciona un límite, responde con todos los productos con un código de estado 200.
            res.status(200).json(products);
        } else {
            // Si se proporciona un límite, obtiene productos limitados y los responde con un código de estado 200.
            const productsByLimit = await productManager.getProductsByLimit(limit);
            res.status(200).json(productsByLimit);
        }
    } catch (error) {
        // En caso de error, responde con un código de estado 404 y un mensaje de error.
        res.status(404).json({ message: "The product does not exist..." });
    }
});

// Ruta para obtener un producto por su ID.
app.get('/products/:pid', async (req, res) => {
    try {
        // Extrae el valor del parámetro "id" de la URL usando req.params en lugar de res.params.
        const { id } = req.params;

        // Utiliza una función asíncrona (como productManager.getProductById) para obtener el producto por su ID.
        const productById = await productManager.getProductById(Number(id));

        if (!productById) {
            // Si no se encontró el producto, responde con un código de estado 404 y un mensaje de error.
            res.status(404).json({ message: "The product does not exist..." });
        } else {
            // Si se encontró el producto, responde con un código de estado 200 y el producto encontrado.
            res.status(200).json(productById);
        }
    } catch (error) {
        // En caso de cualquier error, responde con un código de estado 500 y un mensaje de error genérico.
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Configura el puerto en el que escuchará el servidor Express y muestra un mensaje de inicio.
const PORT = 8080;
app.listen(PORT, () => console.log(`Listening on port: ${PORT}`));
