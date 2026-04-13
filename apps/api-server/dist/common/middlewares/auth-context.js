"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authContext = authContext;
function authContext(req, _res, next) {
    req.user = {
        id: "11111111-1111-1111-1111-111111111111",
        company_id: "22222222-2222-2222-2222-222222222222",
    };
    next();
}
//# sourceMappingURL=auth-context.js.map