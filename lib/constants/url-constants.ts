export const APP_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : "https://milindmishra.com"

export const RPC_URL = `${APP_URL}/rpc`
