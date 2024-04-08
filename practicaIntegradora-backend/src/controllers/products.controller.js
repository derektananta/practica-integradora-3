import Products from "../dao/classes/products.dao.js"
import { getPrevLink, getNextLink } from "../utils.js"
import { createProductErrorInfo } from "../services/error/info.js"
import CustomError from "../services/error/CustomError.js"
import EErrors from "../services/error/enums.js"

const productsService = new Products()

export const getProducts = async (req, res) => {
    try {
        let page = req.query.page ? parseInt(req.query.page) : 1
        let limit = req.query.limit ? parseInt(req.query.limit) : 10
        let sort = 0
        let query = {}

        if (req.query.sort) {
            const sortOption = req.query.sort.toLowerCase()
            if (sortOption === "asc") {
                sort = 1
            } else {
                sortOption === "desc"
                sort = -1
            }
        }

        if (req.query.query) {
            query = { category: { $regex: req.query.query, $options: "i" } }
        }

        let options = {
            page: page,
            limit: limit,
            sort: sort !== 0 ? { price: sort } : null
        }

        let result = await productsService.getProducts(query, options)
        if (!result) return res.status(404).send("Cannot get products")

        const baseUrl = req.protocol + '://' + req.get('host') + req.originalUrl;

        return {
            status: "success",
            payload: result,
            prevLink: result.hasPrevPage ? getPrevLink(baseUrl, result) : null,
            nextLink: result.hasNextPage ? getNextLink(baseUrl, result) : null
        };
    }

    catch (err) {
        res.status(500).send("Server error: " + err)
    }
}

export const getProductsById = async (req, res) => {
    try {
        let pid = req.params.pid
        let result = await productsService.getProductsById(pid)
        if (!result) return res.status(404).send("Cannot get products with this id because doesn´t exists")
        res.send({ status: "success", payload: result })
    }
    catch (err) {
        res.status(500).send("Server error: " + err)
    }
}

export const createProducts = async (req, res) => {
    let { title, description, price, thumbnail, code, stock, category, owner } = req.body
    if (!title || !description || !price || !thumbnail || !code || !stock || !category) {
        CustomError.createError({
            name: "Product creation Error",
            cause: createProductErrorInfo({ title, description, price, thumbnail, code, stock, category }),
            message: "Error trying to create product",
            code: EErrors.INVALID_TYPES_ERROR
        })
    }

    let result = await productsService.createProducts(title, description, price, thumbnail, code, stock, category, owner)
    if (!result) return res.status(404).send("Cannot create products")
    res.send({ status: "success", payload: result })
}

export const updateProducts = async (req, res) => {

    try {
        let pid = req.params.pid
        let productReplace = req.body
        if (!productReplace.title || !productReplace.description || !productReplace.price || !productReplace.thumbnail || !productReplace.code || !productReplace.stock || !productReplace.category) return res.status(400).send({ status: "error", error: "Incomplete values" })
        let result = await productsService.updateProducts({ _id: pid }, productReplace)
        if (!result) return res.status(404).send("The product with this Id cannot be updated because it does not exist")
        res.send({ status: "success", payload: result })
    }
    catch (err) {
        res.status(500).send("Server error: " + err)
    }

}

export const deleteProducts = async (req, res) => {
    try {
        const pid = req.params.pid;
        const user = req.user;
        const product = await productsService.getProductsById(pid);

        if (!product) {
            return res.status(404).send("The product with this Id does not exist");
        }

        if (user.rol === "premium" || user.rol === "admin") {
            if (product.owner !== user.email && user.rol !== "admin") {
                return res.status(403).send("You don't have permission to delete this product");
            }
        } else {
            return res.status(403).send("You don't have permission to delete products");
        }

        const result = await productsService.deleteProducts({ _id: pid });

        if (!result) {
            return res.status(404).send("The product with this Id cannot be deleted because it does not exist");
        }

        res.send({ status: "success", payload: result });
    } catch (err) {
        res.status(500).send("Server error: " + err);
    }
}

export const getAllProducts = async (req, res) => {
    try {
        let result = await productsService.getAllProducts();
        if (!result) return res.status(404).send("Cannot get all products");

        return {
            status: "success",
            payload: result
        };

    } catch (err) {
        res.status(500).send("Server error: " + err);
    }
};

export const getPremiumProductsForUser = async (req, res) => {
    try {
        const email = req.user.email;

        let userProducts = await productsService.getPremiumProductsForUser(email);

        if (!userProducts) {
            return res.status(404).send(`Cannot get products for user "${email}"`);
        }

        return {
            status: "success",
            payload: userProducts
        };
    } catch (err) {
        res.status(500).send("Server error: " + err);
    }
};

