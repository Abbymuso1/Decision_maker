import * as React from "react";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { ThemeProvider } from "@mui/material/styles";
import theme from "../theme/theme";
import { NavLink, useNavigate } from "react-router-dom";
import { useBreadcrumbs } from "../contexts/BreadcrumbsProvider";

import IconButton from "@mui/material/IconButton";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";

import { signUp, signIn } from "../supabase/auth"; // Import signIn function as well

import Snackbar from "@mui/material/Snackbar";
import MuiAlert, { AlertProps } from "@mui/material/Alert";
import { useAuth } from "../contexts/AuthContext";

function Alert(props: AlertProps) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

interface RegisterProps {
  setAuth: React.Dispatch<React.SetStateAction<boolean>>;
}

function Register({ setAuth }: RegisterProps) {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const { handleNavigation } = useBreadcrumbs();
  const [successMessageOpen, setSuccessMessageOpen] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");

  const handleCloseSnackbar = () => {
    setSuccessMessageOpen(false);
    if (errorMessage) setErrorMessage("");
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;

    const displayName = `${firstName}`;
    try {
      // Register the user
      await signUp(email, password, displayName);

      // Automatically sign in the user
      await signIn(email, password);

      // Update authentication state
      setAuth(true);
      navigate("/", { state: { isAuthenticated: true, message: "Registration successful!" } });
      setSuccessMessageOpen(true);
    } catch (error: any) {
      console.error("Registration or sign-in error:", error.message);
      setErrorMessage("Registration or sign-in failed. Please try again.");
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={2}>
              <Link href="/" style={{ textDecoration: "none" }}>
                <IconButton color="secondary">
                  <ArrowBackIosIcon />
                </IconButton>
              </Link>
            </Grid>
            <Grid item xs={10}>
              <Typography variant="h6">
                <NavLink
                  to="/"
                  onClick={() => handleNavigation("/", "Home")}
                  style={{ textDecoration: "none", color: "#337357" }}
                >
                  DecisionMaker
                </NavLink>
              </Typography>
            </Grid>
          </Grid>
          <Typography variant="body1">Sign up</Typography>
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 3 }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="given-name"
                  name="firstName"
                  required
                  fullWidth
                  id="firstName"
                  label="First Name"
                  autoFocus
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  name="lastName"
                  autoComplete="family-name"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign Up
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="/login" variant="body2">
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
          {errorMessage && (
            <Snackbar open={!!errorMessage} autoHideDuration={6000} onClose={handleCloseSnackbar}>
              <Alert onClose={handleCloseSnackbar} severity="error">
                {errorMessage}
              </Alert>
            </Snackbar>
          )}
          <Snackbar
            open={successMessageOpen}
            autoHideDuration={6000}
            onClose={handleCloseSnackbar}
          >
            <Alert onClose={handleCloseSnackbar} severity="success">
              Registration successful!
            </Alert>
          </Snackbar>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default Register;
