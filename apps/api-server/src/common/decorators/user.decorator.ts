// In Express, decorators are less common for params than in NestJS.
// We usually just use req.user directly or a helper function.
// But we can create a simple helper to be used inside controllers if we wanted to mimic the style.

import { Request } from 'express';

export const CurrentUser = (req: Request) => {
    return (req as any).user;
};
