import { cartsModel } from "../models/carts.model.js";
import { logger } from "../../middlewares/logger/logger.middleware.js";

export default class Carts {
  constructor() {
    this.logger = logger;
  }

  getCartsById = async ({ _id: cid }) => {
    try {
      let result = await cartsModel.findById({ _id: cid }).populate('products.product');
      this.logger.info(`Successful query for cart with ID ${cid}`);
      return result;
    } catch (error) {
      this.logger.error(`Error while fetching cart with ID ${cid}: ${error.message}`);
      return null;
    }
  }

  createCarts = async ({ products: [] }) => {
    try {
      let result = await cartsModel.create({ products: [] });
      this.logger.info(`Cart created with ID ${result._id}`);
      return result;
    } catch (error) {
      this.logger.error(`Error while creating a new cart: ${error.message}`);
      return null;
    }
  }

  addProductToCarts = async ({ _id: cid }) => {
    try {
      let result = await cartsModel.findById({ _id: cid }).populate('products.product');
      this.logger.info(`Product added to cart with ID ${cid}`);
      return result;
    } catch (error) {
      this.logger.error(`Error while adding product to cart with ID ${cid}: ${error.message}`);
      return null;
    }
  }

  getCarts = async () => {
    try {
      let result = await cartsModel.find();
      this.logger.info('Successful query for all carts');
      return result;
    } catch (error) {
      this.logger.error(`Error while fetching all carts: ${error.message}`);
      return null;
    }
  }

  deleteCarts = async ({ _id: cid }) => {
    try {
      let result = await cartsModel.deleteOne({ _id: cid });
      this.logger.info(`Cart with ID ${cid} deleted successfully`);
      return result;
    } catch (error) {
      this.logger.error(`Error while deleting cart with ID ${cid}: ${error.message}`);
      return null;
    }
  }

  deleteProductInCarts = async (cid, pid) => {
    try {
      let result = await cartsModel.findOneAndUpdate(
        { _id: cid, 'products.product': pid },
        { $inc: { 'products.$.quantity': -1 } },
        { new: true }
      );

      await cartsModel.findOneAndUpdate(
        { _id: cid, 'products.product': pid, 'products.quantity': { $lte: 0 } },
        { $pull: { 'products': { product: pid } } },
        { new: true }
      );

      this.logger.info(`Product with ID ${pid} removed from cart with ID ${cid}`);
      return result;
    } catch (error) {
      this.logger.error(`Error while removing product with ID ${pid} from cart with ID ${cid}: ${error.message}`);
      return null;
    }
  }

  updateCarts = async (cid, productsUpdate) => {
    try {
      let result = await cartsModel.findByIdAndUpdate(
        cid,
        {
          $set: {
            'products': productsUpdate,
          },
        },
        { new: true }
      );
      this.logger.info(`Cart with ID ${cid} updated successfully`);
      return result;
    } catch (error) {
      this.logger.error(`Error while updating cart with ID ${cid}: ${error.message}`);
      return null;
    }
  };

  deleteAllProductsinCarts = async (cid) => {
    try {
      let result = await cartsModel.findByIdAndDelete(cid);
      this.logger.info(`All products deleted from cart with ID ${cid}`);
      return result;
    } catch (error) {
      this.logger.error(`Error while deleting all products from cart with ID ${cid}: ${error.message}`);
      return null;
    }
  }

  updateQuantityProductsInCarts = async (cid, pid, quantity) => {
    try {
      let cart = await this.getCartsById({ _id: cid });

      const existingProductIndex = cart.products.findIndex((p) => p.product.equals(pid));

      if (existingProductIndex !== -1) {
        cart.products[existingProductIndex].quantity = quantity;
        await cart.save();
        this.logger.info(`Quantity updated for product ${pid} in cart ${cid}`);
        return cart;
      } else {
        this.logger.error(`Product with ID ${pid} not found in cart ${cid}`);
        return null;
      }
    } catch (error) {
      this.logger.error(`Error while updating quantity of product in cart ${cid}: ${error.message}`);
      return null;
    }
  };
}
