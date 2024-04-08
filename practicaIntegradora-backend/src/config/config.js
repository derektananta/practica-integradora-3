import dotenv from "dotenv"

dotenv.config()

export default {
    MongoURL: process.env.MongoURL,
    PORT: process.env.PORT,
    MongoSecret: process.env.MongoSecret,
    GithubClientId: process.env.GithubClientId,
    GithubClientSecret: process.env.GithubClientSecret,
    ENV: process.env.ENV,
    MAIL_PASS: process.env.MAIL_PASS,
    MAIL_USER: process.env.MAIL_USER,
    JWT_KEY: process.env.JWT_KEY
}