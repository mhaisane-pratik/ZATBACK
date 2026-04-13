"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GlobalExceptionFilter = exports.HttpException = void 0;
class HttpException extends Error {
    constructor(message, statusCode) {
        super(message);
        this.message = message;
        this.statusCode = statusCode;
        this.name = 'HttpException';
    }
}
exports.HttpException = HttpException;
const GlobalExceptionFilter = (err, req, res, next) => {
    console.error('[GlobalExceptionFilter]', err);
    if (err instanceof HttpException) {
        return res.status(err.statusCode).json({
            success: false,
            message: err.message,
            statusCode: err.statusCode,
        });
    }
    return res.status(500).json({
        success: false,
        message: 'Internal Server Error',
        statusCode: 500,
    });
};
exports.GlobalExceptionFilter = GlobalExceptionFilter;
//# sourceMappingURL=http-exception.filter.js.map