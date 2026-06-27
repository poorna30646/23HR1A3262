import { useEffect, useState } from "react";
import { fetchNotifications } from "../api/notifications";

export function useNotifications(page, filter) {

    const [notifications, setNotifications] = useState([]);
    const [total, setTotal] = useState(0);
    const [totalPages, setTotalPages] = useState(1);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {

        const loadNotifications = async () => {

            try {

                setLoading(true);
                setError(null);

                const data = await fetchNotifications(
    page,
    filter
);

                const notificationList =
                    data.notifications || [];

                setNotifications(notificationList);

                const totalNotifications =
                    data.total ||
                    notificationList.length;

                setTotal(totalNotifications);

                setTotalPages(
    notificationList.length === 10
        ? page + 1
        : page
);

            } catch (err) {

                setError(err.message);

            } finally {

                setLoading(false);

            }

        };

        loadNotifications();

    }, [page, filter]);

    return {
        notifications,
        total,
        totalPages,
        loading,
        error
    };

}