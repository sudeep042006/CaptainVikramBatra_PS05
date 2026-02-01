export const logger = {
    info: (msg, meta = {}) => {
        console.log(`[INFO] ${new Date().toISOString()} - ${msg}`, meta);
    },
    error: (msg, error) => {
        console.error(`[ERROR] ${new Date().toISOString()} - ${msg}`, error);
    },
    debug: (msg, meta = {}) => {
        if (process.env.NODE_ENV === 'development') {
            console.log(`[DEBUG] ${msg}`, meta);
        }
    }
};
