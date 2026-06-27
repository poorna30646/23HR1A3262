import { CssBaseline, Container } from "@mui/material";
import { NotificationsPage } from "./pages/NotificationsPage";

export default function App() {

    return (
        <>
            <CssBaseline />

            <Container maxWidth="md">

                <NotificationsPage />

            </Container>
        </>
    );

}