import fs from 'fs';
export class ProductManager {
    constructor(path) {
        this.path = path;
    }
    // Obtiene todos los productos almacenados en el archivo JSON.
    async getProducts() {
        try {
            // Verifica si el archivo existe en la ubicación especificada.
            if (fs.existsSync(this.path)) {
                // Lee el contenido del archivo en formato JSON y lo convierte en un objeto.
                const productsJSON = await fs.promises.readFile(this.path, 'utf-8');
                return JSON.parse(productsJSON);
            } else {
                // Si el archivo no existe, devuelve un array vacío.
                return [];
            }
        } catch (error) {
            console.log(error);
        }
    }
    //metodo privado de la clase ProductManager para generar ID unico.
    async #getMaxId() {
        let maxId = 0;
        const products = await this.getProducts();
        products.map((product) => {
            if (product.id > maxId) maxId = product.id;
        });
        return maxId;
    };
    // Crea un nuevo producto y lo agrega al archivo JSON de productos.
    async createProduct(prod) {
        try {
            // Genera un nuevo producto con un ID único autoincrementable.
            const product = {
                id: (await this.#getMaxId()) + 1,
                ...prod
            };
            const products = await this.getProducts();

            // Valida si el campo "code" está repetido en los productos existentes.
            const isCodeRepeated = products.some(existingProduct => existingProduct.code === product.code);
            if (isCodeRepeated) {
                throw new Error('Código de producto repetido!');
            }

            // Valida que TODOS los campos sean obligatorios.
            if (!product.title || !product.description || !product.price || !product.img || !product.code || !product.stock) {
                throw new Error('Error: Todos los campos son obligatorios.');
            }

            // Agrega el nuevo producto al array de productos y actualiza el archivo JSON.
            products.push(product);
            await fs.promises.writeFile(this.path, JSON.stringify(products));
            return product; // Devuelve el producto creado si todo es exitoso.
        } catch (error) {
            console.log(error);
            throw error; // Re-lanza la excepción para manejarla en la ruta Express.
        }
    }

    // Obtiene un producto por su ID.
    async getProductById(idProduct) {
        try {
            const products = await this.getProducts();
            const productById = products.find(product => product.id === idProduct);
            if (!productById) return false;
            return productById;
        } catch (error) {
            console.log(error);
        }
    }

    // Actualiza un producto por su ID.
    async updateProduct(obj, idProduct) {
        try {
            const products = await this.getProducts();
            const productIndex = products.findIndex(product => product.id === idProduct);
            if (productIndex === -1) return false;
            else products[productIndex] = { ...obj, idProduct };
            await fs.promises.writeFile(this.path, JSON.stringify(products));
            await this.getProducts();
        } catch (error) {
            console.log(error);
        }
    }

    // Elimina un producto por su ID. Aquí crea un nuevo array sin el producto cuyo ID coincida con el que se pasa por parámetro.
    async deleteProduct(idProduct) {
        try {
            const products = await this.getProducts();
            if (products.length < 0) return false;
            const updatedArray = products.filter(product => product.id !== idProduct);
            // Sobreescribe el archivo .json con el nuevo array.
            await fs.promises.writeFile(this.path, JSON.stringify(updatedArray));
        } catch (error) {
            console.log(error);
        }
    }
    // Obtiene una lista de productos limitada por la cantidad especificada.
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
