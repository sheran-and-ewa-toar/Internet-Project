const axios = require("axios");

const FASTAPI_URL =
    process.env.FASTAPI_SERVICE_URL || "http://localhost:8000";

async function wakeMicroservice() {
    console.log("Checking ML microservice...");

    const maxAttempts = 10;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
            await axios.get(`${FASTAPI_URL}/health`, {
                timeout: 10000,
            });

            console.log("ML microservice is awake.");
            return true;
        } catch (err) {
            console.log(`Microservice not ready at ${FASTAPI_URL} (${attempt}/${maxAttempts})...`);
            await new Promise(resolve => setTimeout(resolve, 3000));
        }
    }

    throw new Error("Unable to wake ML microservice.");
}

module.exports = { wakeMicroservice };