import { useEffect, useState } from "react";

import {
    Alert,
    Badge,
    Box,
    CircularProgress,
    Divider,
    Stack,
    Typography
} from "@mui/material";

import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";

import { fetchPriorityNotifications } from "../api/notifications";
import { NotificationCard } from "../components/NotificationCard";

export function PriorityNotificationsPage() {

    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {

        const loadPriorityNotifications = async () => {

            try {

                setLoading(true);
                setError(null);

                const data = await fetchPriorityNotifications();

                setNotifications(data);

            } catch (err) {

                console.error(err);

                setError(
                    err.response?.data?.message ||
                    err.message ||
                    "Something went wrong"
                );

            } finally {

                setLoading(false);

            }

        };

        loadPriorityNotifications();

    }, []);

    return (

        <Box
            sx={{
                maxWidth: 720,
                mx: "auto",
                px: 2,
                py: 4
            }}
        >

            <Stack
                direction="row"
                alignItems="center"
                spacing={1.5}
                mb={3}
            >

                <Badge
                    badgeContent={notifications.length}
                    color="error"
                    max={99}
                >

                    <NotificationsActiveIcon sx={{ fontSize: 30 }} />

                </Badge>

                <Typography
                    variant="h5"
                    fontWeight={700}
                >
                    Priority Notifications
                </Typography>

            </Stack>

            <Divider sx={{ mb: 3 }} />

            {loading && (

                <Box
                    display="flex"
                    justifyContent="center"
                    py={6}
                >

                    <CircularProgress />

                </Box>

            )}

            {!loading && error && (

                <Alert severity="error">

                    {error}

                </Alert>

            )}

            {!loading && !error && notifications.length === 0 && (

                <Alert severity="info">

                    No priority notifications found.

                </Alert>

            )}

            {!loading && !error && notifications.length > 0 && (

                <Stack spacing={2}>

                    {notifications.map((notification) => (

                        <NotificationCard
                            key={notification.ID}
                            notification={notification}
                        />

                    ))}

                </Stack>

            )}

        </Box>

    );

}