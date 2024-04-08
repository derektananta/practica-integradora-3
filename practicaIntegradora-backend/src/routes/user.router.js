import { Router } from "express";
import { userModel } from "../dao/models/user.model.js";
import { createHash } from "../utils.js";
import passport from "passport";
import { getUserCartId, getUserCart } from "../controllers/carts.controller.js";
import config from "../config/config.js";
import {transporter, generateToken} from "../services/mail/mailing.js";
const {MAIL_USER} = config


export const router = Router()

router.post('/register', passport.authenticate('register', {
    failureRedirect: '/failregister'
}), async (req, res) => {
    res.send({ status: "success", message: "User registered" });
})

router.get('/failregister', async (req, res) => {
    res.send({ error: 'failed' })
})

router.post('/login', passport.authenticate('login', {}), async (req, res) => {
    if (!req.user) {
        return res.status(400).json({ status: 'error', error: 'Incomplete Values' });
    }

    req.session.user = {
        name: req.user.first_name + " " + req.user.last_name,
        age: req.user.age,
        email: req.user.email,
        rol: req.user.rol
    };

    res.json({ status: 'success', payload: req.user });
});


router.get("/github", passport.authenticate("github", { scope: ["user:email"] }), async (req, res) => { })
router.get("/githubcallback", passport.authenticate("github", { failureRedirect: "/login" }), async (req, res) => {
    req.session.user = {
        name: req.user.first_name + req.user.last_name,
        age: req.user.age,
        email: req.user.email,
        rol: req.user.rol
    }
    res.redirect("/profile")
})


router.post("/logout", (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.json({ status: "Logout ERROR", body: err })
        }
        res.send("Logout Ok")
    })
})

router.post('/restartPassword', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).send({ status: "error", error: "Incomplete Values" });
    const user = await userModel.findOne({ email });
    if (!user) return res.status(404).send({ status: "error", error: "Not user found" });
    const newHashedPassword = createHash(password);
    await userModel.updateOne({ _id: user._id }, { $set: { password: newHashedPassword } });
    res.send({ status: "success", message: "Password restarter successfully" });
})

router.get('/checkUserByEmail', async (req, res) => {
    const { email } = req.query;
    const user = await userModel.findOne({ email });

    if (user) {
        res.json({ status: 'success', user });
    } else {
        res.status(404).json({ status: 'error', error: 'User not found' });
    }
});

router.post('/restartPassword', async (req, res) => {
    const { email, password } = req.body;
    
    if (!email || !password) {
        return res.status(400).send({ status: 'error', error: 'Incomplete values' });
    }

    const user = await userModel.findOne({ email });
    if (!user) {
        return res.status(404).send({ status: 'error', error: 'User not found' });
    }

    const newHashedPassword = createHash(password);
    await userModel.updateOne({ _id: user._id }, { $set: { password: newHashedPassword } });

    res.send({ status: 'success', message: 'Password restarter successfully' });
});


router.get("/restartMailPassword", (req, res) => {
    const { email } = req.query;

    if (!email) {
        return res.status(400).json({ status: 'error', message: 'Email address not provided.' });
    }

    const token = generateToken(email);

    const mailOptions = {
        from: MAIL_USER,
        to: email,
        subject: 'Password recovery',
        text: `Click the following link to reset your password: http://localhost:8080/restartPassword/${token}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ status: 'error', message: 'Error to send email.' });
        }
        console.log('Email sent: ' + info.response);
        res.json({ status: 'success', message: 'Email sended succefully.' });
    });
});

router.get("/cartId", getUserCartId)
router.get("/myCart", getUserCart)

router.post("/premium/:uid", async (req, res) => {
    try {
        const userId = req.params.uid;
        const user = await userModel.findById(userId);

        if (!user) {
            return res.status(404).json({ status: 'error', message: 'User not found' });
        }

        user.rol = user.rol === 'user' ? 'premium' : 'user';

        await user.save();

        res.json({ status: 'success', message: 'User rol updated successfully', user });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ status: 'error', message: 'Server error' });
    }
});
