const express = require("express");
const router = express.Router();
const APIResponse = require("../models/apiresponse");
const authenticate = require("../utilities/authenticate");

router.use(express.json());

router.post('/signup', async (req, res) => {
    
    if (!req.body.email || !req.body.password || !req.body.name) {
        let apiResponse = new APIResponse(0, "Invalid Data");
        res.json(apiResponse);
    }
    else {

        const hashed = await global.bcrypt.hash(req.body.password, 10);
        await global.prismaClient.user.create({
            data: {
                email: req.body.email,
                password: hashed,
                name: req.body.name,
            }
        });
        let apiResponse = new APIResponse(0, `${req.body.name} signed up!`, req.body.email);
        res.json(apiResponse);

    }
});

router.post('/login', async (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;

    let auth;

    if (!email || !password) {
        let apiResponse = new APIResponse(1, "Invalid email or password");
        res.json(apiResponse);
    } else {

        auth = await global.prismaClient.user.findUnique({
            where: {
                email: req.body.email
            }
        });

    }

    await authenticate(auth, password, res);
});

module.exports = router;