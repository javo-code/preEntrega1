import { Router } from "express";
const router = Router();
import { cartManager } from "../managers/cart.manager.js";
import { productManager } from "../managers/product.manager.js";


//MOSTRAR TODOS LOS CARRITOS.
router.get("/", async (req, res) => {
    try {
        const carts = await cartManager.getCarts();
        res.status(200).json(carts);
    } catch (error) {
        res.status(404).json({ message: "The cart does not exist..." });
    }
});

//OBTENER CARRITO POR ID.
router.get('/:cid', async (req, res) => {
    try {
        const { cid } = req.params;
        const cartById = await cartManager.getCartById(Number(cid));
        if (!cartById) {
            res.status(404).json({ message: "The cart does not exist..." });
        } else {
            res.status(200).json(cartById);
        }
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});


//AGREGAR PRODUCTOS UN CARRITO POR ID.
router.post('/:idCart/product/:idProd', async (req, res) => {
    try {
        const { idCart, idProd } = req.params; // Obtenener los valores de los parametros

        console.log(`CARTD ID: ${idCart} --- PRODUCT ID: ${idProd}`)

        /*
        
        const cart = await cartManager.getCartById(idCart); // Llama al metodo que busca el carrito por su ID
        const product = await productManager.getProductById(Number(idProd)); // Llama al método que busca el producto por su ID


        if (product && cart) {
            // Si el producto y el carrito existen
            await cartManager.saveProductToCart(idCart, idProd); // Llama al metodo para guardar el producto en el carrito
            res.status(200).json(cart);
        } else {
            res.status(404).json({ message: 'Cart or product does not exist' });
        }
        */

        const cart = await cartManager.saveProductToCart(idCart, idProd); // Llama al metodo para guardar el producto en el carrito

        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ error: `Catch error en el router ${error.message}` });
    }
});



// Ruta para crear un nuevo carrito.
router.post("/", async (req, res) => {
    try {
        //crear el carrito
        const cartCreated = await cartManager.createCart(req.body);
        res.status(200).json(cartCreated);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Ruta para actualizar un CARRITO por su ID.
router.put("/:pid", async (req, res) => {
    try {
        const cart = { ...req.body };
        const { id } = req.params;
        const idNumber = Number(id);
        const cartOk = await cartManager.getCartById(idNumber);
        if (!cartOk) {
            res.status(404).json({ message: "The cart does not exist..." });
        } else {
            await cartManager.updateCart(cart, idNumber);
            res.status(200).json({ message: `cart ID: ${id} updated successfully!` });
        }
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});

export default router;
