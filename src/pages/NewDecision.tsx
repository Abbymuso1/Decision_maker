import React, { useState, useContext } from "react";
import {
  Box,
  Grid,
  Typography,
  Stack,
  Button,
  useMediaQuery,
  useTheme,
  Paper,
  TextField,
  Alert,
  Snackbar,
} from "@mui/material";
import Layout from "../components/Layout";
import GolfCourseIcon from "@mui/icons-material/GolfCourse";
import BasicTextField from "../components/input-field";
import { Field } from "../components/interfaces/InputFieldProps";
import { useBreadcrumbs } from "../contexts/BreadcrumbsProvider";
import BackButton from "../components/BackButton";
import { DecisionStateContext } from "../contexts/DecisionStateContext";
import DecisionState from "../components/interfaces/DecisionState";

const NewDecision: React.FC = () => {
  const [decision, setDecision] = useState<string>("");
  const [notificationOpen, setNotificationOpen] = useState(false);
  const { decisionState, setDecisionState } = useContext(DecisionStateContext);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const fields: Field[] = [
    {
      id: "filled-basic",
      label: 'E.g. "To Buy a Car"',
      variant: "filled",
      defaultValue: "",
      name: "decision",
      value: decision,
      onChange: (e) => {
        setDecision(e.target.value);
      },
    },
  ];

  const decisionObject: Partial<DecisionState> = {
    decision: decision,
  };

  const updateDecisionState = (updatedProperties: Partial<DecisionState>) => {
    setDecisionState((prevState) => ({
      ...prevState,
      ...updatedProperties,
    }));
  };

  const { handleNavigation } = useBreadcrumbs();
  const EnterNewCriteria = () => {
    if (decision.trim() === "") {
      setNotificationOpen(true); // Show notification if input is empty
      return;
    }
    
    updateDecisionState(decisionObject);
    handleNavigation("/ExistingCriteria", "Existing Criteria");
  };

  
  return (
    <Layout>
      <Stack style={{ margin: "2vh" }}>
        <div style={{ marginLeft: "30px" }}>
          {" "}
          <BackButton />
        </div>
      </Stack>
      <Stack
        direction="column"
        spacing={2}
        alignItems="center"
        textAlign="center"
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
          <Stack
            direction="column"
            spacing={2}
            alignItems="center"
            justifyContent="center"
            sx={{ p: 2 }}
          >
          <Typography
        variant="h3"
        align="center"
        sx={{
          fontSize: {
            xs: '1.5rem', // Extra small screens (mobile)
            sm: '2rem',   // Small screens (tablets)
            md: '2rem', // Medium screens (small desktops)
            lg: '2rem'    // Large screens (large desktops)
          }
        }}
      >
        Let us Begin With The End in Mind.
      </Typography>
      <Typography
        variant="h3"
        align="center"
        sx={{
          fontSize: {
            xs: '1rem', // Extra small screens (mobile)
            sm: '2rem',   // Small screens (tablets)
            md: '2rem', // Medium screens (small desktops)
            lg: '2rem'    // Large screens (large desktops)
          }
        }}
      >
        What Decision Are You Trying to Make?
      </Typography>
      <GolfCourseIcon
        sx={{ 
          fontSize: {
            xs: 30, // Extra small screens (mobile)
            sm: 35, // Small screens (tablets)
            md: 40, // Medium screens (small desktops)
            lg: 45  // Large screens (large desktops)
          }
        }}
      />
            <TextField
              id="filled-basic"
              defaultValue=""
              name="decision"
              label='E.g. "To Buy a Car"'
              variant="filled"
              value={decision}
              onChange={(e) => setDecision(e.target.value)}
              fullWidth
            />

            <Button
              variant="contained"
              sx={{
                borderRadius: "16px",
                paddingRight: 2,
                paddingLeft: 2,
                marginBottom: 2,
                minWidth: "200px", // Adjust the width as desired
              }}
              onClick={EnterNewCriteria}
              type="submit"
            >
              PROCEED
            </Button>
          </Stack>
        </Paper>
      </Stack>

      {/* Notification Snackbar */}
      <Snackbar
        open={notificationOpen}
        autoHideDuration={3000}
        onClose={() => setNotificationOpen(false)}
        message="Please enter a decision before proceeding."
      >
        <Alert onClose={() => setNotificationOpen(false)} severity="warning">
          Please enter a decision before proceeding.
        </Alert>
      </Snackbar>
    </Layout>
  );
};

export default NewDecision;
