"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.supabaseAuth = void 0;
const supabase_js_1 = require("@supabase/supabase-js");
const supabase = (0, supabase_js_1.createClient)(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
const supabaseAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ message: 'Missing Authorization header' });
        }
        const token = authHeader.replace('Bearer ', '');
        const { data, error } = await supabase.auth.getUser(token);
        if (error || !data.user) {
            return res.status(401).json({ message: 'Invalid or expired token' });
        }
        req.user = {
            id: data.user.id,
            email: data.user.email ?? undefined,
        };
        next();
    }
    catch (err) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
};
exports.supabaseAuth = supabaseAuth;
//# sourceMappingURL=supabase-auth.middleware.js.map