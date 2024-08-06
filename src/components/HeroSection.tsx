import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Grid,
  useMediaQuery,
  styled,
  Button,
  Snackbar,
  Alert,
} from "@mui/material";
import CustomButton from "./Button";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import SettingsIcon from "@mui/icons-material/Settings";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import { useBreadcrumbs } from "../contexts/BreadcrumbsProvider";
import theme from "../theme/theme";
import Lottie from "react-lottie-player";
import animationData from "../animations/success.json";
import LoginModal from "./LoginModal";
import { useAuth } from "../contexts/AuthContext";

const HeroContent: React.FC<any> = ({ isSmallScreen, goToNewDecision }) => {
  const StyledIcon = styled("span")({
    color: isSmallScreen ? theme.palette.primary.main : "#337357",
  });

  const { isAuthenticated } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleButtonClick = () => {
    console.log("User isAuthenticated:", isAuthenticated); // Log to check state
    if (!isAuthenticated) {
      setModalOpen(true);
    } else {
      navigate("/NewDecision"); // Redirect if the user is authenticated
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  return (
    
    <Box sx={{ padding: isSmallScreen ? 2 : 3 }}>
      <Typography
        variant={isSmallScreen ? "subtitle3" : "subtitle2"}
        gutterBottom
        color={isSmallScreen ? "#ffffff" : "#ffffff"} // Use white for contrast
        align={isSmallScreen ? "center" : "left"}
      >
        DecisionMaker, The Ultimate Decision-Making Companion
      </Typography>{" "}
      <Typography
        variant={isSmallScreen ? "h1" : "subtitle1"}
        gutterBottom
        color={isSmallScreen ? "#ffffff" : "#ffffff"} // Use white for contrast
        align={isSmallScreen ? "center" : "left"}
        style={{ marginTop: isSmallScreen ? 8 : 0 }}
      >
        Simplify Complex Choices, Achieve Your Goals with Ease
      </Typography>
      <Typography
        variant="subtitle1"
        gutterBottom
        color={isSmallScreen ? "#ffffff" : "#ffffff"} // Use white for contrast
        style={{ marginTop: 20 }}
        align={isSmallScreen ? "center" : "left"}
      >
        Key Features:
      </Typography>
      <Box style={{ textAlign: isSmallScreen ? "center" : "left" }}>
        <Box display="flex" alignItems="center" marginBottom={1}>
          <StyledIcon>
            <CheckCircleIcon className="animate__animated animate__bounce" />
          </StyledIcon>
          <Typography
            variant={isSmallScreen ? "body1" : "subtitle1"}
            color={isSmallScreen ? "#ffffff" : "#ffffff"} // Use white for contrast
            style={{ marginLeft: isSmallScreen ? "8px" : "16px" }}
          >
            Intuitive Decision Wizard
          </Typography>
        </Box>
        <Box display="flex" alignItems="center" marginBottom={1}>
          <StyledIcon>
            <SettingsIcon className="animate__animated animate__bounce" />
          </StyledIcon>
          <Typography
            variant={isSmallScreen ? "body1" : "subtitle1"}
            color={isSmallScreen ? "#ffffff" : "#ffffff"} // Use white for contrast
            style={{ marginLeft: isSmallScreen ? "8px" : "16px" }}
          >
            Customizable Decision Criteria
          </Typography>
        </Box>
        <Box display="flex" alignItems="center" marginBottom={1}>
          <StyledIcon>
            <AnalyticsIcon className="animate__animated animate__bounce" />
          </StyledIcon>
          <Typography
            variant={isSmallScreen ? "body1" : "subtitle1"}
            color={isSmallScreen ? "#ffffff" : "#ffffff"} // Use white for contrast
            style={{ marginLeft: isSmallScreen ? "8px" : "16px" }}
          >
            Data Analysis
          </Typography>
        </Box>
      </Box>
      <Box justifyContent="center" mt={5}>
        <Grid
          container
          spacing={2}
          justifyContent={isSmallScreen ? "center" : "flex-start"}
        >
          <Grid item xs={12} sm={6} lg={4}>
          <Button
        onClick={handleButtonClick}
        variant="contained"
        sx={{
          boxShadow: "0 0 10px rgba(255, 255, 255, 0.8)",  // Glow effect
          transition: "box-shadow 0.3s ease-in-out",
          "&:hover": {
            boxShadow: "0 0 15px rgba(255, 255, 255, 1)",  // Intense glow on hover
          },
        }}
      >
        Get Started
      </Button>
            <LoginModal open={modalOpen} onClose={handleCloseModal} />
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

const HeroSection: React.FC = () => {
  const isSmallScreen = useMediaQuery("(max-width:600px)");
  const isTabletScreen = useMediaQuery(
    "(min-width:600px) and (max-width:1024px)"
  );
  const isLargeScreen = useMediaQuery("(min-width:1024px)");
  const isLandscape = useMediaQuery("(orientation: landscape)");

  const { handleNavigation } = useBreadcrumbs();
  const goToNewDecision = () => {
    handleNavigation("/NewDecision", "New Decision");
  };

  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (location.state?.message) {
      setMessage(location.state.message);
      setOpen(true);
    }
  }, [location.state]);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Box
      sx={{
        height: "100vh",
        background: "linear-gradient(to top, #2e8b57 0%, #3cb371 100%)",
      }}
    >
      <Grid container style={{ height: "100%" }}>
        {(isSmallScreen && !isLandscape) || isTabletScreen ? (
          // Stacked layout for small screens and tablets in portrait orientation
          <>
            <Grid item xs={12} style={{ height: "50%" }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100%",
                }}
              >
                <Lottie
                  loop
                  animationData={animationData}
                  play
                  style={{ width: "100%", height: "100%" }}
                />
              </Box>
            </Grid>
            <Grid item xs={12} style={{ height: "50%" }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100%",
                }}
              >
                <HeroContent
                  isSmallScreen={isSmallScreen}
                  goToNewDecision={goToNewDecision}
                />
              </Box>
            </Grid>
          </>
        ) : (
          // Side-by-side layout for larger screens and small screens in landscape orientation
          <>
            <Grid item xs={12} md={6} style={{ height: "100%" }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100%",
                }}
              >
                <Lottie
                  loop
                  animationData={animationData}
                  play
                  style={{ width: "100%", height: "100%" }}
                />
              </Box>
            </Grid>
            <Grid item xs={12} md={6} style={{ height: "100%" }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100%",
                }}
              >
                <HeroContent
                  isSmallScreen={isSmallScreen}
                  goToNewDecision={goToNewDecision}
                />
              </Box>
            </Grid>
          </>
        )}
      </Grid>
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="success">
          {message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default HeroSection;
