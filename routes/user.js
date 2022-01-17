const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const express = require("express");
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

router.post('/login', async (req, res) => {
    if(!req.body.email || !req.body.password) {
        res.status(200).json({
            message: "Invalid email or password"
        });
    } else {
        const user = await global.prismaClient.user.findUnique({
            where: {
                email: req.body.email
            }
        });
        if(!user) {
            res.json({
                message: "No user exists with this email"
            });
        } else {
            const isCorrectPass = await global.bcrypt.compare(req.body.password, user.password);

            if(!isCorrectPass){
                res.json({
                    message: "Password is incorrect"
                });
            } else {
                const token = jwt.sign({ email: user.email }, process.env.SECRET_KEY);

                res.status(200).json({
                    message: "Login successfull",
                    email: user.email,
                    token: token
                });
            }
        }

    }
});

module.exports = router;