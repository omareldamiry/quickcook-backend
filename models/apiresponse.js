module.exports = class APIResponse {

    constructor(code, message, data) {
        this.code = code;
        this.message = message;
        this.data = data;
    }

    code;
    message;
    data;
}