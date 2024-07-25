import {Login} from "@mui/icons-material";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import {FormEvent, useState} from "react";
import { useNavigate } from "react-router-dom";
import {signIn} from "./authService";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import Avatar from "@mui/material/Avatar";
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import LinearProgress from "@mui/material/LinearProgress";


export default function PageSignIn() {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const navigate = useNavigate();

    const onLogIn = () => {
        navigate('/')
    }

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault()
        setLoading(true)
        signIn(email, password).then(r => {onLogIn()})
    }

    return (
        <Container component="main" maxWidth="xs">
            <Box sx={{marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                  <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                    <LockOutlinedIcon />
                  </Avatar>
                <Typography variant="h5" component="h1" sx={{ mb: 2 }}>
                  Sing in
                </Typography>
                <Box component="form" noValidate sx={{ mt: 1 }} onSubmit={handleSubmit}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        autoComplete="email"
                        autoFocus
                        onChange={(e) => {setEmail(e.target.value)}} />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                        onChange={(e) => {setPassword(e.target.value)}} />
                    {loading &&
                        <LinearProgress id="loading" />
                    }
                    <Button
                        type="submit"
                        id="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                        startIcon={<Login />} >
                      Login
                    </Button>
                </Box>
            </Box>
        </Container>
    )
}
