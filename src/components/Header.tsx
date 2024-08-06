import * as React from "react";
import { useState, useEffect, useContext } from "react";
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Button,
  Container,
  Avatar,
  MenuItem,
  Menu,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  useMediaQuery,
  Snackbar,
  Alert,
} from "@mui/material";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import PersonIcon from "@mui/icons-material/Person";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import theme from "../theme/theme";
import { useBreadcrumbs } from "../contexts/BreadcrumbsProvider";
import { getUser, signOut } from "../supabase/auth";
import { supabase } from "../supabase/supabaseClient";
import { useAuth } from "../contexts/AuthContext";
import { DecisionStateContext } from "../contexts/DecisionStateContext";


const navItems = [
  // { label: "DecisionMaker", path: "/" },
  { label: "New Decision", path: "/NewDecision" },
  { label: "Previous Decisions", path: "/PreviousDecision" },
  { label: "About", path: "/aboutUs" },
  { label: "Contact Us", path: "/contactUs" },
];

interface HeaderProps {
  auth: boolean;
  setAuth: React.Dispatch<React.SetStateAction<boolean>>;
}

function Header({ auth, setAuth }: HeaderProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [userProfile, setUserProfile] = useState<{
    displayName: string;
  } | null>(null);
  const { handleNavigation, resetBreadcrumbs } = useBreadcrumbs();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const location = useLocation();

  useEffect(() => {
    const storedAuth = localStorage.getItem("auth");
    if (storedAuth === "true") {
      setAuth(true);
    } else {
      setAuth(false);
    }
  }, [setAuth]);

  useEffect(() => {
    localStorage.setItem("auth", auth.toString());
  }, [auth]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data, error } = await getUser();
        if (error) {
          console.error("Error fetching user:", error.message);
          return;
        }
        if (data && data.user && data.user.id) {
          const userId = data.user.id;

          const { data: userProfileData, error: profileError } = await supabase
            .from("user_profiles")
            .select("display_name")
            .eq("id", userId)
            .single();

          if (profileError) {
            console.error("Error fetching user profile:", profileError.message);
            return;
          }

          if (userProfileData) {
            setUserProfile({ displayName: userProfileData.display_name });
            setAuth(true);
          } else {
            setAuth(false);
          }
        } else {
          setAuth(false);
        }
      } catch (error: any) {
        console.error("Error fetching user:", error.message);
        setAuth(false);
      }
    };
    fetchUser();
  }, [setAuth]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const { signOut } = useAuth();
  const { setDecisionState } = useContext(DecisionStateContext); // Correct placement of useContext

  const handleSignOut = async () => {
    await signOut();
    setAuth(false);
    setUserProfile(null);
    setSnackbarMessage("Logout successful!");
    setSnackbarOpen(true);
    handleClose();
  
    
    // Reset decision state
    setDecisionState({
      model: "AHP",
      decision: "",
      criteria: [],
      options: [],
      aggregatedPreferences: {},
      totalScores: {},
    });
  
    navigate("/", { state: { isAuthenticated: false } });
  };
  
  const navigate = useNavigate();
  const handleLogout = async () => {
    await signOut();
    navigate("/login", { state: { isAuthenticated: false } });
    window.location.reload(); // Refresh the page
  };

  const isSmallScreen = useMediaQuery("(max-width:600px)");

  const drawer = (
    <Box sx={{ width: 250 }} onClick={handleDrawerToggle}>
      <Typography variant="h6" sx={{ textAlign: "center", my: 2 }}>
        DecisionMaker
      </Typography>
      <List>
        {navItems.map((item) => (
          <ListItem
            key={item.label}
            button
            component={NavLink}
            to={item.path}
            onClick={() => handleNavigation(item.path, item.label)}
          >
            <ListItemText primary={item.label} />
          </ListItem>
        ))}
        {!auth && (
          <>
            <ListItem button component={NavLink} to="/login">
              <ListItemText primary="Login" />
            </ListItem>
            <ListItem button component={NavLink} to="/register">
              <ListItemText primary="Register" />
            </ListItem>
          </>
        )}
        {auth && (
          <>
            <ListItem button onClick={handleSignOut}>
              <ListItemIcon>
                <ExitToAppIcon />
              </ListItemIcon>
              <ListItemText primary="Log Out" />
            </ListItem>
            {isSmallScreen && (
              <ListItem>
                <ListItemText
                  primary={`Logged in as ${userProfile?.displayName}`}
                />
              </ListItem>
            )}
          </>
        )}
      </List>
    </Box>
  );

  const unauthenticated = (
    <Box sx={{ display: "flex", alignItems: "center", padding: "0.5rem" }}>
      <IconButton
        sx={{
          backgroundColor: "#f5f5f5",
          borderRadius: "10px",
          marginRight: "0.6rem",
        }}
        aria-label="user-icon"
      >
        <PersonIcon />
      </IconButton>
      <Typography variant="body1">
        <NavLink to="/login" style={{ color: "black", textDecoration: "none" }}>
          Login
        </NavLink>{" "}
        |{" "}
        <NavLink
          to="/register"
          style={{ color: "black", textDecoration: "none" }}
        >
          Register
        </NavLink>
      </Typography>
    </Box>
  );

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };
  return (
    <>
      <AppBar
        sx={{
          background: theme.palette.background.default,
          color: theme.palette.primary.main,
        }}
      >
        <Container maxWidth="xl">
          <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ display: { md: "none" } }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6">
              <NavLink
                to="/"
                onClick={() => handleNavigation("/", "Home")}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                DecisionMaker
              </NavLink>
            </Typography>
            <Box
              sx={{
                display: { xs: "none", md: "flex" },
                flexGrow: 1,
                justifyContent: "space-around",
                gap: "1.75rem",
              }}
            >
              {navItems.map((item) => (
                <NavLink
                  key={item.label}
                  to={item.path}
                  onClick={() => handleNavigation(item.path, item.label)}
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <Button>{item.label}</Button>
                </NavLink>
              ))}
            </Box>
            <Box sx={{ display: { xs: "none", md: "flex" } }}>
              {auth ? (
                <>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Avatar sx={{ borderRadius: "10px" }}>
                      {userProfile ? userProfile.displayName.charAt(0) : "U"}
                    </Avatar>
                    <Box sx={{ marginLeft: "8px" }}>
                      {userProfile ? userProfile.displayName : "User"}
                    </Box>
                    <IconButton
                      aria-controls="user-menu"
                      aria-haspopup="true"
                      onClick={handleClick}
                      aria-label="expand more"
                    >
                      <ExpandMoreIcon />
                    </IconButton>
                    <Menu
                      id="user-menu"
                      anchorEl={anchorEl}
                      open={Boolean(anchorEl)}
                      onClose={handleClose}
                    >
                      <MenuItem onClick={handleSignOut}>Log Out</MenuItem>
                    </Menu>
                  </Box>
                  {isSmallScreen && (
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        marginTop: "0.5rem",
                      }}
                    >
                      <Typography variant="body2">{`Logged in as ${userProfile?.displayName}`}</Typography>
                    </Box>
                  )}
                </>
              ) : (
                unauthenticated
              )}
            </Box>
          </Toolbar>
        </Container>
        <Drawer
          anchor="left"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          sx={{ display: { md: "none" } }}
        >
          {drawer}
        </Drawer>
      </AppBar>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000} // Adjust as per your preference
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={handleSnackbarClose} severity="success">
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
}
export default Header;
