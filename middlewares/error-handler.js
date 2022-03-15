const { PrismaClientKnownRequestError } = require("@prisma/client/runtime");
const APIResponse = require("../models/apiresponse");

module.exports = (err, req, res, next) => {
    if (err instanceof PrismaClientKnownRequestError) {
        if (err.code == 'P2002') {
            let apiResponse = new APIResponse(1, "Email is used");
            res.json(apiResponse);
        }
    } else {
        console.log(`Unhandled Error: ${err}`);
        let apiResponse = new APIResponse(1, "Error", err);
        res.status(500).json(apiResponse);
    }


};