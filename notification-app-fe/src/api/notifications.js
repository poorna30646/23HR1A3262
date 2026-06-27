import axios from "axios";

const API = axios.create({
    baseURL: "http://localhost:5000/api"
});

export async function fetchNotifications(
    page = 1,
    filter = "All",
    limit = 10
) {

    const params = {
        page,
        limit
    };

    if (filter !== "All") {
        params.notification_type = filter;
    }

    const response = await API.get("/notifications", {
        params
    });

    return response.data.data;

}

export async function fetchPriorityNotifications() {

    const response = await API.get(
        "/notifications/priority"
    );

    return response.data.data;

}