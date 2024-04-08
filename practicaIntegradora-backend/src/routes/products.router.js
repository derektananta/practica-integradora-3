import { Router } from "express"
import { getProducts, getProductsById, createProducts, updateProducts, deleteProducts } from "../controllers/products.controller.js"
import {checkRole} from "../middlewares/checkRole.js"
export const router = Router()

router.get("/", checkRole(["admin", "premium"]), async (req, res) => {
    const productsData = await getProducts(req, res);
    res.json(productsData);
});

router.get("/:pid", checkRole(["admin", "premium"]), getProductsById);

router.post("/", checkRole(["admin", "premium"]), createProducts);

router.put("/:pid", checkRole(["admin", "premium"]), updateProducts)

router.delete("/:pid", checkRole(["admin", "premium"]), deleteProducts)