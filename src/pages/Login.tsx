// Login.tsx
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
import { useAuth } from "../contexts/AuthContext"; // Import useAuth
import { DecisionStateContext } from "../contexts/DecisionStateContext";
import { useContext } from "react";

interface LoginProps {
  setAuth: React.Dispatch<React.SetStateAction<boolean>>;
}

const Login: React.FC<LoginProps> = ({ setAuth }) => {
  const navigate = useNavigate();
  const { handleNavigation } = useBreadcrumbs();
  const { signIn } = useAuth();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [emailError, setEmailError] = React.useState("");
  const [passwordError, setPasswordError] = React.useState("");
  const [loginError, setLoginError] = React.useState("");
  const { setDecisionState } = useContext(DecisionStateContext); // Get context to reset state

  const validateForm = () => {
    let isValid = true;

    if (!email || !email.includes("@")) {
      setEmailError("Invalid email address");
      isValid = false;
    } else {
      setEmailError("");
    }

    if (!password || password.length < 6) {
      setPasswordError("Password must be at least 6 characters long");
      isValid = false;
    } else {
      setPasswordError("");
    }

    return isValid;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await signIn(email, password);
      setAuth(true);
      setDecisionState({
        model: "AHP",
        decision: "",
        criteria: [],
        options: [],
        aggregatedPreferences: {},
        totalScores: {},
      }); // Reset the decision state on login
      navigate("/", {
        state: { isAuthenticated: true, message: "Login successful!" },
      });
    } catch (error: any) {
      setLoginError("Incorrect email or password");
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
          <Typography variant="body1">Sign in</Typography>

          <Typography variant="body2" color="error">
            {loginError}
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 3 }}
          >
            <TextField
              error={!!emailError}
              helperText={emailError}
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              error={!!passwordError}
              helperText={passwordError}
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="/register" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default Login;
