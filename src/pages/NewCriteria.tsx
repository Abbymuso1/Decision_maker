import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Stack,
  Typography,
  Box,
  TextField,
  useMediaQuery,
  useTheme,
  Paper,
  Snackbar,
  Alert,
} from "@mui/material";
import BackButton from "../components/BackButton";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import Layout from "../components/Layout";
import { DecisionStateContext } from "../contexts/DecisionStateContext";
import { useBreadcrumbs } from "../contexts/BreadcrumbsProvider";
import { supabase } from "../supabase/supabaseClient"; // Import supabase client
import { getUserId } from "../supabase/auth"; // Import getUserId function

const NewCriteria = () => {
  const [criterion, setCriterion] = useState<string>("");
  const [notificationOpen, setNotificationOpen] = useState(false);
  const { decisionState, setDecisionState } = useContext(DecisionStateContext);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();
  const { handleNavigation } = useBreadcrumbs();

  const addCriteria = async () => {
    if (criterion.trim() === "") {
      setNotificationOpen(true); // Show notification if input is empty
      return;
    }

    const userId = await getUserId(); // Get the current user's ID

    if (userId) {
      // Add the new criterion to the database only if the user is authenticated
      const { data, error } = await supabase
        .from("criteria")
        .insert([{ name: criterion, user_id: userId }]);

      if (error) {
        console.error("Error adding criteria:", error);
        return;
      }
    } else {
      console.log("User not authenticated. Criterion will not be saved to the database.");
    }

    // Update the local state with the new criterion
    const newCriterion = { name: criterion, weight: 1, comparisons: {} };
    const updatedCriteria = [...decisionState.criteria, newCriterion];
    setDecisionState({ ...decisionState, criteria: updatedCriteria });

    handleNavigation("/OtherNewCriteria", "Add Another Criteria");
  };

  return (
    <Layout>
      <Stack sx={{ margin: isMobile ? "0" : "0 30px", p: 2 }}>
        <BackButton />
      </Stack>
      <Stack
        direction="column"
        spacing={2}
        alignItems="center"
        justifyContent="center"
        sx={{ p: 2, mx: 2 }}
      >
        <Paper
          sx={{
            p: isMobile ? 2 : 4,
            boxShadow: 3,
            width: "100%",
            maxWidth: "600px",
            margin: "auto",
          }}
        >
          <Typography variant="h3" align="center">
            Type in a New Criteria
          </Typography>
          <Stack alignItems="center" sx={{ mt: 2 }}>
            <FormatListBulletedIcon
              style={{ fontSize: "56px", padding: "2" }}
            />
          </Stack>
          <Stack
            direction="column"
            spacing={2}
            alignItems="center"
            justifyContent="center"
            sx={{ mt: 2, mb: isMobile ? 4 : 8, px: isMobile ? 2 : 3 }}
          >
            <Box
              sx={{
                width: "100%",
                "& > :not(style)": { m: 1 },
              }}
            >
              <TextField
                id="filled-basic"
                name="newCriteria"
                label="e.g., Cost, Comfort"
                variant="filled"
                value={criterion}
                onChange={(e) => setCriterion(e.target.value)}
                fullWidth
              />
            </Box>
            <Button
              variant="contained"
              sx={{
                borderRadius: "16px",
                paddingRight: 2,
                paddingLeft: 2,
                marginBottom: 2,
                minWidth: "200px",
              }}
              onClick={addCriteria}
              type="submit"
            >
              Submit New Criteria
            </Button>
            <Typography variant="body1" sx={{ my: 2 }}>
              or
            </Typography>
            <Button
              variant="outlined"
              onClick={() => navigate("/ExistingCriteria")}
              sx={{
                borderRadius: "16px",
                paddingRight: 2,
                paddingLeft: 2,
                minWidth: "200px",
              }}
            >
              View Existing Criteria
            </Button>
          </Stack>
        </Paper>
      </Stack>

      {/* Notification Snackbar */}
      <Snackbar
        open={notificationOpen}
        autoHideDuration={3000}
        onClose={() => setNotificationOpen(false)}
      >
        <Alert onClose={() => setNotificationOpen(false)} severity="warning">
          Please enter a criteria before proceeding.
        </Alert>
      </Snackbar>
    </Layout>
  );
};

export default NewCriteria;
