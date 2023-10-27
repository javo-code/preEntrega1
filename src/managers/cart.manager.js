import fs from "fs";

export class CartManager {
  constructor(path) {
    this.path = path;
  }

  async getCarts() {
    try {
      if (fs.existsSync(this.path)) {
        const cartsJSON = await fs.promises.readFile(this.path, "utf-8");
        return JSON.parse(cartsJSON);
      } else return [];
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

  async createCart(obj) {
    try {
      const cart = {
        id: (await this.#getMaxId()) + 1,
        products: [],
      };
      const cartsFile = await this.getCarts();
      cartsFile.push(cart);
      await fs.promises.writeFile(this.path, JSON.stringify(carts));
      return cart;
    } catch (error) {
      console.log(error);
    }
  }

  
  async getCartById(id) {
    try {
        const carts = await this.getCarts();
        const cart = carts.find(cart => cart.id === id);
        if(!cart) return false;
        return cart;
    } catch (error) {
        console.log(error);
    }
  }

  
  async deleteCart(id){
    try {
      const carts = await this.getCarts();
      const cart = carts.find(c => c.id == id);
        if(carts.length < 0) return false;
        const newArray = carts.filter(cart => cart.id !== id);
        await fs.promises.writeFile(this.path, JSON.stringify(newArray));
    } catch (error) {
        console.log(error);
    }
  }
  async sendProductsToCart(idCart, idProd) {
    const carts = await this.getCarts();
    const cartExists = await this.getCartsById(idCart);
    //se podria buscar si el producto existe en el array de products - TAREA
    if (cartExists) {
      const existProdInCart = cartExists.products.find(p => p.id == idProd);
      if (existProdInCart) existProdInCart.quantity + 1
      else {
        const prod = {
          products: idProd,
          quantity: 1
        };
        cartExists.products.push(prod)
      }
      await fs.promises.writeFile(this.path, JSON.stringify(carts));
      return cartExists;
    }
  }
}