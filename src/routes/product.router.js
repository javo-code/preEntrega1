import { Router } from "express";
const router = Router();

import { ProductManager } from "../managers/product.manager.js";
const productManager = new ProductManager("../manager/product.manager.js");

router.get("/", async (req, res) => {
  try {
    const { limit } = req.query;
    const products = await productManager.getProducts();
    if (!limit) {
      res.status(200).json(products);
    } else {
      const productsByLimit = await productManager.getProductsByLimit(limit);
      res.status(200).json(productsByLimit);
    }
  } catch (error) {
    res.status(404).json({ message: "The product does not exist..." });
  }
});

router.post("/", async (req, res) => {
  try {
    const productCreated = await productManager.createProduct(req.body);
    const productResponse = {
      title: productCreated.title,
      description: productCreated.description,
      price: productCreated.price,
      img: productCreated.img,
      code: productCreated.code,
      stock: productCreated.stock,
    };
    res.status(200).json(productResponse);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/:pid", async (req, res) => {
  try {
    const { id } = req.params;
    const productById = await productManager.getProductById(Number(id));
    if (!productById) {
      res.status(404).json({ message: "The product does not exist..." });
    } else {
      res.status(200).json(productById);
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.put("/:pid", async (req, res) => {
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
        .status(200).json({ message: `Product ID: ${id} updated successfully!` });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.delete("/:pid", async (req, res) => {
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