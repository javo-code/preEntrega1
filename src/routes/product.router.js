import { Router } from "express";
const router = Router();

import { ProductManager } from "../managers/product.manager.js";
import { productValidator } from "../middleware/productValidator.js";
const productManager = new ProductManager(
    "../preEntrega1/src/data/products.json"
);

//MOSTRAR TODOS LOS PRODUCTOS
router.get("/", async (req, res) => {
    try {
        const { limit } = req.query;
        const products = await productManager.getProducts();
        if (!limit) {
        res.status(200).json(products);
        } else {
        const productsByLimit = await productManager.getProductByLimit(limit);
        res.status(200).json(productsByLimit);
        }
    } catch (error) {
        res.status(404).json({ message: "The product does not exist..." });
    }
});

//CREAR PRODUCTO.
router.post("/", productValidator, async (req, res) => {
    try {
        const productCreated = await productManager.createProduct(req.body);
        res.status(200).json(productCreated);
    } catch (error) {
        res.status(500).json({ error });
    }
});

//MOSTRAR PRODUCTO POR ID.
router.get("/:pid", async (req, res) => {
    try {
        const { pid } = req.params;
        const productById = await productManager.getProductById(Number(pid));
        if (!productById) {
        res.status(404).json({ message: "The product does not exist..." });
        } else {
        res.status(200).json(productById);
        }
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});

//MODIFICAR PRODUCTO.
router.put("/:id", async (req, res) => {
    try {
        const product = { ...req.body };
        const { id } = req.params;
        const idNumber = Number(id);
        const productOk = await productManager.getProductById(idNumber);
        if (!productOk) {
        res.status(404).json({ message: "The product does not exist..." });
        } else {
        await productManager.updateProduct(product, idNumber);
        res
            .status(200)
            .json({ message: `Product ID: ${id} updated successfully!` });
        }
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});

//ELIMINAR PRODUCTO.
router.delete("/:pid", async (req, res) => {
    try {
        const { pid } = req.params;
        const idNumber = Number(pid);
        await productManager.deleteProduct(idNumber);
        res.json({ message: `Product ID: ${idNumber} deleted` });
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});

export default router;
