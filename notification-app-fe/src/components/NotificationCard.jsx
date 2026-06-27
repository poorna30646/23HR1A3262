import {
    Card,
    CardContent,
    Chip,
    Stack,
    Typography
} from "@mui/material";

export function NotificationCard({ notification }) {

    const colorMap = {
        Placement: "success",
        Result: "warning",
        Event: "primary"
    };

    return (
        <Card elevation={2}>
            <CardContent>

                <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    mb={1}
                >

                    <Chip
                        label={notification.Type}
                        color={colorMap[notification.Type] || "default"}
                        size="small"
                    />

                    <Typography
                        variant="caption"
                        color="text.secondary"
                    >
                        {notification.Timestamp}
                    </Typography>

                </Stack>

                <Typography variant="body1">
                    {notification.Message}
                </Typography>

            </CardContent>
        </Card>
    );

}