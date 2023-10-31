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
        // Obtener todos los carritos
        const carts = await this.getCarts();
        // Encontrar el carrito actual por su ID
let currentCart = carts.find((cart) => cart.id === Number(idCart));

// Verificar si el carrito existe
if (!currentCart) {
    throw new Error('Cart does not exist');
}

// Inicializar el array 'products' en el carrito si no existe
if (!currentCart.products) {
    currentCart.products = [];
}

// Obtener la lista de productos
const products = await productManager.getProducts();

// Encontrar el producto a agregar por su ID
const productToAdd = products.find((product) => product.id === Number(idProduct));

// Verificar si el producto existe
if (!productToAdd) {
    throw new Error('Product does not exist');
}

// Encontrar si el producto ya está en el carrito
const existingProductIndex = currentCart.products.findIndex((p) => p.productId === productToAdd.id);

if (existingProductIndex !== -1) {
    // Si el producto ya está en el carrito, aumentar la cantidad
    currentCart.products[existingProductIndex].quantity++;
} else {
    // Si el producto no está en el carrito, añadirlo con cantidad 1
    currentCart.products.push({ productId: productToAdd.id, quantity: 1 });
}

// Guardar el carrito con el nuevo producto
await fs.promises.writeFile(this.path, JSON.stringify(carts, null, '\t'));

return currentCart;
    } catch (error) {
        // Manejar cualquier error y lanzarlo de nuevo
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