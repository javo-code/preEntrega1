import { Router } from "express";
const router = Router();

import { ServiceManager } from "../managers/service.manager.js";
const serviceManager = new ServiceManager("../manager/service.manager.js");

router.get("/", async (req, res) => {
  try {
    const { limit } = req.query;
    const services = await serviceManager.getServices();

    if (!limit) {
      res.status(200).json(services);
    } else {
      const servicesByLimit = await serviceManager.getServicesByLimit(limit);
      res.status(200).json(servicesByLimit);
    }
  } catch (error) {
    res.status(404).json({ message: "The service does not exist..." });
  }
});

router.post("/", async (req, res) => {
  try {
    const serviceCreated = await serviceManager.createService(req.body);
    const serviceResponse = {
      title: serviceCreated.title,
      description: serviceCreated.description,
      price: serviceCreated.price,
      img: serviceCreated.img,
      code: serviceCreated.code,
      stock: serviceCreated.stock,
    };
    res.status(200).json(serviceResponse);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/:pid", async (req, res) => {
  try {
    const { id } = req.params;
    const serviceById = await serviceManager.getServiceById(Number(id));
    if (!serviceById) {
      res.status(404).json({ message: "The service does not exist..." });
    } else {
      res.status(200).json(serviceById);
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
    }
});

router.put("/:pid", async (req, res) => {
  try {
    const service = { ...req.body };
    const { id } = req.params;
    const idNumber = Number(id);
    const serviceOk = await serviceManager.getServiceById(idNumber);

    if (!serviceOk) {
      res.status(404).json({ message: "The service does not exist..." });
    } else {
      await serviceManager.updateService(service, idNumber);
      res.status(200).json({ message: `service ID: ${id} updated successfully!` });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.delete("/:pid", async (req, res) => {
  try {
    const { id } = req.params;
    const idNumber = Number(id);
    await serviceManager.deleteService(idNumber);
    res.json({ message: `service ID: ${idNumber} deleted` });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;