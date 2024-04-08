import passport from 'passport'
import local from 'passport-local'
import GitHubStrategy from "passport-github2"
import UserDTO from '../dto/user.dto.js';
import { userModel } from "../dao/models/user.model.js";
import { createHash, isValidPassword } from "../utils.js";
import config from "../config/config.js"
import Carts from '../dao/classes/carts.dao.js';

const cartsService = new Carts()

const LocalStrategy = local.Strategy;

const { GithubClientId, GithubClientSecret } = config

export const initializedPassport = () => {

    passport.use('register', new LocalStrategy({ passReqToCallback: true, usernameField: 'email' },
        async (req, username, password, done) => {
            const { first_name, last_name, email, age } = req.body;
            try {
                const user = await userModel.findOne({ email: username });
                if (user) {
                    req.logger.error("user already exists")
                    return done(null, false)
                }
                const newUserDTO = new UserDTO({
                    first_name,
                    last_name,
                    email,
                    age
                });

                const newUser = {
                    fullName: newUserDTO.fullName,
                    first_name: newUserDTO.first_name,
                    last_name: newUserDTO.last_name,
                    email: newUserDTO.email,
                    age: newUserDTO.age,
                    password: createHash(password)
                }
                let result = await userModel.create(newUser);

                const newCart = await cartsService.createCarts({ products: [] });
                result.carts.push(newCart._id);
                await result.save();
                return done(null, result)
            } catch (error) {
                return done('User Not fount' + error)
            }
        }
    ))

    passport.use('login', new LocalStrategy({ passReqToCallback: true, usernameField: 'email' },
        async (req, email, password, done) => {

            try {
                const user = await userModel.findOne({ email: email });
                req.logger.info(' User login ' + user)
                if (!user) {
                    return done(null, false)
                }

                if (!isValidPassword(user, password)) {
                    return done(null, false)
                }

                return done(null, user)
            } catch (error) {
                return done(null, false)
            }
        }
    ))

    passport.use('github', new GitHubStrategy({
        clientID: GithubClientId,
        clientSecret: GithubClientSecret,
        callbackURL: "http://localhost:8080/api/sessions/githubcallback",
    }, async (req, accesToken, refreshToken, profile, done) => {
        try {
            req.logger.info(profile);
            let user = await userModel.findOne({ email: profile._json.email })
            if (!user) {
                const newUserDTO = new UserDTO({
                    first_name: profile._json.name,
                    last_name: "",
                    email: profile._json.email,
                    age: 18,
                    password: ""
                });

                let newUser = {
                    fullName: newUserDTO.fullName,
                    first_name: newUserDTO.first_name,
                    last_name: newUserDTO.last_name,
                    email: newUserDTO.email,
                    age: newUserDTO.age,
                    password: ""
                }

                let result = await userModel.create(newUser)
                done(null, result)
            }
            else {
                done(null, user)
            }
        } catch (err) {
            return done(err)
        }
    }))

    passport.serializeUser((user, done) => {
        done(null, user.id)
    })

    passport.deserializeUser(async (id, done) => {
        let user = await userModel.findById(id)
        done(null, user)
    })
}