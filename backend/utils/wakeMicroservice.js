const FASTAPI_URL =
    process.env.FASTAPI_SERVICE_URL || "http://localhost:8000";

async function wakeMicroservice() {
    console.log("Checking ML microservice...");

    const maxAttempts = 30;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
            const response = await fetch(FASTAPI_URL, {
                method: "GET",
                headers: {
                    "User-Agent": "MLSandbox-Backend-Wakeup",
                    "Accept": "application/json"
                }
            });

            if (response.ok) {
                console.log("ML microservice is awake.");
                return true;
            }

            console.log(
                `Attempt ${attempt}/${maxAttempts}: HTTP ${response.status}`
            );
        } catch (err) {
            console.log(
                `Attempt ${attempt}/${maxAttempts}: ${err.message}`
            );
        }

        // Wait 3 seconds before retrying.
        await new Promise(resolve => setTimeout(resolve, 3000));
    }

    throw new Error("Unable to wake ML microservice.");
}

module.exports = { wakeMicroservice };