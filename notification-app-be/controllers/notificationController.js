const {
    fetchNotifications,
    fetchPriorityNotifications
} = require("../services/notificationService");

const { Log } = require("../../logging-middleware");

exports.getNotifications = async (req, res) => {

    try {

        await Log(
            "backend",
            "info",
            "controller",
            "Fetching notifications"
        );

        const data = await fetchNotifications(req.query);

        await Log(
            "backend",
            "info",
            "controller",
            "Notifications fetched successfully"
        );

        return res.status(200).json({
            success: true,
            data
        });

    } catch (err) {

        await Log(
            "backend",
            "error",
            "controller",
            err.message
        );

        return res.status(500).json({
            success: false,
            message: err.message
        });

    }

};

exports.getPriorityNotifications = async (req, res) => {

    try {

        await Log(
            "backend",
            "info",
            "controller",
            "Fetching priority notifications"
        );

        const data = await fetchPriorityNotifications();

        await Log(
            "backend",
            "info",
            "controller",
            "Priority notifications fetched successfully"
        );

        return res.status(200).json({
            success: true,
            data
        });

    } catch (err) {

        await Log(
            "backend",
            "error",
            "controller",
            err.message
        );

        return res.status(500).json({
            success: false,
            message: err.message
        });

    }

};