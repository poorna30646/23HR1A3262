const express = require("express");

const router = express.Router();

const {
    getNotifications,
    getPriorityNotifications
} = require("../controllers/notificationController");

router.get("/", getNotifications);

router.get("/priority", getPriorityNotifications);

module.exports = router;