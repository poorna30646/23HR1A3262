const axios = require("axios");
const { Log } = require("../../logging-middleware");

const API_URL =
    "http://4.224.186.213/evaluation-service/notifications";

const TOKEN = process.env.ACCESS_TOKEN;

exports.fetchNotifications = async (query) => {

    try {

        await Log(
            "backend",
            "info",
            "service",
            "Calling Notification API"
        );

        const response = await axios.get(API_URL, {
            headers: {
                Authorization: `Bearer ${TOKEN}`
            },
            params: {
                limit: query.limit,
                page: query.page,
                notification_type: query.notification_type
            }
        });

        await Log(
            "backend",
            "info",
            "service",
            "Notification API Success"
        );

        return response.data;

    } catch (err) {

        await Log(
            "backend",
            "error",
            "service",
            err.response?.data?.message || err.message
        );

        throw new Error(
            err.response?.data?.message || "Unable to fetch notifications"
        );

    }

};

exports.fetchPriorityNotifications = async () => {

    try {

        await Log(
            "backend",
            "info",
            "service",
            "Fetching Priority Notifications"
        );

        const response = await axios.get(API_URL, {
            headers: {
                Authorization: `Bearer ${TOKEN}`
            }
        });

        const notifications = response.data.notifications || [];

        const priority = notifications
            .sort((a, b) => {

                const weight = {
                    Placement: 3,
                    Result: 2,
                    Event: 1
                };

                if (weight[b.Type] !== weight[a.Type]) {
                    return weight[b.Type] - weight[a.Type];
                }

                return new Date(b.Timestamp) - new Date(a.Timestamp);

            })
            .slice(0, 10);

        await Log(
            "backend",
            "info",
            "service",
            "Priority Notifications Ready"
        );

        return priority;

    } catch (err) {

        await Log(
            "backend",
            "error",
            "service",
            err.response?.data?.message || err.message
        );

        throw new Error(
            err.response?.data?.message || "Unable to fetch priority notifications"
        );

    }

};