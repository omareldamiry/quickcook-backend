const jwt = require("jsonwebtoken");
const APIResponse = require("../models/apiresponse");

module.exports = async (auth, password, res) => {
    if (!auth) {
        let apiResponse = new APIResponse(1, "No user exists with this email");
        res.json(apiResponse);
    } else {
        const isCorrectPass = await global.bcrypt.compare(password, auth.password);

        if (!isCorrectPass) {
            let apiResponse = new APIResponse(1, "Password is incorrect");
            res.json(apiResponse);
        } else {
            const token = jwt.sign({ email: auth.email || auth.username }, process.env.SECRET_KEY);

            let apiResponse = new APIResponse(0, "Login successfull", token);
            res.status(200).json(apiResponse);
        }
    }
};