const jwt = require("jsonwebtoken");

const authenticate = async (auth, password, res) => {
    if (!auth) {
        res.json({
            message: "No user exists with this email"
        });
    } else {
        const isCorrectPass = await global.bcrypt.compare(password, auth.password);

        if (!isCorrectPass) {
            res.json({
                message: "Password is incorrect"
            });
        } else {
            const token = jwt.sign({ email: auth.email || auth.username }, process.env.SECRET_KEY);

            res.status(200).json({
                message: "Login successfull",
                email: auth.email || auth.username,
                token: token
            });
        }
    }
};

module.exports = async (req, res, next, mode) => {
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;

    let auth;

    if (mode == "user") {

        if (!email || !password) {
            res.status(200).json({
                message: "Invalid email or password"
            });
        } else {

            auth = await global.prismaClient.user.findUnique({
                where: {
                    email: req.body.email
                }
            });

        }

    } else if (mode == "admin") {

        if (!username || !password) {
            res.status(200).json({
                message: "Invalid username or password"
            });
        } else {
            auth = await global.prismaClient.admin.findUnique({
                where: {
                    username: req.body.username
                }
            });
        }

    }
    authenticate(auth, password, res);

}
