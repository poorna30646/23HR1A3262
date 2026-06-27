import axios from "axios";

const API = axios.create({
    baseURL: "http://localhost:5000/api"
});

export async function fetchNotifications(
    page = 1,
    limit = 10,
    type = "All"
) {

    const params = {
        page,
        limit
    };

    if (type !== "All") {
        params.notification_type = type;
    }

    const response = await API.get("/notifications", {
        params
    });

    return response.data.data;

}

export async function fetchPriorityNotifications() {

    const response = await API.get("/notifications/priority");

    return response.data.data;

}