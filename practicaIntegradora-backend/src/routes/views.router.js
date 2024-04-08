import { Router } from "express";
import { getProducts, getAllProducts, getPremiumProductsForUser } from "../controllers/products.controller.js";
import { getCartsById } from "../controllers/carts.controller.js"
import { checkRole } from "../middlewares/checkRole.js"
import UserDTO from "../dto/user.dto.js";
import Carts from "../dao/classes/carts.dao.js"
import Tickets from "../dao/classes/tickets.dao.js";
import { getTicketById } from "../controllers/tickets.controller.js";

import { verifyToken } from "../services/mail/mailing.js";

const cartsService = new Carts()

export const router = Router()

router.get("/products", async (req, res) => {
    const productsData = await getProducts(req, res);

    res.render("products", {
        style: "index.css",
        products: productsData.payload.docs,
        prevLink: productsData.prevLink,
        nextLink: productsData.nextLink,
    });
});

router.get("/carts/:cid", checkRole(['premium']), async (req, res) => {
    const cartData = await getCartsById(req, res);

    res.render("carts", {
        style: "index.css",
        cart: cartData.payload
    });
});

router.get("/current", checkRole(['user', "admin"]), (req, res) => {
    const userDTO = new UserDTO(req.session.user)
    res.render("profile", {
        style: "index.css",
        user: userDTO
    })
})

router.get("/register", (req, res) => {
    res.render("register", {
        style: "index.css",
        user: req.session.user
    })
})

router.get("/login", (req, res) => {
    res.render("login", {
        style: "index.css",
        user: req.session.user
    })
})

router.get("/restartMailPassword", (req, res) => {
    res.render("restartMailPassword", {
        style: "index.css",
    })
});

router.get(`/restartPassword/:token`, (req, res) => {
    const { token } = req.params;
    const userEmail = verifyToken(token);

    if (userEmail) {
        res.render('restartPassword', {
            userEmail, token,
            style: "index.css",
            user: req.session.user
        })
    } else {
        if (res.status(400)) {
            res.render("invalidToken", { style: "index.css" })
        }

    }
});

router.get("/admin", checkRole(['admin', 'premium']), async (req, res) => {
    try {
        const user = req.user;
        const productsData = await getAllProducts(req, res);
        const productsPremiumData = await getPremiumProductsForUser(req, res);
        const userDTO = new UserDTO(req.session.user);
        const isPremium = user.rol === 'premium';
        const isAdmin = user.rol === 'admin';

        res.render("admin", { style: "index.css", user: userDTO, isPremium, isAdmin, products: productsData.payload, premiumProducts: productsPremiumData.payload });
    } catch (err) {
        res.status(500).send("Server error: " + err);
    }
});


router.get("/myCart", checkRole(['user', "premium"]), async (req, res) => {
    try {
        const user = req.user;
        const userCartId = user.carts[0];

        if (!userCartId) {
            return res.status(404).send("User does not have a cart.");
        }

        const userCart = await cartsService.getCartsById({ _id: userCartId });

        if (!userCart || !userCart.products) {
            return res.status(404).send("User cart not found or has no products.");
        }

        let totalAmount = 0;
        
        if (userCart.products.length > 0) {
            userCart.products.forEach(product => {
                totalAmount += product.product.price * product.quantity;
            });
        }

        res.render('cart', { style: "index.css", userCart, totalAmount });
    } catch (err) {
        console.error('Error:', err);
        res.status(500).send("Server error");
    }
});


router.get('/tickets/:id', getTicketById)

router.get("/chat", checkRole(['user']), (req, res) => {
    res.render("chat", {
        style: "index.css"
    })
})

// router.get('/restartPassword', (req, res) => {
//     res.render('restartPassword', {
//         style: "index.css",
//         user: req.session.user
//     })
// })

