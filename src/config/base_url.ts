

const env = process.env.NODE_ENV
export const baseApiUrl = env == "development" ? "https://localhost:7026" : "https://travel-planner-api.melanievandegraaf.nl";