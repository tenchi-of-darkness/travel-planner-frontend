

const env = process.env.NODE_ENV
const baseUrl = env == "development" ? "https://localhost:7026/" : "https://travel-planner-api.melanievandegraaf.nl"
if(env == "development"){
    // do something
}
else if (env == "production"){
    // do something
}