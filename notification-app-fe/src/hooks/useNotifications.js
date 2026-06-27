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
                    10,
                    filter
                );

                setNotifications(data.notifications || []);

                setTotal(data.total || data.notifications?.length || 0);

                setTotalPages(
                    Math.ceil(
                        (data.total || data.notifications?.length || 0) / 10
                    ) || 1
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