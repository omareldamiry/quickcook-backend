const { PrismaClient } = require("@prisma/client");
const bodyParser = require("body-parser");
const prisma = new PrismaClient();
const express = require("express");
const router = express.Router();
const bcrypt = require('bcrypt');

router.use(bodyParser.json());

router.get('/signup', async (req, res) => {

    if (!req.body.email || !req.body.password || !req.body.name) {
        res.json({
            message: "Invalid Data",
        });
    }

    else {
        try {
            bcrypt.hash(req.body.password, 10, async (err, hashed) => {
                if (err) throw err;

                await prisma.user.create({
                    data: {
                        email: req.body.email,
                        password: hashed,
                        name: req.body.name,
                    }
                });
            });
        } catch (err) {
            res.json({
                message: "Error has occured",
                Error: err
            });
        };

        res.json({
            message: `${req.body.name} signed up!`,
            content: req.body.email,
        })
    }
});

module.exports = router;