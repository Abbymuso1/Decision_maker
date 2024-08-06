import React, { useContext, useState } from "react";
import BackButton from "../components/BackButton";
import {
  Button,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
  Paper,
  Snackbar,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import { styled } from "@mui/material/styles";
import AdsClickIcon from "@mui/icons-material/AdsClick";
import PsychologyAltIcon from "@mui/icons-material/PsychologyAlt";
import CustomButton from "../components/Button";
import { NavLink } from "react-router-dom";
import Layout from "../components/Layout";
import { useBreadcrumbs } from "../contexts/BreadcrumbsProvider";
import { DecisionStateContext } from "../contexts/DecisionStateContext";
import DecisionState, {
  Criterion,
} from "../components/interfaces/DecisionState"; // Import the required types
import DeleteIcon from "@mui/icons-material/Delete";

interface Comparison {
  [option: string]: {
    [otherOption: string]: number;
  };
}

const handleClick = () => {
  console.log("Button is Clicked");
};

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

const OtherNewOption = () => {
  const { decisionState, setDecisionState } = useContext(DecisionStateContext);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const { handleNavigation } = useBreadcrumbs();

  const options = decisionState.options;

  const EvaluateOptions = () => {
    if (options.length < 2) {
      setSnackbarOpen(true); // Open snackbar if less than two options
      return;
    }

    const initializeComparisons = (
      criteria: Criterion[],
      options: string[]
    ) => {
      return criteria.map((criterion) => {
        const comparisons: Comparison = {};
        options.forEach((option, i) => {
          comparisons[option] = {};
          options.slice(i + 1).forEach((nextOption) => {
            comparisons[option][nextOption] = 0; // Default comparison value
          });
        });
        return { ...criterion, comparisons };
      });
    };

    const updatedCriteria = initializeComparisons(
      decisionState.criteria,
      decisionState.options
    );
    setDecisionState({ ...decisionState, criteria: updatedCriteria });

    handleNavigation("/EvaluateOptionsPage", "Evaluate Options");
  };

  const updateDecisionState = (updatedProperties: Partial<DecisionState>) => {
    setDecisionState((prevState) => ({
      ...prevState,
      ...updatedProperties,
    }));
  };

  const handleDelete = (id: number) => {
    options.splice(id, 1);
    updateDecisionState({ options: options });
  };

  return (
    <Layout>
      <Stack sx={{ margin: isMobile ? "0" : "0 30px" }}>
        <BackButton />
      </Stack>
      <Stack
        direction="column"
        spacing={2}
        alignItems="center"
        justifyContent="center"
        sx={{ p: 2 }}
      >
        <Paper sx={{ p: 4, boxShadow: 3 }}>
          <Typography variant="h4" align="center">
            Do you want to Add Another Option?
          </Typography>
          <Stack alignItems="center" sx={{ mt: 2 }}>
            <PsychologyAltIcon style={{ fontSize: "56px", padding: "2" }} />
          </Stack>
          <Stack
            sx={{ p: 1, flexDirection: isMobile ? "column" : "row", mt: 2 }}
            gap={2}
            alignItems="center"
            justifyContent="center"
          >
            <NavLink
              to="/newOption"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <CustomButton onClick={handleClick}>Yes</CustomButton>
            </NavLink>

            <CustomButton
              variant="contained"
              // color="primary"
              onClick={EvaluateOptions}
            >
              No
            </CustomButton>
          </Stack>
        </Paper>
      </Stack>
      <Stack sx={{ p: 1 }} gap={4} direction="column">
        <Grid
          container
          padding={2}
          rowSpacing={2}
          columnSpacing={{ xs: 1, sm: 2, md: 3 }}
        >
          {decisionState.options.map((option, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Item>
                <Stack
                  gap={2}
                  direction={isMobile ? "column" : "row"}
                  alignItems="center"
                  justifyContent="center"
                >
                  <AdsClickIcon style={{ fontSize: "56px", padding: "2" }} />
                  <Stack>
                    <Typography variant="body1">{option}</Typography>
                    <Typography variant="body1">{index}</Typography>
                    <Button
                      onClick={() => handleDelete(index)}
                      variant="outlined"
                      startIcon={<DeleteIcon />}
                    >
                      Delete
                    </Button>
                  </Stack>
                </Stack>
              </Item>
            </Grid>
          ))}
        </Grid>
      </Stack>

      {/* Snackbar for validation message */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        message="Please enter at least two options before proceeding."
      />
    </Layout>
  );
};

export default OtherNewOption;
