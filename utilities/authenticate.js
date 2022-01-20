const jwt = require("jsonwebtoken");

module.exports = async (auth, password, res) => {
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