import { os } from "@orpc/server";
import { requiredAuthMiddleware } from "@/middlewares/auth";

export const authed = os.use(requiredAuthMiddleware);