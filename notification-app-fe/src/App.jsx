import { useState } from "react";

import {
    CssBaseline,
    Container,
    Tabs,
    Tab,
    Box
} from "@mui/material";

import { NotificationsPage } from "./pages/NotificationsPage";
import { PriorityNotificationsPage } from "./pages/PriorityNotificationsPage";

export default function App() {

    const [tab, setTab] = useState(0);

    const handleChange = (_, newValue) => {

        setTab(newValue);

    };

    return (
        <>
            <CssBaseline />

            <Container maxWidth="md">

                <Box sx={{ mt: 4, mb: 3 }}>

                    <Tabs
                        value={tab}
                        onChange={handleChange}
                        centered
                    >
                        <Tab label="All Notifications" />
                        <Tab label="Priority Notifications" />
                    </Tabs>

                </Box>

                {tab === 0 && <NotificationsPage />}
                {tab === 1 && <PriorityNotificationsPage />}

            </Container>
        </>
    );

}