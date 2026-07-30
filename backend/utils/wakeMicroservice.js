const http = require("http");
const https = require("https");
const { URL } = require("url");

const FASTAPI_URL =
    process.env.FASTAPI_SERVICE_URL || "http://localhost:8000";

const ATTEMPT_TIMEOUT_MS = 20000;

const MAX_TOTAL_WAIT_MS = 120000;

const RETRY_DELAY_MS = 3000;

function pingOnce(targetUrl, timeoutMs) {
    return new Promise((resolve, reject) => {
        const parsed = new URL(targetUrl);
        const client = parsed.protocol === "https:" ? https : http;

        const req = client.request(
            {
                hostname: parsed.hostname,
                port: parsed.port || (parsed.protocol === "https:" ? 443 : 80),
                path: parsed.pathname + parsed.search,
                method: "GET",
                agent: false,
                headers: {
                    "User-Agent": "MLSandbox-Backend-Wakeup",
                    "Accept": "application/json",
                    "Connection": "close"
                }
            },
            (res) => {
                res.resume();
                resolve(res.statusCode);
            }
        );

        req.setTimeout(timeoutMs, () => {
            req.destroy(new Error(`Request timed out after ${timeoutMs}ms`));
        });

        req.on("error", (err) => {
            reject(err);
        });

        req.end();
    });
}

async function wakeMicroservice() {
    console.log(`Checking ML microservice at ${FASTAPI_URL} ...`);

    const startedAt = Date.now();
    let attempt = 0;

    while (Date.now() - startedAt < MAX_TOTAL_WAIT_MS) {
        attempt += 1;

        try {
            const status = await pingOnce(FASTAPI_URL, ATTEMPT_TIMEOUT_MS);

            if (status >= 200 && status < 300) {
                console.log(`ML microservice is awake (attempt ${attempt}, HTTP ${status}).`);
                return true;
            }

            console.log(`Attempt ${attempt}: HTTP ${status}`);
        } catch (err) {
            console.log(`Attempt ${attempt}: ${err.message}`);
        }

        await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS));
    }

    throw new Error(
        `Unable to wake ML microservice after ${attempt} attempts (${Math.round(
            (Date.now() - startedAt) / 1000
        )}s).`
    );
}

module.exports = { wakeMicroservice };