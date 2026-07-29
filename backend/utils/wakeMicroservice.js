const axios = require("axios");

const FASTAPI_URL =
    process.env.FASTAPI_SERVICE_URL || "http://localhost:8000";

async function wakeMicroservice() {
    console.log("Checking ML microservice...");

    const maxAttempts = 10;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
            await axios.get(FASTAPI_URL, {
                timeout: 10000,
            });

            console.log("ML microservice is awake.");
            return true;
        } catch (err) {
        console.log("Wake error:", err.code);
        console.log("Message:", err.message);

        if (err.response) {
            console.log("Status:", err.response.status);
            console.log("Headers:", err.response.headers);
            console.log("Body:", err.response.data);
        }

        throw err;}
    }

    throw new Error("Unable to wake ML microservice.");
}

module.exports = { wakeMicroservice };