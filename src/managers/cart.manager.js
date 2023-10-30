import fs from "fs";
import { productManager } from "./product.manager.js";

class CartManager {
    constructor(path) {
        this.path = path;
    }
    async getCarts() {
        try {
            if (fs.existsSync(this.path)) {
                const cartsJSON = await fs.promises.readFile(this.path, "utf-8");
                return JSON.parse(cartsJSON);
            } else {
                return [];
            }
        } catch (error) {
            console.log(error);
        }
    }
    async #getMaxId() {
        let maxId = 0;
        const carts = await this.getCarts();
        carts.map((cart) => {
            if (cart.id > maxId) maxId = cart.id;
        });
        return maxId;
    }
    async createCart(prod) {
        try {
            const cart = {
                id: (await this.#getMaxId()) + 1,
                products: []
            };
            const cartsFile = await this.getCarts();
            cartsFile.push(cart);
            await fs.promises.writeFile(this.path, JSON.stringify(cartsFile));
            return cart
        } catch (error) {
            console.log(error);
        }
    }

    async getCartById(idCart) {
        const formattedIdCart = parseInt(idCart)

        try {
            const carts = await this.getCarts();

            const cartById = carts.find((cart) => cart.id === formattedIdCart);

            if (!cartById) return false;

            return cartById;
        } catch (error) {
            console.log(error);
        }
    }

    async saveProductToCart(idCart, idProduct) {
        try {
            const carts = await this.getCarts();
            let currentCart = carts.find((cart) => cart.id === Number(idCart));

            if (!currentCart) {
                throw new Error('Cart does not exist');
            }

            const products = await productManager.getProducts(); // Obtén los productos

            // Busca el producto en la lista de productos por su ID
            const productToAdd = products.find((product) => product.id === Number(idProduct));
            if (!productToAdd) {
                throw new Error('Product does not exist');
            }

            // Añade el producto al carrito
            const existingProduct = currentCart.product.find((p) => p.id === Number(idProduct));

            if (existingProduct) {
                existingProduct.quantity++; // Si el producto ya está en el carrito, aumenta la cantidad
            } else {
                // Si el producto no está en el carrito, añádelo con cantidad 1
                currentCart.product.push({ productId: productToAdd.id, quantity: 1 });
            }

            // Guarda el carrito con el nuevo producto
            await fs.promises.writeFile(this.path, JSON.stringify(carts, null, '\t'))

            return currentCart;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }


    async deleteCart(idCart) {
        try {
            const carts = await this.getCarts();
            if (carts.length < 0) return false;
            const updatedArray = carts.filter(
                (cart) => cart.id !== idCart
            );
            // Sobreescribe el archivo .json con el nuevo array.
            await fs.promises.writeFile(this.path, JSON.stringify(updatedArray));
        } catch (error) {
            console.log(error);
        }
    }

}

const cartManager = new CartManager("../preEntrega1/src/data/carts.json");

export { cartManager }