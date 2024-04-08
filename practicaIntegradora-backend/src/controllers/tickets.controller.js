import Tickets from "../dao/classes/tickets.dao.js";
import Carts from "../dao/classes/carts.dao.js";
import { generateRandomString } from "../utils.js";

const ticketsService = new Tickets();
const cartsService = new Carts()

export const generateTicket = async (req, res) => {
    try {
        const userPurchaser = req.user.email;

        const user = req.user;
        const userCartId = user.carts[0];
        const userCart = await cartsService.getCartsById({ _id: userCartId });

        let totalAmount = 0;
        userCart.products.forEach(product => {
            totalAmount += product.product.price * product.quantity;
        });

        const result = await ticketsService.generateTicket(
            generateRandomString(16),
            new Date(),
            totalAmount,
            userPurchaser
        );

        if (!result) return res.status(404).send("Cannot generate ticket");

        for (const productInfo of userCart.products) {
            const productId = productInfo.product;
            const quantityInCart = productInfo.quantity;

            await cartsService.deleteProductInCarts(userCartId, productId);
        }

        const ticketId = result._id;
        res.send({ status: "Success", ticketId });

    } catch (error) {
        console.error(error);
        res.status(500).send("Server error: " + error.message);
    }
};


export const getTicketById = async (req, res) => {
    try {
        const ticketId = req.params.id;
        const ticket = await ticketsService.getTicketById(ticketId);

        if (!ticket) {
            return res.status(404).send("Ticket not found");
        }

        res.render("ticket", {
            style: "index.css",
            ticket: ticket
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("Server error: " + error.message);
    }
};
