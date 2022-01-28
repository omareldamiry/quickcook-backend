const jwt = require('jsonwebtoken');
const APIResponse = require('../models/apiresponse')

module.exports = (req, res, next) => {
    if (req.body.token) {
        const token = req.body.token;
        const decoded = jwt.verify(token, process.env.SECRET_KEY);

        const tokenCurrentAge = Number.parseInt(Date.now() / 1000) - decoded.iat;
        const tokenMaxAge = decoded.exp - decoded.iat;

        console.log();

        if (tokenCurrentAge >= tokenMaxAge) {
            let apiResponse = new APIResponse(1, "Unauthenticated");
            res.json(apiResponse);
        } else {
            next();
        }

    } else {
        let apiResponse = new APIResponse(1, "Unauthenticated");
        res.json(apiResponse);
    }
}