import { Router } from "express";
const router = Router();

import { ProductManager } from "./product.router";

// Crea una instancia de ProductManager con un archivo JSON como fuente de datos.
const productManager = new ProductManager('./products.json');



router.get("/", async (req, res) => {
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
router.get('/:pid', async (req, res) => {
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

router.post('/', async (req, res) => {
    try {
        const productCreated = await productManager.createProduct(req.body);
        const productResponse = {
            title: productCreated.title,
            description: productCreated.description,
            price: productCreated.price,
            img: productCreated.img,
            code: productCreated.code,
            stock: productCreated.stock
        };
        res.status(200).json(productResponse);
    } catch (error) {
        // En caso de cualquier error, responde con un código de estado 500 y un mensaje de error genérico.
        res.status(500).json({ error: "Internal Server Error" });
        
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const idNumber = Number(id);
        await productManager.deleteProduct(idNumber);
        res.json({ message: `Product ID: ${idNumber} deleted` });
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});

export default router;