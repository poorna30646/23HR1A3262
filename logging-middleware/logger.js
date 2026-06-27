const axios = require("axios");
require("dotenv").config();

const VALID_STACKS = ["backend", "frontend"];

const VALID_LEVELS = [
    "debug",
    "info",
    "warn",
    "error",
    "fatal"
];

const VALID_PACKAGES = {
    backend: [
        "cache",
        "controller",
        "cron_job",
        "db",
        "domain",
        "handler",
        "repository",
        "route",
        "service",
        "auth",
        "config",
        "middleware",
        "utils"
    ],
    frontend: [
        "api",
        "component",
        "hook",
        "page",
        "state",
        "style",
        "auth",
        "config",
        "middleware",
        "utils"
    ]
};

async function Log(stack, level, packageName, message) {

    if (!VALID_STACKS.includes(stack))
        throw new Error("Invalid stack");

    if (!VALID_LEVELS.includes(level))
        throw new Error("Invalid level");

    if (!VALID_PACKAGES[stack].includes(packageName))
        throw new Error("Invalid package");

    try {

        console.log("=================================");
        console.log("ACCESS TOKEN:");
        console.log(process.env.ACCESS_TOKEN);
        console.log("TOKEN LENGTH:", process.env.ACCESS_TOKEN?.length);
        console.log("=================================");

        const response = await axios.post(
            "http://4.224.186.213/evaluation-service/logs",
            {
                stack,
                level,
                package: packageName,
                message
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
                    "Content-Type": "application/json"
                }
            }
        );

        console.log("LOG SUCCESS:");
        console.log(response.data);

        return response.data;

    } catch (err) {

        console.error("=================================");
        console.error("LOGGING FAILED");
        console.error("TOKEN:", process.env.ACCESS_TOKEN);
        console.error("TOKEN LENGTH:", process.env.ACCESS_TOKEN?.length);
        console.error("ERROR:", err.response?.data || err.message);
        console.error("=================================");

        throw err;

    }

}

module.exports = Log;