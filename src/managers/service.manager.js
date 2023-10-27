import fs from 'fs';

export class ServiceManager {
    constructor(path) {
        this.path = path;
    }

    async getservices() {
        try {
            if (fs.existsSync(this.path)) {
                const servicesJSON = await fs.promises.readFile(this.path, 'utf-8');
                return JSON.parse(servicesJSON);
            } else {
                return [];
            }
        } catch (error) {
            console.log(error);
        }
    }

    async #getMaxId() {
        let maxId = 0;
        const services = await this.getservices();
        services.map((service) => {
            if (service.id > maxId) maxId = service.id;
        });
        return maxId;
    }

    async createservice(prod) {
        try {
            const service = {
                id: (await this.#getMaxId()) + 1,
                ...prod
            };
            const services = await this.getservices();

            const isCodeRepeated = services.some(existingservice => existingservice.code === service.code);
            if (isCodeRepeated) {
                throw new Error('Código de serviceo repetido!');
            }

            if (!service.title || !service.description || !service.price || !service.img || !service.code || !service.stock) {
                throw new Error('Error: Todos los campos son obligatorios.');
            }

            services.push(service);
            await fs.promises.writeFile(this.path, JSON.stringify(services));
            return service;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async getserviceById(idservice) {
        try {
            const services = await this.getservices();
            const serviceById = services.find(service => service.id === idservice);
            if (!serviceById) return false;
            return serviceById;
        } catch (error) {
            console.log(error);
        }
    }

    async updateservice(obj, idservice) {
        try {
            const services = await this.getservices();
            const serviceIndex = services.findIndex(service => service.id === idservice);
            if (serviceIndex === -1) return false;
            else services[serviceIndex] = { ...obj, idservice };
            await fs.promises.writeFile(this.path, JSON.stringify(services));
            await this.getservices();
        } catch (error) {
            console.log(error);
        }
    }

    async deleteservice(idservice) {
        try {
            const services = await this.getservices();
            if (services.length < 0) return false;
            const updatedArray = services.filter(service => service.id !== idservice);
            await fs.promises.writeFile(this.path, JSON.stringify(updatedArray));
        } catch (error) {
            console.log(error);
        }
    }

    async getservicesByLimit(limit) {
        try {
            const services = await this.getservices();
            if (!limit || limit >= services.length) return services;
            else return services.slice(0, limit);
        } catch (error) {
            console.log(error);
        }
    }
}
