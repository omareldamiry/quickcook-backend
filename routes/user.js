const bodyParser = require("body-parser");
const express = require("express");
const login = require("../util/login");
const router = express.Router();

router.use(bodyParser.json());

router.post('/signup', async (req, res) => {

    if (!req.body.email || !req.body.password || !req.body.name) {
        res.json({
            message: "Invalid Data",
        });
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

        res.json({
            message: `${req.body.name} signed up!`,
            content: req.body.email,
        });

    }
});

router.post('/login', async (req, res, next) => {
    await login(req, res, next, "user");
});

module.exports = router;