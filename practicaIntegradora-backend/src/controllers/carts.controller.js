import Carts from "../dao/classes/carts.dao.js";
import { productsModel } from "../dao/models/products.model.js";

const cartsService = new Carts()

export const getCartsById = async (req, res) => {
    try {
        let cid = req.params.cid;
        let result = await cartsService.getCartsById({ _id: cid })
        if (!result) return res.status(404).send("Cannot get cart with this id because doesn´t exists")
        return { status: "success", payload: result };
    } catch (err) {
        res.status(500).send("Server error: " + err)
    }
};

export const createCarts = async (req, res) => {
    try {
        let result = await cartsService.createCarts({ products: [] })
        if (!result) return res.status(404).send("Cannot create carts")
        res.send({ status: "success", payload: result })
    }

    catch (err) {
        res.status(500).send("Server error " + err)
    }
}

export const addProductToCarts = async (req, res) => {
    try {
        const cid = req.params.cid;
        const pid = req.params.pid;
        const user = req.user;

        let cart = await cartsService.getCartsById({ _id: cid });

        const product = await productsModel.findById(pid);

        if (product.owner === user.email) {
            return res.status(400).send({ status: "error", message: "You cannot add your own product to the cart." });
        }

        const existingProductIndex = cart.products.findIndex((p) => p.product.equals(pid));

        if (existingProductIndex === -1) {
           
            cart.products.push({ product: pid, quantity: 1 });
        } else {
            cart.products[existingProductIndex].quantity += 1;
        }

        await cart.save();

        const result = await cartsService.addProductToCarts({ _id: cid });
        
        if (!result) {
            return res.status(404).send("Cannot add product to cart");
        }

        res.send({ status: "success", payload: result });
    } catch (err) {
        res.status(500).send("Server error " + err);
    }
};

export const getUserCart = async (req, res) => {
    try {
        const user = req.user;
        const userCartId = user.carts[0];

        const userCart = await cartsService.getCartsById({ _id: userCartId });

        if (!userCart) {
            return res.status(404).send({ status: "error", message: "User cart not found" });
        }

        res.send({ status: "success", userCart });
    } catch (err) {
        res.status(500).send({ status: "error", message: "Server error", error: err });
    }
};

export const getUserCartId = async (req, res) => {
    try {
        const user = req.user;
        const userCartId = user.carts[0];
        res.send({ status: "success", userCartId });
    } catch (err) {
        res.status(500).send({ status: "error", message: "Server error", error: err });
    }
};

export const getCarts = async (req, res) => {
    try {
        let result = await cartsService.getCarts()
        if (!result) return res.status(404).send("Cannot get carts")
        res.send({ status: "success", payload: result })
    }
    catch (err) {
        res.status(500).send("Server error " + err)
    }
}

export const deleteCarts = async (req, res) => {
    try {
        let cid = req.params.cid
        let result = await cartsService.deleteCarts({ _id: cid })
        if (!result) return res.status(404).send("Cannot delete cart")
        res.send({ status: "success", payload: result })
    }
    catch (err) {
        res.status(500).send("Server error " + err)
    }
}

export const deleteProductInCarts = async (req, res) => {
    try {
        let pid = req.params.pid;
        let cid = req.params.cid;
        let result = await cartsService.deleteProductInCarts(cid, pid)
        if (!result) return res.status(404).send("Cart not found or product not in cart");
        res.send({ status: "success", payload: result });
    }
    catch (err) {
        res.status(500).send("Server error " + err);
    }
};

export const updateCarts = async (req, res) => {
    try {
        let cid = req.params.cid;
        let productsUpdate = req.body.products;

        let result = await cartsService.updateCarts(cid, productsUpdate);

        if (!result) {
            return res.status(404).send("Cart not found");
        }

        res.send({ status: "success", payload: result });
    } catch (err) {
        res.status(500).send("Server error: " + err);
    }
};

export const deleteAllProductsinCarts = async (req, res) => {
    try {
        const cid = req.params.cid;

        const cart = await cartsService.deleteAllProductsinCarts(cid);

        if (!cart) {
            return res.status(404).send("Cart not found");
        }

        cart.products = [];

        const result = await cart.save();
        if (!result) return res.status(404).send("Cannot delete products in cart")
        res.send({ status: "success", payload: result });
    } catch (err) {
        res.status(500).send("Server Error: " + err);
    }
};

export const updateQuantityProductsInCarts = async (req, res) => {
    try {
        let cid = req.params.cid;
        let pid = req.params.pid;
        let quantity = req.body.quantity;

        if (!quantity || isNaN(quantity) || quantity <= 0) {
            return res.status(400).send("The quantity must be a positive number");
        }

        let result = await cartsService.updateQuantityProductsInCarts(cid, pid, quantity);

        if (!result) {
            return res.status(404).send("Product not found in the cart");
        }

        res.send({ status: "success", payload: result });
    } catch (err) {
        res.status(500).send("Server error: " + err);
    }
};

export const purchaseCart = async (req, res) => {
    try {
        const cartId = req.params.cid;

        const cart = await cartsService.getCartsById({ _id: cartId });

        if (!cart) {
            return res.status(404).send({ status: "error", message: "Cart not found" });
        }

        for (const productInfo of cart.products) {
            const productId = productInfo.product;
            const quantityInCart = productInfo.quantity;
            const productTitle = productInfo.product.title

            const product = await productsModel.findById(productId);

            if (!product) {
                return res.status(404).send({ status: "error", message: `Product with ID ${productId} not found` });
            }

            if (product.stock >= quantityInCart) {
                product.stock -= quantityInCart;
                await product.save();
            } else {
                return res.status(400).send({
                    status: "error",
                    message: `Not enough stock for product "${productTitle}"`,
                    product: product,
                    cart: cart
                });
            }
        }

        return res.send({ status: "success", message: "Purchase completed successfully" });
    } catch (err) {
        return res.status(500).send({ status: "error", message: "Server error", error: err });
    }
};
