"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoggerMiddleware = void 0;
const LoggerMiddleware = (req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
};
exports.LoggerMiddleware = LoggerMiddleware;
//# sourceMappingURL=logger.middleware.js.map