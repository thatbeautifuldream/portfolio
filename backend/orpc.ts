import { os } from "@orpc/server";
import { requiredAuthMiddleware } from "@/backend/middleware/auth";

export const authed = os.use(requiredAuthMiddleware);