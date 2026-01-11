const isDev = process.env.NODE_ENV !== "production";

const logger = {
  log: (msg: any, ...optionalParams: any[]) => {
    if (isDev) console.log("[LOG]:", msg, ...optionalParams);
  },
  warn: (msg: any, ...optionalParams: any[]) => {
    if (isDev) console.warn("[WARN]:", msg, ...optionalParams);
  },
  error: (msg: any, ...optionalParams: any[]) => {
    if (isDev) console.error("[ERROR]:", msg, ...optionalParams);
  },
  debug: (msg: any, ...optionalParams: any[]) => {
    if (isDev) console.debug("[DEBUG]:", msg, ...optionalParams);
  },
};

export default logger;
