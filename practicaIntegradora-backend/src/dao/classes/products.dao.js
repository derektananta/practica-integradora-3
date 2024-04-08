import { productsModel } from "../models/products.model.js";
import { logger } from "../../middlewares/logger/logger.middleware.js";

export default class Products {

    constructor() {
        this.logger = logger;
    }

    getProducts = async (query, options) => {
        try {
            let result = await productsModel.paginate(query, options);
            this.logger.info('Products successfully retrieved.');
            return result;
        } catch (error) {
            this.logger.error(`Error while fetching products: ${error.message}`);
            return null;
        }
    }

    getProductsById = async (pid) => {
        try {
            let result = await productsModel.findById(pid);
            this.logger.info(`Product with ID ${pid} successfully retrieved.`);
            return result;
        } catch (error) {
            this.logger.error(`Error while fetching product with ID ${pid}: ${error.message}`);
            return null;
        }
    }

    createProducts = async (title, description, price, thumbnail, code, stock, category, owner) => {
        try {
            let result = await productsModel.create({
                title,
                description,
                price,
                thumbnail,
                code,
                stock,
                category,
                owner
            });
            this.logger.info(`Product "${title}" created successfully.`);
            return result;
        } catch (error) {
            this.logger.error(`Error while creating product: ${error.message}`);
            return null;
        }
    }

    updateProducts = async ({ _id: pid }, productReplace) => {
        try {
            let result = await productsModel.updateOne({ _id: pid }, productReplace);
            this.logger.info(`Product with ID ${pid} updated successfully.`);
            return result;
        } catch (error) {
            this.logger.error(`Error while updating product with ID ${pid}: ${error.message}`);
            return null;
        }
    }

    deleteProducts = async ({ _id: pid }) => {
        try {
            let result = await productsModel.deleteOne({ _id: pid });
            this.logger.info(`Product with ID ${pid} deleted successfully.`);
            return result;
        } catch (error) {
            this.logger.error(`Error while deleting product with ID ${pid}: ${error.message}`);
            return null;
        }
    }

    getAllProducts = async () => {
        try {
            const allProducts = await productsModel.find();
            this.logger.info('All products successfully retrieved.');
            return allProducts;
        } catch (error) {
            this.logger.error(`Error while fetching all products: ${error.message}`);
            return null;
        }
    }

    getPremiumProductsForUser = async (email) => {
        try {
            this.logger.info(`Fetching premium products for user with email: ${email}`);
            let premiumProducts = await productsModel.find({ owner: email });
            this.logger.info('Premium products successfully retrieved for the user.');
            return premiumProducts;
        } catch (error) {
            this.logger.error(`Error while fetching premium products for the user: ${error.message}`);
            return null;
        }
    }
    
    

}


