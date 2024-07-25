import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";
import {Tickers} from "./Tickers";
import {Logout} from "@mui/icons-material";
import AppBar from "@mui/material/AppBar";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Toolbar from "@mui/material/Toolbar";
import Container from "@mui/material/Container";
import Cookies from "js-cookie";


export function PageHome() {
    const navigate = useNavigate();
    const handleLogOut = () => {
        Cookies.remove("accessToken")
        navigate('/login')
    }

    return (
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
            <AppBar>
                <Toolbar>
                    <Typography component="h1" variant="h6" color="inherit" noWrap sx={{ flexGrow: 1 }}>
                      Dividends Teller
                    </Typography>
                    <IconButton color="inherit" onClick={handleLogOut}>
                        <Logout />
                    </IconButton>
                </Toolbar>
            </AppBar>
        <Box
          component="main"
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === 'light'
                ? theme.palette.grey[100]
                : theme.palette.grey[900],
            flexGrow: 1,
            height: '100vh',
            overflow: 'auto',
          }}
        >
          <Toolbar />
          <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
              <Grid item xs={12}>
                <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
                    <Tickers />
                </Paper>
              </Grid>
          </Container>
        </Box>
      </Box>
    )
}
