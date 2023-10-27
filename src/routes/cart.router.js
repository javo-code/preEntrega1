import { Router } from "express";
const router = Router();

import { CartManager } from "../managers/cart.manager.js";
const chartManager = new CartManager("../manager/chart.manager.js");
router.get("/", async (req, res) => {
    try {
        const { limit } = req.query;
        const charts = await chartManager.getCharts();
        if (!limit) {
            res.status(200).json(charts);
        } else {
            const chartsByLimit = await chartManager.getChartsByLimit(limit);
        res.status(200).json(chartsByLimit);
        }
    } catch (error) {
        res.status(404).json({ message: "The chart does not exist..." });
    }
});

router.get('/:cid', (req, res) => {
    const { cid } = req.params
    //buscar el carrito por id
});

router.post(':idCart/product/:idProd', async (req, res) => {
    const { idCart } = req.params;
    const { idProd } = req.params; //id de cart existente
    //llamar al metodo que busca cart por id
    //llamar al metodo que busca prod por id
    //si el prod ya existe, llama al metodo que guarada el prod en el carrito
    // await cartManager.saveProductsToCart(idCart, idProd);
})

// Ruta para crear un nuevo charto.
router.post("/", async (req, res) => {
try {
    //crear el carrito
    const chartCreated = await chartManager.createChart(req.body);
    const chartResponse = {
    
    };

    res.status(200).json(chartResponse);
} catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
    }
});

// Ruta para actualizar un CARRITO por su ID.
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

export default router;


