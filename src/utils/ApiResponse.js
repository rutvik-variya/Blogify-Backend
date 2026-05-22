class ApiResponse {
    constructor(statusCode, message, data = {}) {
        this.success = true;
        this.statusCode = statusCode;
        this.message = message;
        Object.assign(this, data);
    }
}

module.exports = ApiResponse;

