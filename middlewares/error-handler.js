const APIResponse = require("../models/apiresponse");

module.exports = (err, req, res, next) => {
 
    console.log(`Custom Try Catch : ${err.message}`);
    let apiResponse = new APIResponse(1, "Error", err);
    res.status(500).json(apiResponse);
  
};