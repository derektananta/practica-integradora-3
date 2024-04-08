import EErrors from "../../services/error/enums.js";

export default (error, req, res, next) => {
    console.error(error.cause);

    switch (error.code) {
        case EErrors.ROUTING_ERROR:
            res.status(404).send({ status: "error", error: "Resource not found" });
            break;
        case EErrors.INVALID_TYPES_ERROR:
            res.status(400).send({ status: "error", error: error.name });
            break;
        case EErrors.DATABASE_ERROR:
            res.status(500).send({ status: "error", error: "Database error" });
            break;
        case EErrors.AUTHENTICATION_ERROR:
            res.status(401).send({ status: "error", error: "Authentication error" });
            break;
        case EErrors.VALIDATION_ERROR:
            res.status(422).send({ status: "error", error: "Validation error" });
            break;
        case EErrors.NOT_FOUND_ERROR:
            res.status(404).send({ status: "error", error: "Resource not found" });
            break;
        case EErrors.FILE_UPLOAD_ERROR:
            res.status(400).send({ status: "error", error: "File upload error" });
            break;
        case EErrors.EXTERNAL_API_ERROR:
            res.status(500).send({ status: "error", error: "External API error" });
            break;
        default:
            res.status(500).send({ status: "error", error: "Unhandled error" });
    }
}
