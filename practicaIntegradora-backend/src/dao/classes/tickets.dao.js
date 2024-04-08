import { ticketsModel } from "../models/tickets.model.js";
import { logger } from "../../middlewares/logger/logger.middleware.js";

export default class Tickets {
    constructor() {
        this.logger = logger;
    }

    generateTicket = async (code, purchase_datetime, amount, purchaser) => {
        try {
            let result = await ticketsModel.create({
                code,
                purchase_datetime,
                amount,
                purchaser,
            });
            this.logger.info(`Ticket generated with code ${code}`);
            return result;
        } catch (error) {
            this.logger.error(`Error while generating ticket with code ${code}: ${error.message}`);
            return null;
        }
    };

    getTicketById = async (ticketId) => {
        try {
            const result = await ticketsModel.findById(ticketId);
            if (result) {
                this.logger.info(`Ticket with ID ${ticketId} retrieved successfully.`);
            } else {
                this.logger.warn(`Ticket with ID ${ticketId} not found.`);
            }
            return result;
        } catch (error) {
            this.logger.error(`Error while fetching ticket with ID ${ticketId}: ${error.message}`);
            return null;
        }
    };
}
