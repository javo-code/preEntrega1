import fs from "fs";

export class ProductManager {
  constructor(path) {
    this.path = path;
  }
  async getProducts() {
    try {
      if (fs.existsSync(this.path)) {
        const productsJSON = await fs.promises.readFile(this.path, "utf-8");
        return JSON.parse(productsJSON);
      } else {
        return [];
      }
    } catch (error) {
      console.log(error);
    }
  }
  async #getMaxId() {
    let maxId = 0;
    const products = await this.getProducts();
    products.map((product) => {
      if (product.id > maxId) maxId = product.id;
    });
    return maxId;
  }
  async createProduct(prod) {
    try {
      const product = {
        id: (await this.#getMaxId()) + 1,
        ...prod,
      };
      const products = await this.getProducts();

      const isCodeRepeated = products.some(
        (existingProduct) => existingProduct.code === product.code
      );
      if (isCodeRepeated) {
        throw new Error("Código de producto repetido!");
      }

      if (
        !product.title ||
        !product.description ||
        !product.price ||
        !product.img ||
        !product.code ||
        !product.stock
      ) {
        throw new Error("Error: Todos los campos son obligatorios.");
      }

      products.push(product);
      await fs.promises.writeFile(this.path, JSON.stringify(products));
      return product;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async getProductById(idProduct) {
    try {
      const products = await this.getProducts();
      const productById = products.find((product) => product.id === idProduct);
      if (!productById) return false;
      return productById;
    } catch (error) {
      console.log(error);
    }
  }

  async updateProduct(obj, idProduct) {
    try {
      const products = await this.getProducts();
      const productIndex = products.findIndex(
        (product) => product.id === idProduct
      );
      if (productIndex === -1) return false;
      else products[productIndex] = { ...obj, idProduct };
      await fs.promises.writeFile(this.path, JSON.stringify(products));
      await this.getProducts();
    } catch (error) {
      console.log(error);
    }
  }

  async deleteProduct(idProduct) {
    try {
      const products = await this.getProducts();
      if (products.length < 0) return false;
      const updatedArray = products.filter(
        (product) => product.id !== idProduct
      );
      await fs.promises.writeFile(this.path, JSON.stringify(updatedArray));
    } catch (error) {
      console.log(error);
    }
  }

  async getProductsByLimit(limit) {
    try {
      const products = await this.getProducts();
      if (!limit || limit >= products.length) return products;
      else return products.slice(0, limit);
    } catch (error) {
      console.log(error);
    }
  }
}
